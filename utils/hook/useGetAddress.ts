import { useQuery } from "@tanstack/react-query";
import { readAddress } from "../db/readAddress";

async function fetchTemplate() {
  try {
    const response: any = await readAddress();

    return response;
  } catch (error) {
    return error;
  }
}

export const useGetAddress = () => {
  return useQuery({
    queryKey: ["get-address"],
    queryFn: () => fetchTemplate(),
  });
};
