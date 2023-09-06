import Link from "next/link";
import React from "react";
import { Icons } from "./ui/icons";
import { getAuthSession } from "@/lib/auth";
import { buttonVariants } from "./ui/button";
import { UserAccountNav } from "./ui/user-account-nav";
import { ModalTheme } from "./modal/modal-them";
import SearchBar from "./SearchBar";

const Navbar = async () => {
    const session = await getAuthSession();

    return (
        <div className="fixed top-0 inset-x-0 h-fit  border-b border-zinc-300 z-100 py-2">
            <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
                <Link href="/" className="flex gap-2 items-center">
                    <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
                    <p className="hidden text-sm font-medium md:block">
                        Breddit
                    </p>
                </Link>
                <SearchBar />

                <div className="hidden md:flex gap-3">
                    <ModalTheme />
                    {session?.user ? (
                        <div className="flex gap-2 items-center justify-center">
                            <UserAccountNav user={session?.user} />
                            {session?.user.username}
                        </div>
                    ) : (
                        <Link href={"/sign-in"} className={buttonVariants()}>
                            Sign in
                        </Link>
                    )}
                </div>

                <div className="md:hidden">
                    {session?.user ? (
                        <UserAccountNav user={session?.user} />
                    ) : (
                        <Link href={"/sign-in"} className={buttonVariants()}>
                            Sign in
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
