"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/ui/context-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createPhase } from "@/utils/db/createPhases"
import { updatePhase } from "@/utils/db/updatePhase"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSDK } from "@thirdweb-dev/react"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useToast } from "../ui/use-toast"

const MintFormSchema = z.object({
    contract_address: z.string(),
    maxClaimable: z.string(),
    price: z.string(),
    phase: z.string(),
    maxClaimablePerWallet: z.string(),
})

type MintFormInput = z.infer<typeof MintFormSchema>

const phaseSchema = z.object({
    contract_address: z.string(),
    phase: z.string(),
})

type phaseInput = z.infer<typeof phaseSchema>



export function Phases({ contract_address }: any) {

    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, } = useForm<MintFormInput>({
        resolver: zodResolver(MintFormSchema),
    });

    const { register: registerPhase, handleSubmit: handleSubmitPhase, watch: watchPhase, formState: { errors: errorsPhase, isSubmitting: isSubmittingPhase }, reset: resetPhase, } = useForm<phaseInput>({
        resolver: zodResolver(phaseSchema),
    });
    const [loading, setIsLoading] = useState<boolean>(false)
    const [confirmed, setConfirmed] = useState<boolean>(false)
    const [claimConditions, setClaimConditions] = useState<any>(null)

    const { toast } = useToast()

    const sdk = useSDK()

    const { data: phases, refetch: refetchPhases } = useGetPhases(contract_address)

    console.log("phases", phases)

    const form = useForm<z.infer<typeof MintFormSchema>>({
        resolver: zodResolver(MintFormSchema),
    })

    function onSubmit(data: z.infer<typeof MintFormSchema>) {
        const formattedData = {
            maxClaimable: Number(data.maxClaimable),
            price: Number(data.price),
            maxClaimablePerWallet: Number(data.maxClaimablePerWallet),
        };
        setClaimConditions([
            {
                startTime: new Date(),
                maxClaimableSupply: formattedData.maxClaimable,
                price: formattedData.price,
                snapshot: [],
            },
        ]);

        setConfirmed(true);

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(formattedData, null, 2)}</code>
                </pre>
            ),
        });
        reset()
    }

    async function onSubmitPhases(data: z.infer<typeof phaseSchema>) {

        if (phases?.[0]?.phases) {
            const response = await updatePhase(contract_address, [...phases?.[0]?.phases, data?.phase])

            console.log('response', response)
            resetPhase()
            refetchPhases()
            return response
        }

        const response = await createPhase(contract_address, data?.phase)
        console.log('response', response)
        resetPhase()
        refetchPhases()
        return response
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Phases</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set up your ERC-20&apos;s phases</DialogTitle>
                    <DialogDescription>
                        Setup your token with claim conditions.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="account" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger className="w-full" value="phases">Phases</TabsTrigger>
                        <TabsTrigger className="w-full" value="setup">Setup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="phases">
                        <form ref={form as any} onSubmit={handleSubmitPhase(onSubmitPhases)}>
                            <div className="flex flex-col w-full justify-center items-end gap-4 mt-6">
                                <div className="flex flex-col gap-2 justify-center items-start w-full">
                                    <Input {...registerPhase("contract_address", { required: true })} placeholder="Contract Name" value={contract_address} />
                                </div>
                                <div className="flex flex-col gap-2 justify-center items-start w-full">
                                    <Input  {...registerPhase("phase", { required: true })} placeholder="Phase Name" />
                                </div>
                                <div className="flex gap-2 w-full">
                                    {phases?.[0]?.phases?.map((phase: any, index: number) => (
                                        <ContextMenu key={index}>
                                            <ContextMenuTrigger>
                                                <Badge variant="outline" key={index}>{phase}</Badge>
                                            </ContextMenuTrigger>
                                            <ContextMenuContent>
                                                <ContextMenuItem onClick={async () => {
                                                    const newPhaseList = phases?.[0]?.phases?.filter((selectedPhase: any) => {
                                                        return phase !== selectedPhase
                                                    })
                                                    const response = await updatePhase(contract_address, newPhaseList)

                                                    console.log('response', response)
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
                    </TabsContent>
                    <TabsContent value="setup" className="w-full mt-6">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col w-full justify-center items-end gap-4">
                                <Select {...register("phase", { required: true })}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Phase" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {phases?.[0]?.phases?.map((phase: any, index: number) => (
                                            <SelectItem key={index} value={phase}>{phase}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                                <div className="flex flex-col gap-2 justify-center items-start w-full">
                                    <Label>Contract Name</Label>
                                    <Input {...register("contract_address", { required: true })} value={contract_address} />
                                </div>
                                <div className="flex flex-col gap-2 justify-center items-start w-full">
                                    <Label>Max Claimable Supply</Label>
                                    <Input {...register("maxClaimable", { required: true })} defaultValue="10000000" />
                                </div>
                                <div className="flex flex-col gap-2 justify-center items-start w-full">
                                    <Label>Price</Label>
                                    <Input {...register("price", { required: true })} defaultValue="0.01" />
                                </div>
                                <div className="flex flex-col gap-2 justify-center items-start w-full">
                                    <Label>Max Claimable Per Wallet</Label>
                                    <Input {...register("maxClaimablePerWallet", { required: true })} defaultValue="1000" />
                                </div>
                            </div>
                            <div className="flex justify-first items-center w-full gap-2 mt-3">
                                <Button type="submit" disabled={confirmed} variant="outline">{!confirmed ? "Confirm Contract" : "Confirmed"}</Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    onClick={async () => {
                                        setIsLoading(true)
                                        try {
                                            const contract = await sdk?.getContract(contract_address)

                                            const response = await contract?.erc20?.claimConditions.set(claimConditions)

                                            setIsLoading(false)
                                            return response
                                        } catch (error) {
                                            console.log('error', error)
                                            setIsLoading(false)
                                            return error
                                        }
                                    }}>
                                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Set Claim Conditions"}
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog >
    )
}
