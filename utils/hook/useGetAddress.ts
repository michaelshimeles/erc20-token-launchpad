import { useQuery } from "@tanstack/react-query";
import { readAddress } from "../db/readAddress";

async function fetchAddress(address: string) {
  try {
    const response: any = await readAddress(address);

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetAddress = (address: string) => {
  return useQuery({
    queryKey: ["get-address", address],
    queryFn: () => fetchAddress(address),
  });
};
