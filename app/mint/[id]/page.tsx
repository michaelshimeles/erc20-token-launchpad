import { MintForm } from "@/components/form/mint/MintForm";

export default function MintPage({ params }: { params: { id: string } }) {

    return (
        <main className="flex min-h-screen flex-col items-center gap-5 p-24">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                ERC-20 Token Mint
            </h1>
            <MintForm contract_address={params?.id} />
        </main>
    )
}
