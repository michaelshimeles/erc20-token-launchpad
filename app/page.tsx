"use client"
import ContractCard from "@/components/ContractCard";
import { SdkDeploy } from "@/components/sdk-deploy";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Multi-chain Launchpad
      </h1>
      <div className="flex justify-center items-center gap-2">
        <SdkDeploy />
      </div>
      <ContractCard />
    </main>
  );
}
