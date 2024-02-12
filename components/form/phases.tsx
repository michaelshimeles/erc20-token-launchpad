"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { createPhase } from "@/utils/db/createPhases"
import { updatePhase } from "@/utils/db/updatePhase"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import CreatePhase from "./phaseSubmission/create-phase"
import SetupPhase from "./phaseSubmission/setup-phase"


const phaseSchema = z.object({
    contract_address: z.string(),
    phase: z.string(),
})

type phaseInput = z.infer<typeof phaseSchema>

export function Phases({ contract_address }: any) {


    const { data: phases, refetch: refetchPhases } = useGetPhases(contract_address)

    const { register: registerPhase, handleSubmit: handleSubmitPhase, watch: watchPhase,
        formState: { errors: errorsPhase, isSubmitting: isSubmittingPhase }, reset: resetPhase, } = useForm<phaseInput>({
            resolver: zodResolver(phaseSchema),
        });

    async function onSubmitPhases(data: z.infer<typeof phaseSchema>) {
        if (phases?.[0]?.phases) {
            const response = await updatePhase(contract_address, [...phases?.[0]?.phases, data?.phase])

            resetPhase()
            refetchPhases()
            return response
        }

        const response = await createPhase(contract_address, [data?.phase])

        resetPhase()
        refetchPhases()
        return response
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Customize</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set up your ERC-20&apos;s phases</DialogTitle>
                    <DialogDescription>
                        Setup your token with claim conditions.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="create" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="create">Create Phase</TabsTrigger>
                        <TabsTrigger className="w-full" value="setup">Setup Phase</TabsTrigger>
                    </TabsList>
                    <TabsContent value="create">
                        <CreatePhase contract_address={contract_address} />
                    </TabsContent>
                    <TabsContent value="setup" className="w-full mt-6">
                        <SetupPhase contract_address={contract_address} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
