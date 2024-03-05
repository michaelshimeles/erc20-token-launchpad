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
import { storeAddress } from "@/utils/db/storeAddress"
import { useGetAddress } from "@/utils/hook/useGetAddress"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConnectWallet, useAddress, useSDK, useStorageUpload, useConnectionStatus } from "@thirdweb-dev/react"
import { Loader2 } from 'lucide-react'
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { useToast } from "./ui/use-toast"

export const Icons = {
    spinner: Loader2,
};
const MintFormSchema = z.object({
    name: z.string(),
    symbol: z.string(),
    description: z.string(),
    image: z.any()
    // primary_sale_recipient: z.string(),
    // platform_fees_recipient: z.string(),
    // platform_fees_percentage: z.string(),
})

type MintFormInput = z.infer<typeof MintFormSchema>

export default function SdkDeploy({ }) {
    const sdk = useSDK();
    const address = useAddress()

    const { refetch } = useGetAddress(address!)
    const { toast } = useToast()
    const connectionStatus = useConnectionStatus();

    const { mutateAsync: upload, isLoading } = useStorageUpload();

    async function uploadData(file: any) {
        const filesToUpload = [...file]

        const uris = await upload({ data: filesToUpload });

        console.log(uris);
        return uris
    }

    const [loading, setIsLoading] = useState<boolean>(false)
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset, } = useForm<MintFormInput>({
        resolver: zodResolver(MintFormSchema),
    });

    const form = useRef();

    const onSubmit = async (data: z.infer<typeof MintFormSchema>) => {
        setIsLoading(true)

        const response = await uploadData(data?.image)

        console.log('response', response)
        const { name,
            symbol,
            description,
            // primary_sale_recipient,
            // platform_fees_recipient,
            // platform_fees_percentage,
        } = data

        try {

            const deployedAddress = sdk?.deployer.deployTokenDrop({
                name,
                // primary_sale_recipient,
                symbol,
                description,
            });

            const contract_address = await deployedAddress
            await storeAddress(data?.name, data?.symbol, contract_address!, address!, description, response?.[0])

            toast({
                title: "Mint created",
            })
            setIsLoading(false)
            refetch()
            reset()
            return contract_address
        } catch (error: any) {
            console.log('error', error)
            toast({
                title: error?.message,
                description: error?.data?.message,
                variant: "destructive"
            })

            setIsLoading(false)
            reset()
            return error
        }
    }

    if (connectionStatus !== "connected") {
        return (
            <ConnectWallet
                theme={"dark"}
                auth={{ loginOptional: false }}
                switchToActiveChain={true}
                modalSize={"compact"}
            />
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg">Deploy ERC-20</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deploy ERC-20</DialogTitle>
                    <DialogDescription>
                        Let&apos;s start with some basic token information.
                    </DialogDescription>
                </DialogHeader>
                <form ref={form as any} onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col w-full justify-center items-center gap-4">
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label>Name</Label>
                            <Input {...register("name", { required: true })} placeholder="Jesus Christ" />
                            {errors?.name?.message && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label>Symbol</Label>
                            <Input {...register("symbol", { required: true })} placeholder="JC" />
                            {errors?.symbol?.message && <p className="text-red-500 text-sm">{errors.symbol.message}</p>}
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label>Description</Label>
                            <Textarea {...register("description", { required: true })} placeholder="Jesus Christ is The Way, The Truth and The Life" />
                            {errors?.description?.message && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            <Label htmlFor="picture">Token Image</Label>
                            <Input {...register("image", { required: true })} id="picture" type="file" accept="image/*" />
                        </div>
                        <Button type="submit" disabled={loading} className="mt-3 w-full">{!loading ? "Save changes" : "Cooking..."}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
