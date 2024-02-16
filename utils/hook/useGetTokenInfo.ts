import { useQuery } from "@tanstack/react-query";
import { readTokenInfo } from "../db/readTokenInfo";

async function fetchTokenInfo(contract_address: string) {
  try {
    const response = await readTokenInfo(contract_address);

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetTokenInfo = (contract_address: string) => {
  return useQuery({
    queryKey: ["get-token-info", contract_address],
    queryFn: () => fetchTokenInfo(contract_address),
  });
};
