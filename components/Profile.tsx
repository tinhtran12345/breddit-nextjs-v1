"use client";

import React, { useEffect, useState } from "react";
import { ModalTheme } from "./modal/modal-them";
import { UserAccountNav } from "./ui/user-account-nav";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Loader from "./ui/loader";

const Profile = (dataUser: any) => {
    const { data } = dataUser;

    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     setLoading(true);
    //     window.location.reload();
    //     setLoading(false);
    // }, [data]);

    return (
        <div>
            {loading && <Loader />}
            <div className="hidden md:flex gap-3">
                <ModalTheme />
                {data ? (
                    <div className="flex gap-2 items-center justify-center">
                        <UserAccountNav user={data} />
                        {data.username}
                    </div>
                ) : (
                    <Link href={"/sign-in"} className={buttonVariants()}>
                        Sign in
                    </Link>
                )}
            </div>

            <div className="md:hidden">
                {data ? (
                    <UserAccountNav user={data} />
                ) : (
                    <Link href={"/sign-in"} className={buttonVariants()}>
                        Sign in
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Profile;
