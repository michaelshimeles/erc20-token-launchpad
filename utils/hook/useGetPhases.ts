import { useQuery } from "@tanstack/react-query";
import { readPhases } from "../db/readPhases";

async function fetchPhases(contract_address: string) {
  try {
    const response: any = await readPhases(contract_address);

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetPhases = (contract_address: string) => {
  return useQuery({
    queryKey: ["get-phase", contract_address],
    queryFn: () => fetchPhases(contract_address),
  });
};
