import { SubmarineClaimDetails } from "./types";

export const getSubmarineSwapClaimDetails = async (id: string, apiUrl: string): Promise<SubmarineClaimDetails> => {
  const response = await fetch(`${apiUrl}/v2/swap/submarine/${id}/claim`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  return response.json();
};
