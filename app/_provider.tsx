"use client"
import {
    ThirdwebProvider,
    coinbaseWallet,
    embeddedWallet,
    en,
    localWallet,
    metamaskWallet,
    rainbowWallet,
    walletConnect
} from "@thirdweb-dev/react";
import { ThirdwebSDKProvider } from "@thirdweb-dev/react";

export default function Provider({ children }: { children: React.ReactNode }) {

    return (

        <ThirdwebProvider
            activeChain="goerli"
            clientId="2d0806b43f43b6c62d350a3ccd3d009a"
            locale={en()}
            // signer={}
            supportedWallets={[
                metamaskWallet({ recommended: true }),
                coinbaseWallet(),
                walletConnect(),
                localWallet(),
                embeddedWallet({
                    auth: {
                        options: [
                            "email",
                            "google",
                            "apple",
                            "facebook",
                        ],
                    },
                }),
                rainbowWallet()
            ]}
        >
            {children}
        </ThirdwebProvider>
    )
}