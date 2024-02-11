"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "../ui/textarea"
import { Separator } from "@/components/ui/separator"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import { useToast } from "../ui/use-toast"
import { createToken } from "@/server/action/create-token"
import { storeAddress } from "@/utils/db/storeAddress"
import { useGetAddress } from "@/utils/hook/useGetAddress"

const MintFormSchema = z.object({
    name: z.string(),
    symbol: z.string(),
    description: z.string(),
    primary_sales_recipient: z.string(),
    platform_fees_recipient: z.string(),
    platform_fees_percentage: z.string(),
})

type MintFormInput = z.infer<typeof MintFormSchema>

export function MintForm() {

    const [loading, setIsLoading] = useState<boolean>(false)
    const { refetch } = useGetAddress()


    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, } = useForm<MintFormInput>({
        resolver: zodResolver(MintFormSchema),
        defaultValues: {
            name: "Jesus Christ",
            symbol: "JC",
            description: "Jesus Christ is The Way, The Truth, and The Life.",
            primary_sales_recipient: "0x944C9EF3Ca71E710388733E6C57974e8923A9020",
            platform_fees_recipient: "0x944C9EF3Ca71E710388733E6C57974e8923A9020",
            platform_fees_percentage: "10"
        }
    });

    const form = useRef();
    const { toast } = useToast()

    const onSubmit = async (data: z.infer<typeof MintFormSchema>) => {
        setIsLoading(true)

        try {
            const response = await createToken("goerli", "0x944C9EF3Ca71E710388733E6C57974e8923A9020", data)

            console.log('response', response)

            if (response?.result) {
                await storeAddress(data?.name, data?.symbol, response?.result?.deployedAddress)
                refetch()
            }

            setIsLoading(false)
            return response
        } catch (error) {

            console.log('client error', error)
            setIsLoading(false)

            return error
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Engine Deploy</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Launch an ERC-20 token</DialogTitle>
                    <DialogDescription>
                        With just a few clicks, launch your ERC-20 token with ease.
                    </DialogDescription>
                </DialogHeader>
                <form ref={form as any} onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full justify-center items-center gap-4">
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label>Name</Label>
                            <Input {...register("name", { required: true })} placeholder="Jesus Christ" />
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label>Symbol</Label>
                            <Input {...register("symbol", { required: true })} placeholder="JC" />
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label>Description</Label>
                            <Textarea {...register("description", { required: true })} placeholder="Jesus Christ is The Way, The Truth and The Life." />
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                Primary Sales
                            </h3>
                            <Separator className="mt-1 mb-3" />
                            <Label>Recipient Address</Label>
                            <Input {...register("primary_sales_recipient", { required: true })} placeholder="0x944C9EF3Ca71E710388733E6C57974e8923A9020" />
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <h3 className="scroll-m-20 text-xl font-semibold tracking-tight">
                                Platform Fees
                            </h3>
                            <Separator className="mt-1 mb-3" />
                            <Label>Recipient Address</Label>
                            <div className="flex justify-center items-center w-full gap-3">
                                <Input {...register("platform_fees_recipient", { required: true })} placeholder="0x944C9EF3Ca71E710388733E6C57974e8923A9020" className="w-[80%]" />
                                <Input {...register("platform_fees_percentage", { required: true })} placeholder="%" className="w-[20%]" />
                            </div>
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="mt-3 w-full">{!loading ? "Save changes" : "Cooking..."}</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
