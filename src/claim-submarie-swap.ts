import * as ecc from '@bitcoinerlab/secp256k1'
import zkpInit from '@vulpemventures/secp256k1-zkp'
import { crypto } from 'bitcoinjs-lib'
import * as bolt11 from 'bolt11'
import { Musig, SwapTreeSerializer } from 'boltz-core'
import { TaprootUtils, init } from 'boltz-core/dist/lib/liquid'
import { Buffer } from 'buffer'
import { randomBytes } from 'crypto'
import ECPairFactory from 'ecpair'
import { getSubmarineSwapClaimDetails } from './boltz-api/getSubmarineSwapClaimDetails'
import { postClaimSubmarineSwap } from './boltz-api/postClaimSubmarineSwap'
import { SubmarineResponse } from './boltz-api/types'
import { SESSION_ID_BYTES } from './constants'
import { LiquidNetworkId, getNetwork } from './utils/getNetwork'

const ECPair = ECPairFactory(ecc)

export type ClaimSubmarineSwapProps = {
  apiUrl: string
  network: LiquidNetworkId
  invoice: string
  swapInfo: SubmarineResponse

  /** hex encoded */
  privateKey: string
}
export const claimSubmarineSwap = async ({
  invoice,
  swapInfo,
  privateKey,
  apiUrl,
  network: networkId,
}: ClaimSubmarineSwapProps) => {
  const { id, claimPublicKey, swapTree } = swapInfo
  if (!claimPublicKey || !swapTree) throw Error('GENERAL_ERROR')

  const network = getNetwork(networkId)

  const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
    network,
  })

  const zkp = await zkpInit()
  init(zkp)

  // Get the information request to create a partial signature
  const claimTxDetails = await getSubmarineSwapClaimDetails(id, apiUrl)
  // Verify that Boltz actually paid the invoice by comparing the preimage hash
  // of the invoice to the SHA256 hash of the preimage from the response
  const invoicePreimageHash = Buffer.from(
    bolt11.decode(invoice).tags.find((tag) => tag.tagName === 'payment_hash')!.data as string,
    'hex'
  )

  if (!crypto.sha256(Buffer.from(claimTxDetails.preimage, 'hex')).equals(invoicePreimageHash)) {
    throw Error('Boltz provided invalid preimage')
  }

  const boltzPublicKey = Buffer.from(claimPublicKey, 'hex')

  // Create a musig signing instance
  const musig = new Musig(zkp, keyPair, randomBytes(SESSION_ID_BYTES), [boltzPublicKey, keyPair.publicKey])

  // Tweak that musig with the Taptree of the swap scripts
  TaprootUtils.tweakMusig(musig, SwapTreeSerializer.deserializeSwapTree(swapTree).tree)

  // Aggregate the nonces
  musig.aggregateNonces([[boltzPublicKey, Buffer.from(claimTxDetails.pubNonce, 'hex')]])

  // Initialize the session to sign the transaction hash from the response
  musig.initializeSession(Buffer.from(claimTxDetails.transactionHash, 'hex'))
  window.ReactNativeWebView.postMessage(JSON.stringify({ data: 'after initializeSession' }))

  // Give our public nonce and the partial signature to Boltz
  const result = await postClaimSubmarineSwap(id, apiUrl, {
    pubNonce: Buffer.from(musig.getPublicNonce()).toString('hex'),
    partialSignature: Buffer.from(musig.signPartial()).toString('hex'),
  })
  window.ReactNativeWebView.postMessage(JSON.stringify(result))

  return result
}
