import { useGetAddress } from '@/utils/hook/useGetAddress'
import { Phases } from './form/phases'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { useAddress } from '@thirdweb-dev/react'
import { Badge } from './ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ContractCard() {
    const address = useAddress()

    const { data } = useGetAddress(address!)

    return (
        <div className='flex justify-start items-center w-full mt-9 gap-3 flex-wrap'>
            {data?.map((info: any) => (
                <Card key={info?.id} className='hover:border-gray-100 hover:cursor-pointer'>
                    <CardHeader>
                        <CardTitle className='text-md'>{info?.name} ({info?.symbol})</CardTitle>
                        {/* <CardDescription>{info?.contract_address}</CardDescription> */}
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between items-start gap-5">
                        <div className='flex flex-col gap-2'>
                            <Label>Contract</Label>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <p className="flex justify-center items-center text-sm text-gray-500 dark:text-gray-400 py-2 px-3 rounded-full border hover:border-gray-50" onClick={() => navigator.clipboard.writeText(info?.contract_address)}>
                                            {info?.contract_address}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p onClick={() => navigator.clipboard.writeText(info?.contract_address)}>
                                            Click and it will copy to clipboard
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </CardContent>
                    <CardFooter className='flex justify-between items-center w-full gap-3'>
                        <Badge>ERC20</Badge>
                        <Phases contract_address={info?.contract_address!} />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
