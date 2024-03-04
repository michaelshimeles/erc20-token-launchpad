"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { useGetPhases } from "@/utils/hook/useGetPhases"
import { useGetTokenInfo } from "@/utils/hook/useGetTokenInfo"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddress, useClaimConditions, useClaimToken, useConnectionStatus, useContract, useTokenBalance, useTokenSupply } from "@thirdweb-dev/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from 'lucide-react';

const FormSchema = z.object({
    amount: z.string(),
})

interface tokenInfoType {
    id: string,
    created_at: string,
    contract_address: string,
    name: string,
    symbol: string,
    wallet_address: string,
    description: string
}

export const Icons = {
    spinner: Loader2,
};


export default function MintForm({ contract_address }: { contract_address: string }) {
    const [loading, setLoading] = useState<boolean>(false)
    const address = useAddress()
    const connectionStatus = useConnectionStatus();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: "0"
        },
    })

    const { data: phases } = useGetPhases(contract_address)

    const { contract, data, isFetching } = useContract(contract_address!);

    const { mutateAsync: claimToken, isLoading, error, } = useClaimToken(contract);

    const { data: tokenBalanceData, isLoading: tokenBalanceisLoading, error: tokenBalanceError } = useTokenBalance(contract, address);

    // console.log('tokenBalanceData', tokenBalanceData)

    const { data: claimConditions } = useClaimConditions(contract);

    // console.log('claimConditions', claimConditions)

    const { data: tokenSupplyData, isLoading: tokenDataIsLoading, error: tokenDataError } = useTokenSupply(contract);

    // console.log('tokenSupplyData', tokenSupplyData)


    const { data: tokenInfo } = useGetTokenInfo(contract_address) as any

    console.log('tokenInfo', tokenInfo)

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        try {
            const response = await claimToken({
                to: address!, // Use useAddress hook to get current wallet address
                amount: Number(data?.amount), // Amount of token to claim
            })

            console.log('response', response)
            toast({
                title: "You've successfully minted:",
                description: (
                    <Link href={`https://goerli.etherscan.io/tx/${response?.receipt?.transactionHash}`}>
                        <p className="text-underline">{response?.receipt?.transactionHash}</p>
                    </Link>
                ),
            })
            setLoading(false)
            return response

        } catch (error: any) {
            console.log('ERROR', error?.message)

            toast({
                title: "Error, minting failed",
                description: error.message
            })
            setLoading(false)
            return error
        }
    }

    const currentTime = new Date()

    if (!tokenSupplyData?.displayValue) {
        return (
            <div className="flex flex-col justify-center items-center">
                <Icons.spinner className="h-4 w-4 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center item-center w-[515px] gap-2">
            <div className="flex gap-3">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {tokenInfo?.[0]?.name}
                </h1>
                <p className="leading-7">
                    {tokenInfo?.[0]?.symbol}
                </p>
            </div>
            <p className="leading-7 my-4">
                {tokenInfo?.[0]?.description}
            </p>
            {/* <div className="flex items-center w-full justify-start gap-2">Your Balance: {tokenBalanceData?.displayValue ? tokenBalanceData?.displayValue + " " + tokenBalanceData?.symbol : <Skeleton className="h-3.5 w-[250px]" />} </div> */}
            <div className="flex items-center w-full gap-2">
                {tokenSupplyData?.displayValue + "/" + phases?.[0]?.total_supply}
            </div>
            <div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                                <Progress className="h-[10px]" value={(Number(tokenSupplyData?.displayValue) / Number(phases?.[0]?.total_supply)) * 100} />
                                <p>{tokenSupplyData?.displayValue ? Math.round((Number(tokenSupplyData?.displayValue) / Number(phases?.[0]?.total_supply)) * 100) : 0}%</p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div>{(Number(tokenSupplyData?.displayValue) / Number(phases?.[0]?.total_supply)) * 100}%</div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <p className="leading-7">
                        Phases:
                    </p>
                    <div className="flex flex-wrap justify-start items-center my-3 w-full gap-2">
                        {claimConditions?.map((info: any, index: number) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <Badge className={currentTime > info?.startTime && (claimConditions?.[index + 1] ? currentTime < claimConditions?.[index + 1]?.startTime : true) ? "bg-green-400" : ""}>{info?.metadata.name}</Badge>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{info?.metadata.name} phase</DialogTitle>
                                        <DialogDescription>
                                            Here are the details of the phase.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm">Start Time</Label>
                                        <Input readOnly value={new Date(info?.startTime).toLocaleDateString() + " " + new Date(info?.startTime).toLocaleTimeString()} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm">Max Claimable Per Wallet</Label>
                                        <Input readOnly value={info?.maxClaimablePerWallet} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm">Available Supply</Label>
                                        <Input readOnly value={info?.availableSupply} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm">Total Supply</Label>
                                        <Input readOnly value={info?.maxClaimableSupply} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm">Price</Label>
                                        <Input readOnly value={info?.currencyMetadata?.displayValue} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex justify-center items-center gap-2">
                                        <Input placeholder="1000" {...field} />
                                    </div>
                                </FormControl>
                                {/* <FormDescription>
                                    Mint phases:
                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full justify-end mt-5">
                        <Button
                            className="w-full"
                            disabled={connectionStatus !== "connected" || (claimConditions?.[0]?.availableSupply === phases?.[0]?.total_supply)}
                            type="submit"
                        >
                            {
                                connectionStatus !== "connected" ? "Mint" :
                                    claimConditions?.[0]?.availableSupply === phases?.[0]?.total_supply ? "Minted out" :
                                        loading ? "Minting..." : "Mint"
                            }
                        </Button>
                    </div>

                </form>
            </Form>
        </div >

    )
}
