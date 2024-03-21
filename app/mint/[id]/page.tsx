import MintForm from "@/components/form/mint/MintForm";
import { Skeleton } from "@/components/ui/skeleton";
import { readTokenInfo } from "@/utils/db/readTokenInfo";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";

export default async function MintPage({ params }: { params: { id: string } }) {

    const response = await readTokenInfo(params?.id) as any;

    const viewableLink = convertIPFSToViewableLink(response?.[0]?.image);

    return (
        <main className="flex min-h-screen flex-col items-center gap-5 p-10">
            <div className="flex justify-start items-center max-w-[1200px] gap-8 mt-[6rem] flex-wrap md:flex-nowrap	">
                <div className="w-[50%]">
                    <Image className="border-8 border-gray-900 rounded-xl shadow" src={viewableLink} alt="" width={800} height={200} />
                </div>
                <div className="flex flex-col justify-center item-center w-[50%] gap-2">
                    <MintForm contract_address={params?.id} />
                </div>
            </div>
        </main>
    )
}

function convertIPFSToViewableLink(ipfsLink: string) {
    // Check if the link starts with the IPFS protocol
    if (ipfsLink.startsWith('ipfs://')) {
        // Replace the IPFS protocol with the IPFS gateway URL
        return ipfsLink.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    // Return the original link if it doesn't start with the IPFS protocol
    return ipfsLink;
}
