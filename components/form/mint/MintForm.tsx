"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useAddress, useClaimToken, useContract, useSDK } from "@thirdweb-dev/react"
import { useState } from "react"
import { useGetAddress } from "@/utils/hook/useGetAddress"
import Link from "next/link"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

const FormSchema = z.object({
    amount: z.string(),
})

export function MintForm({ contract_address }: any) {
    const [loading, setLoading] = useState<boolean>(false)
    const sdk = useSDK()
    const address = useAddress()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            amount: "0"
        },
    })

    const { contract, data, isFetching } = useContract(contract_address!);

    const { mutateAsync: claimToken, isLoading, error, } = useClaimToken(contract);



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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
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
    )
}
