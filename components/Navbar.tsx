"use client"
import {
    NavigationMenu,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { ConnectWallet } from "@thirdweb-dev/react"
import { AreaChart } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { ModeToggle } from "./ModeToggle"

export function NavBar() {

    return (
        <div className="flex min-w-full justify-between p-2 border-b z-10">
            <NavigationMenu>
                <NavigationMenuList className="max-[825px]:hidden ">
                    <Link href="/" className="pl-2">
                        <AreaChart />
                    </Link>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex justify-center items-center gap-3">
                <ConnectWallet
                    theme={"dark"}
                    auth={{ loginOptional: false }}
                    switchToActiveChain={true}
                    modalSize={"compact"}
                />
                <ModeToggle />
            </div>
        </div>

    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
