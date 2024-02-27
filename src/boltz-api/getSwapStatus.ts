export const getSwapStatus = async (id: string, apiUrl: string) => {
  const response = await fetch(`${apiUrl}/v2/swap/${id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })

  return response.json()
}
