import { ClaimReverseSubmarineSwapProps, claimReverseSubmarineSwap } from './src/claim-reverse-submarine-swap';

declare global {
  interface Window {
    claimReverseSubmarineSwap: (props: ClaimReverseSubmarineSwapProps) => void
    ReactNativeWebView: {
      postMessage: (string: string) => void
    }
  }
}

window.claimReverseSubmarineSwap = async (args: ClaimReverseSubmarineSwapProps) => {
  try {
    window.ReactNativeWebView.postMessage(JSON.stringify({
      tx: await claimReverseSubmarineSwap(args)
    }))
  } catch (e) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ error: e.message }))

  }
}