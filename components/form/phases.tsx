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
import SetupPhase from "./phaseSubmission/setup-phase"


export function Phases({ contract_address }: any) {

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
