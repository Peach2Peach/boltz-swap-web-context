import { PartialSignature } from "./types";

export const postClaimSubmarineSwap = async (id: string, apiUrl: string, body: PartialSignature) => {
  const response = await fetch(`${apiUrl}/v2/swap/submarine/${id}/claim`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body)
  });

  return response.json();
};
