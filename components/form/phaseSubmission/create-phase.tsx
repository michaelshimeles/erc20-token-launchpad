"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { createPhaseInfo } from "@/utils/db/createPhaseInfo"
import { createPhase } from "@/utils/db/createPhases"
import { updatePhase } from "@/utils/db/updatePhase"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


const phaseSchema = z.object({
    contract_address: z.string(),
    phase: z.string(),
})

type phaseInput = z.infer<typeof phaseSchema>

export default function CreatePhase({ contract_address }: any) {

    const { data: phases, refetch: refetchPhases } = useGetPhases(contract_address)

    console.log('phases', phases)

    const { register, handleSubmit, watch,
        formState: { errors: errorsPhase, isSubmitting }, reset: resetPhase, } = useForm<phaseInput>({
            resolver: zodResolver(phaseSchema),
        });

    async function onSubmit(data: z.infer<typeof phaseSchema>) {
        if (data?.phase !== "" && phases?.[0]?.phases) {
            const response = await updatePhase(contract_address, [...phases?.[0]?.phases, data?.phase])

            refetchPhases()
            resetPhase()
            return response
        }

        if (data?.phase === "") {
            return
        }

        const response = await createPhase(contract_address, [data?.phase])

        refetchPhases()
        resetPhase()
        return response
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full justify-center items-end gap-4 mt-6">
                <div className="flex flex-col gap-2 justify-center items-start w-full">
                    <Input {...register("contract_address", { required: true })} placeholder="Contract Name" defaultValue={contract_address} />
                </div>
                <div className="flex flex-col gap-2 justify-center items-start w-full">
                    <Input  {...register("phase", { required: true })} placeholder="Phase Name" />
                </div>
                <div className="flex gap-2 w-full">
                    {phases && phases?.[0]?.phases?.map((phase: any, index: number) => (
                        <ContextMenu key={index}>
                            <ContextMenuTrigger>
                                <Badge key={index}>{phase}</Badge>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={async () => {
                                    const newPhaseList = phases?.[0]?.phases?.filter((selectedPhase: any) => {
                                        return phase !== selectedPhase
                                    })
                                    const response = await updatePhase(contract_address, newPhaseList)

                                    // update phase info
                                    const replaceIndex = phases?.[0]?.phases_info?.findIndex((info: any) => info?.metadata?.name === phase);

                                    let phasesInfo = phases?.[0]?.phases_info

                                    phasesInfo.splice(replaceIndex, 1)

                                    await createPhaseInfo([...phasesInfo], contract_address);

                                    refetchPhases()
                                    return response

                                }}>Delete Phase</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>

                    ))}
                </div>
                <Button type="submit" variant="outline">Confirm Phase</Button>
            </div>
        </form>
    )
}
