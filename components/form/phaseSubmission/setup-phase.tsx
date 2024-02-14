"use client"
<<<<<<< HEAD
import { Button } from "@/components/ui/button"
=======
import { TimePicker } from "@/components/time-picker/time-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
>>>>>>> 457ea7b (Added coin setup)
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
<<<<<<< HEAD
=======
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
>>>>>>> 457ea7b (Added coin setup)
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
<<<<<<< HEAD
import { useToast } from "@/components/ui/use-toast"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSDK } from "@thirdweb-dev/react"
import { Loader2 } from "lucide-react"
=======
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createPhaseInfo } from "@/utils/db/createPhaseInfo"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
>>>>>>> 457ea7b (Added coin setup)
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const MintFormSchema = z.object({
    contract_address: z.string(),
<<<<<<< HEAD
    maxClaimable: z.string(),
    price: z.string(),
    phase: z.string(),
    maxClaimablePerWallet: z.string(),
=======
    maxClaimableSupply: z.string(),
    price: z.string(),
    phase: z.string(),
    maxClaimablePerWallet: z.string(),
    whitelist: z.string(),
>>>>>>> 457ea7b (Added coin setup)
})

type MintFormInput = z.infer<typeof MintFormSchema>

export default function SetupPhase({ contract_address }: any) {
<<<<<<< HEAD
    const [claimConditions, setClaimConditions] = useState<any>(null)
    const [loading, setIsLoading] = useState<boolean>(false)
    const [confirmed, setConfirmed] = useState<boolean>(false)

    const { toast } = useToast()

    const sdk = useSDK()

=======
    const [confirmed, setConfirmed] = useState<boolean>(false)
    const [date, setDate] = useState<any>(undefined)

    const { toast } = useToast()
>>>>>>> 457ea7b (Added coin setup)
    const { data: phases, refetch: refetchPhases } = useGetPhases(contract_address)

    const form = useForm<MintFormInput>({
        resolver: zodResolver(MintFormSchema),
    });

<<<<<<< HEAD
    function onSubmit(data: z.infer<typeof MintFormSchema>) {
        console.log('data', data)
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
        form.reset()
=======
    async function onSubmit(data: z.infer<typeof MintFormSchema>) {
        setConfirmed(true);

        console.log('data', data?.whitelist?.split(','))

        let snapshot = data?.whitelist?.split(',')

        let finalSnapshot = snapshot?.map((info: any) => {
            return {
                address: info
            }
        })

        console.log('finalSnapshot', finalSnapshot)

        let response = phases?.[0]?.phases_info?.some((info: any) => info?.metadata?.name === data?.phase);

        if (response) {
            const replaceIndex = phases?.[0]?.phases_info?.findIndex((info: any) => info?.metadata?.name === data?.phase);

            let phasesInfo = phases?.[0]?.phases_info

            phasesInfo[replaceIndex] = {
                metadata: {
                    name: data?.phase, // The name of the phase
                },
                price: data?.price, // The price of the token in the currency specified above
                maxClaimablePerWallet: data?.maxClaimablePerWallet, // The maximum number of tokens a wallet can claim
                maxClaimableSupply: data?.maxClaimableSupply, // The total number of tokens that can be claimed in this phase
                startTime: date, // When the phase starts (i.e. when users can start claiming tokens)
                snapshot: finalSnapshot,
            }

            await createPhaseInfo([...phasesInfo], contract_address);

            toast({
                title: "Phase has been set",
                description: "You can setup your next phase or confirm all the phases in the next step",
            });

            form.reset()

            setConfirmed(false);
            return

        }

        const claimConditions = {
            phases: [
                {
                    metadata: {
                        name: data?.phase, // The name of the phase
                    },
                    price: data?.price, // The price of the token in the currency specified above
                    maxClaimablePerWallet: data?.maxClaimablePerWallet, // The maximum number of tokens a wallet can claim
                    maxClaimableSupply: data?.maxClaimableSupply, // The total number of tokens that can be claimed in this phase
                    startTime: date, // When the phase starts (i.e. when users can start claiming tokens)
                    snapshot: finalSnapshot,
                    // currencyAddress: "0x...", // The address of the currency you want users to pay in
                    // waitInSeconds: 60 * 60 * 24 * 7, // The period of time users must wait between repeat claims
                }
            ],
        };

        if (phases?.[0]?.phases_info) {
            await createPhaseInfo([...phases?.[0]?.phases_info, ...claimConditions?.phases], contract_address);
            toast({
                title: "Phase has been set",
                description: "You can setup your next phase or confirm all the phases in the next step",
            });
            form.reset()
            setConfirmed(false);

            return
        }

        await createPhaseInfo([...claimConditions?.phases], contract_address);

        toast({
            title: "Phase has been set",
            description: "You can setup your next phase or confirm all the phases in the next step",
        });

        form.reset()

        setConfirmed(false);
        return
>>>>>>> 457ea7b (Added coin setup)
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full justify-center items-end gap-4">
                    <FormField
                        control={form.control}
                        name="phase"
                        render={({ field }) => (
                            <FormItem>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Phase" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {phases && phases?.[0]?.phases?.map((phase: any, index: number) => (
                                            <SelectItem key={index} value={phase}>{phase}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Contract Name</Label>
                        <Input {...form.register("contract_address", { required: true })} defaultValue={contract_address} />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Max Claimable Supply</Label>
<<<<<<< HEAD
                        <Input {...form.register("maxClaimable", { required: true })} defaultValue="10000000" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Price</Label>
                        <Input {...form.register("price", { required: true })} defaultValue="0.01" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Max Claimable Per Wallet</Label>
                        <Input {...form.register("maxClaimablePerWallet", { required: true })} defaultValue="1000" />
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
=======
                        <Input {...form.register("maxClaimableSupply", { required: true })} placeholder="10000000" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Price</Label>
                        <Input {...form.register("price", { required: true })} placeholder="0.01" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Max Claimable Per Wallet</Label>
                        <Input {...form.register("maxClaimablePerWallet", { required: true })} placeholder="1000" />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Whitelist</Label>
                        <Textarea {...form.register("whitelist")} />
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-start w-full">
                        <Label>Start Date & Time</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[280px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                                <div className="p-3 border-t border-border">
                                    <TimePicker setDate={setDate} date={date} />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <div className="flex justify-first items-center w-full gap-2 mt-3">
                    <Button type="submit" disabled={confirmed} variant="outline">{!confirmed ? "Confirm Phase" : "Phase Confirmed"}</Button>
>>>>>>> 457ea7b (Added coin setup)
                </div>
            </form>
        </Form>
    )
}
