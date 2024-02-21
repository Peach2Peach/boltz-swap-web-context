import { ReverseClaimRequest } from "./types";


export const postClaimReverseSubmarineSwap = async (id: string, apiUrl: string, body: ReverseClaimRequest) => {
  const response = await fetch(`${apiUrl}/v2/swap/reverse/${id}/claim`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body)
  });

  return response.json();
};
