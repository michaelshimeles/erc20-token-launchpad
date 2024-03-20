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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import CreatePhase from "./phaseSubmission/create-phase"
import Finalize from "./phaseSubmission/finalize"
import SetupPhase from "./phaseSubmission/setup-phase"
import { useGetPhases } from "@/utils/hook/useGetPhases"


export function Phases({ contract_address }: any) {

    const { data: phases, refetch: refetchPhases } = useGetPhases(contract_address)

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
                        <TabsTrigger disabled={!phases?.[0]?.phases?.length} className="w-full" value="setup">Setup Phase</TabsTrigger>
                        <TabsTrigger disabled={!phases?.[0]?.phases?.length} className="w-full" value="final">Finalize</TabsTrigger>
                    </TabsList>
                    <TabsContent value="create">
                        <CreatePhase contract_address={contract_address} />
                    </TabsContent>
                    <TabsContent value="setup" className="w-full mt-6">
                        <SetupPhase contract_address={contract_address} />
                    </TabsContent>
                    <TabsContent value="final" className="w-full mt-6">
                        <Finalize contract_address={contract_address} />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
