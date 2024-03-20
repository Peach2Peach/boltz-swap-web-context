import { SubmarineTransaction } from './types'

export const getSubmarineTransaction = async (
  id: string,
  apiUrl: string
): Promise<SubmarineTransaction | { error: string }> => {
  const response = await fetch(`${apiUrl}/v2/swap/submarine/${id}/transaction`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return response.json()
}
