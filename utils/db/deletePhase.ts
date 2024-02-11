"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const deletePhase = async (contract_address: string, phases: string) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    const { data, error } = await supabase
      .from("phases")
      .update([{ contract_address, phases }])
      .eq("contract_address", contract_address)
      .select();

    if (error?.code) return error;

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
