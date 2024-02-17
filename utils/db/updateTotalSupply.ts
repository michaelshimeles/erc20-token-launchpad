"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const updateTotalSupply = async (
  contract_address: string,
  totalSupply: string
) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from("phases")
      .update([{ total_supply: totalSupply }])
      .eq("contract_address", contract_address)
      .select();

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
