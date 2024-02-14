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

export default function Provider({ children }: { children: React.ReactNode }) {

    return (

        <ThirdwebProvider
            activeChain="goerli"
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
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