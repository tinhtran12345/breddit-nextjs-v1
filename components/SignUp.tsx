"use client";
import React from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Icons } from "./ui/icons";
import UserAuthForm from "./ui/user-login-form";
import UserRegisterForm from "./ui/user-register-form";

const SignUp = () => {
    return (
        <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col space-y-2 text-center">
                <Icons.logo className="mx-auto h-6 w-6" />
                <h1 className="text-2xl font-semibold tracking-tight">
                    Sign Up
                </h1>
                <p className="text-sm max-w-xs mx-auto">
                    By continuing, you are setting up a Breadit account and
                    agree to our User Agreement and Privacy Policy.
                </p>
            </div>
            <UserRegisterForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                Already a Breadditor?{" "}
                <Link
                    href="/sign-in"
                    className="hover:text-brand text-sm underline underline-offset-4"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SignUp;
