"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const readPhases = async (contract_address: string) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    let { data: deployment, error } = await supabase
      .from("phases")
      .select("*")
      .eq("contract_address", contract_address);

    if (error?.code) return error;

    return deployment;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
