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
import { useAddress, useClaimToken, useContract, useSDK, useTokenBalance } from "@thirdweb-dev/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Progress } from "@/components/ui/progress"

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

export function MintForm({ contract_address }: any) {
    const [loading, setLoading] = useState<boolean>(false)
    const address = useAddress()
    const [progress, setProgress] = useState(13)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: "0"
        },
    })

    const { contract, data, isFetching } = useContract(contract_address!);

    const { mutateAsync: claimToken, isLoading, error, } = useClaimToken(contract);


    const { data: tokenBalanceData, isLoading: tokenBalanceisLoading, error: tokenBalanceError } = useTokenBalance(contract, address);

    console.log('tokenBalanceData', tokenBalanceData)


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
            <p>Token Balance: {tokenBalanceData?.displayValue}</p>
            <div className="my-2">
                <Progress className="h-[10px]" value={progress} />
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="1000" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter amount of tokens you&apos;d like to mint
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full justify-end">
                        <Button variant="outline" disabled={loading} type="submit">{!loading ? "Mint" : "Minting..."}</Button>
                    </div>
                </form>
            </Form>
        </div>

    )
}
