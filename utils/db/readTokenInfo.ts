"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const readTokenInfo = async (contract_address: string) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data: deployment, error } = await supabase
      .from("deployment")
      .select("*")
      .eq("contract_address", contract_address);

    if (error?.code) return error;

    return deployment;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
