"use server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const readAddress = async (address: string) => {
  const supabase = createServerComponentClient({ cookies });

  try {
    let { data: deployment, error } = await supabase
      .from("deployment")
      .select("*")
      .eq("wallet_address", address);

    if (error?.code) return error;

    return deployment;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
