import { readTokenInfo } from "@/utils/db/readTokenInfo";
import dynamic from "next/dynamic";
import Image from "next/image";

const MintForm = dynamic(() => import("@/components/form/mint/MintForm"), {
    ssr: false,
});

export default async function MintPage({ params }: { params: { id: string } }) {

    const response = await readTokenInfo(params?.id) as any;

    return (
        <main className="flex min-h-screen flex-col items-center gap-5 p-10">
            {/* <div className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {response?.[0]?.name} <span className="text-sm">Token Mint</span>
            </div> */}
            <div className="flex justify-center items-center w-full gap-8 mt-[6rem] max-w-[1000px] flex-wrap md:flex-nowrap	">
                <Image className="border-8 border-gray-900 rounded-xl shadow" src="/1.png" alt="" width={500} height={200} />
                <MintForm contract_address={params?.id} />
            </div>
        </main>
    )
}
