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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useGetAddress } from "@/utils/hook/useGetAddress"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSDK } from "@thirdweb-dev/react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"

const MintFormSchema = z.object({
    contract_address: z.string(),
    maxClaimableSupply: z.string(),
    startTime: z.string(),
    price: z.string(),
    currencyAddress: z.string(),
    maxClaimablePerWallet: z.string(),
})

type MintFormInput = z.infer<typeof MintFormSchema>


export function Phases({ contract_address }: string) {

    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, } = useForm<MintFormInput>({
        resolver: zodResolver(MintFormSchema),
        defaultValues: {
            contract_address: '', // default value as empty string instead of undefined
            maxClaimableSupply: '0', // assuming a string is expected
            startTime: '',
            price: '',
            currencyAddress: '',
            maxClaimablePerWallet: '',
        },

    });
    const [loading, setIsLoading] = useState<boolean>(false)
    const [claimConditions, setClaimConditions] = useState<any>(null)

    const { toast } = useToast()

    const sdk = useSDK()
    const { data } = useGetAddress()

    const form = useForm<z.infer<typeof MintFormSchema>>({
        resolver: zodResolver(MintFormSchema),
    })

    function onSubmit(data: z.infer<typeof MintFormSchema>) {
        console.log('data', data)
        setClaimConditions([
            {
                startTime: data?.startTime, // start the presale now
                maxClaimableSupply: data?.maxClaimableSupply, // limit how many mints for this presale
                price: data?.price, // presale price
                snapshot: [], // limit minting to only certain addresses

            },
        ])
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Setup Claim</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set up your ERC-20&apos;s phases</DialogTitle>
                    <DialogDescription>
                        Setup your token with claim conditions.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <FormField
                            control={form.control}
                            name="contract_address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contract Address</FormLabel>
                                    <Input defaultValue={contract_address} {...field} />
                                    <FormDescription>
                                        Set the claim conditions of the contract address you select.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxClaimableSupply"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Claimable Supply</FormLabel>
                                    <Input defaultValue={field.value} {...field} />
                                    <FormDescription>
                                        Set the max claimable supply.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Start Time</FormLabel>
                                    <Input {...field} />
                                    <p className="text-sm">{new Date().toISOString()}</p>
                                    <FormDescription>
                                        Set the mint start time.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <Input defaultValue={field.value} {...field} />
                                    <FormDescription>
                                        Set the price per token.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currencyAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Currency Address</FormLabel>
                                    <Input defaultValue={field.value} {...field} />
                                    <FormDescription>
                                        The currency address which you&apos;ll receive payment in.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxClaimablePerWallet"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Claimable Per Wallet</FormLabel>
                                    <Input defaultValue={field.value} {...field} />
                                    <FormDescription>
                                        Set the max claimable per wallet.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-first items-center w-full gap-2">
                            <Button type="submit" variant="outline">Confirm Contract</Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                onClick={async () => {
                                    setIsLoading(true)
                                    try {
                                        const contract = await sdk?.getContract(contract_address)

                                        const response = await contract?.erc20?.claimConditions.set(claimConditions)

                                        console.log('response', response)
                                        setIsLoading(false)
                                        return response
                                    } catch (error) {
                                        console.log('error', error)
                                        setIsLoading(false)
                                        return error
                                    }
                                    // const result = await contract?.sales.setRecipient("0x944C9EF3Ca71E710388733E6C57974e8923A9020");
                                    // const address = "0x944C9EF3Ca71E710388733E6C57974e8923A9020"; // address of the wallet you want to claim the NFTs
                                    // const quantity = 1000; // how many tokens you want to claim
                                    // await contract?.call("setMaxTotalSupply", [1000000])

                                    // const tx = await contract?.erc20.claimTo(address, quantity)
                                    // const receipt = tx?.receipt; // the transaction receipt


                                    // const response = await contract?.erc20?.claimConditions.set(claimConditions)
                                    // const response = setClaimConditions(claimConditions)
                                    // console.log('receipt', receipt)
                                }}>
                                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</> : "Set Claim Conditions"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
