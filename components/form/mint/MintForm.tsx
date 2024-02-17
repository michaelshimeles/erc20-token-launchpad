"use client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useGetTokenInfo } from "@/utils/hook/useGetTokenInfo"
import { zodResolver } from "@hookform/resolvers/zod"
import { useActiveClaimConditionForWallet, useAddress, useClaimConditions, useClaimIneligibilityReasons, useClaimToken, useClaimerProofs, useConnectionStatus, useContract, useSDK, useTokenBalance, useTokenSupply } from "@thirdweb-dev/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useGetPhases } from "@/utils/hook/useGetPhases"

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

    console.log('tokenBalanceData', tokenBalanceData)

    const { data: claimConditions } = useClaimConditions(contract);

    console.log('claimConditions', claimConditions)

    const { data: ActiveClaimData } = useActiveClaimConditionForWallet(
        contract,
        address,
    );
    const { data: tokenSupplyData, isLoading: tokenDataIsLoading, error: tokenDataError } = useTokenSupply(contract);

    console.log('tokenSupplyData', tokenSupplyData)

    console.log('ActiveClaimData', ActiveClaimData)

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



    return (
        <div className="flex flex-col w-full justify-center item-center max-w-[400px] gap-2">
            <div className="flex items-center w-full justify-start gap-2">Wallet Balance: {tokenBalanceData?.displayValue ? tokenBalanceData?.displayValue + " " + tokenBalanceData?.symbol : <Skeleton className="h-3.5 w-[250px]" />} </div>
            <div className="flex items-center w-full justify-start gap-2">Max Supply: {phases ? phases?.[0]?.total_supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " " + tokenSupplyData?.symbol : <Skeleton className="h-3.5 w-[250px]" />} </div>
            <div className="flex items-center gap-2">Available Supply: {claimConditions?.[0]?.availableSupply + "/" + phases?.[0]?.total_supply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </div>
            <div className="my-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Progress className="h-[10px]" value={(Number(claimConditions?.[0]?.maxClaimableSupply) - Number(claimConditions?.[0]?.availableSupply)) / 100} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <div>{(Number(claimConditions?.[0]?.maxClaimableSupply) - Number(claimConditions?.[0]?.availableSupply)) / 100}%</div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
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
                                <FormDescription>
                                    Remaining Mint Amount: {claimConditions?.[0]?.maxClaimablePerWallet ? Number(claimConditions?.[0]?.maxClaimablePerWallet) - Number(tokenBalanceData?.displayValue) + " " + tokenBalanceData?.symbol : <Skeleton className="h-3.5 w-[250px]" />}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-wrap justify-start items-center my-3 w-full gap-2">
                        {claimConditions?.map((info: any, index: number) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <Badge>{info?.metadata.name}</Badge>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{info?.metadata.name} phase</DialogTitle>
                                        <DialogDescription>
                                            Here are the details of the phase.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm text-gray-300">Max Claimable Per Wallet</Label>
                                        <Input readOnly value={info?.maxClaimablePerWallet} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm text-gray-300">Available Supply</Label>
                                        <Input readOnly value={info?.availableSupply} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm text-gray-300">Total Supply</Label>
                                        <Input readOnly value={info?.maxClaimableSupply} />
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label className="text-sm text-gray-300">Price</Label>
                                        <Input readOnly value={info?.currencyMetadata?.displayValue} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                    <div className="flex w-full justify-end">
                        <Button className="w-full" variant="outline" disabled={connectionStatus !== "connected"} type="submit">{!loading ? "Mint" : "Minting..."}</Button>
                    </div>
                </form>
            </Form>
        </div>

    )
}
