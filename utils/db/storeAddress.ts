"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const storeAddress = async (
  name: string,
  symbol: string,
  contract_address: string,
  address: string
) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from("deployment")
      .insert([{ name, symbol, contract_address, wallet_address: address }])
      .select();

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
