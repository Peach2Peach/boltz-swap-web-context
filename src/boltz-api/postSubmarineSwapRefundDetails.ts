import { PartialSignature, SubmarineRefundRequest } from './types'

export const postSubmarineSwapRefundDetails = async (
  id: string,
  apiUrl: string,
  body: SubmarineRefundRequest
): Promise<PartialSignature> => {
  const response = await fetch(`${apiUrl}/v2/swap/submarine/${id}/refund`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(body),
  })

  return response.json()
}
