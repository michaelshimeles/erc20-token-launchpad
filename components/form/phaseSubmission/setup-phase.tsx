"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSDK } from "@thirdweb-dev/react"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const MintFormSchema = z.object({
    contract_address: z.string(),
    maxClaimable: z.string(),
    price: z.string(),
    phase: z.string(),
    maxClaimablePerWallet: z.string(),
})

type MintFormInput = z.infer<typeof MintFormSchema>

export default function SetupPhase({ contract_address }: any) {
    const [claimConditions, setClaimConditions] = useState<any>(null)
    const [loading, setIsLoading] = useState<boolean>(false)
    const [confirmed, setConfirmed] = useState<boolean>(false)

    const { toast } = useToast()

    const sdk = useSDK()

    const { data: phases, refetch: refetchPhases } = useGetPhases(contract_address)

    const form = useForm<MintFormInput>({
        resolver: zodResolver(MintFormSchema),
    });

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
                </div>
            </form>
        </Form>
    )
}
