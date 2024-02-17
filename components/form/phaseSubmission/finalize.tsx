"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { updateTotalSupply } from "@/utils/db/updateTotalSupply"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { useContract, useSetClaimConditions } from "@thirdweb-dev/react"

export default function Finalize({ contract_address }: any) {
    const { data: phases } = useGetPhases(contract_address)
    const { contract } = useContract(contract_address);
    const {
        mutateAsync: setClaimConditions,
        isLoading,
        error,
    } = useSetClaimConditions(contract);
    const { toast } = useToast()

    return (
        <div className="flex flex-col justify-center items-start w-full gap-3">
            {phases?.[0]?.phases_info && phases?.[0]?.phases_info?.length ? phases?.[0]?.phases_info?.map((info: any, index: number) =>
            (<div key={index} className="flex flex-col border p-4 rounded-md py-3 w-full drop-shadow-md gap-1">
                <p className="text-sm">Phase: <span className="font-semibold">{info?.metadata?.name}</span></p>
                {/* <Badge>{info?.metadata?.name}</Badge> */}
                <p className="text-sm">Max per wallet: <span className="font-semibold">{info?.maxClaimablePerWallet}</span></p>
                <p className="text-sm">Max claimable supply: <span className="font-semibold">{info?.maxClaimableSupply}</span></p>
                <p className="text-sm">Price per token: <span className="font-semibold">{info?.price}</span></p>
                <p className="text-sm">Start time: <span className="font-semibold">{(new Date(info?.startTime).toLocaleDateString()) + ", " + (new Date(info?.startTime).toLocaleTimeString())}</span></p>
            </div>)
            ) : <p className="font-medium">Please configure your phase(s)</p>}
            <div className="pt-4">
                <Button onClick={async () => {

                    let totalSupply = 0
                    phases?.[0]?.phases_info?.map((info: any) => (
                        totalSupply += Number(info?.maxClaimableSupply)
                    ));



                    const result = phases?.[0]?.phases_info?.map((info: any) => ({
                        ...info,
                        startTime: new Date(info?.startTime)
                    }));
                    try {
                        await setClaimConditions({
                            phases: result
                        })

                        await updateTotalSupply(contract_address, String(totalSupply))

                        toast({
                            title: "Phases have been setup",
                            description: "Mint phases setup are complete.",
                        });

                        return
                    } catch (error: any) {

                        toast({
                            title: "Setting up phase has error'd",
                        });

                        console.log('error', error)

                        return error
                    }
                }}>{!isLoading ? "Submit" : "Cooking..."}</Button>
            </div>
        </div>
    )
}
