import { useGetAddress } from '@/utils/hook/useGetAddress'
import { Phases } from './form/phases'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'

export default function ContractCard() {

    const { data } = useGetAddress()

    return (
        <div className='flex justify-center items-center w-full mt-9 gap-3 flex-wrap'>
            {data?.map((info: any) => (
                <Card key={info?.id} className='hover:border-gray-200 hover:cursor-pointer'>
                    <CardHeader>
                        <CardTitle className='text-md'>{info?.name} ({info?.symbol})</CardTitle>
                        {/* <CardDescription>{info?.contract_address}</CardDescription> */}
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between items-start gap-5">
                        <div className='flex flex-col gap-2'>
                            <Label>Contract</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {info?.contract_address}
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className='flex gap-3'>
                        {/* <Link href={`https://goerli.etherscan.io/address/${info?.contract_address}`} target='_blank'>
                            <Button>Contract</Button>
                        </Link> */}
                        <Phases contract_address={info?.contract_address}/>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
