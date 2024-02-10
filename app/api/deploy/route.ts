import { ThirdwebSDK } from "@thirdweb-dev/react";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { signer, name, symbol, primary_sale_recipient } = await req.json();

  console.log('started')
  try {
    console.log('round 1')

    const sdk = await ThirdwebSDK.fromWallet(signer, "goerli", {
      secretKey:
        "4o5CAz5dzkeL6gyMX1ixLRV3VnyH04QJ07Y7fpl9duz5ofSpqyWS25zMAaDQU-W-J9ryGSgkIkFuKHDbCwD_vg",
    });

    console.log('round 2')


    const deployedAddress = sdk.deployer.deployTokenDrop({
      name,
      symbol,
      primary_sale_recipient,
    });

    console.log("deployedAddress", await deployedAddress);

    return NextResponse.json(
      { message: "Success", deployedAddress },
      { status: 200 }
    );
  } catch (error) {
    console.log('failed')

    return NextResponse.json({ message: "Failed", error }, { status: 400 });
  }
}
