"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { signIn } from "next-auth/react";
import Loader from "./loader";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
// work flow: fixed ui login form => xử lí onSubmit function with credential => jwt and middleware

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

const UserLoginForm: React.FC<UserAuthFormProps> = ({
    className,
    ...props
}) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    });
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues({ ...formValues, [name]: value });
    };
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setFormValues({
                email: "",
                password: "",
            });
            // api
            const res = await signIn("credentials", {
                redirect: false,
                email: formValues.email as string,
                password: formValues.password as string,
                callbackUrl: "/",
            });
            if (!res?.error) {
                toast.success("successfully!");
                location.reload();
            } else {
                toast.error("Wrong email or password");
            }
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };
    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            // api
            await signIn("google");
            setTimeout(() => {
                toast.success("Successfully!");
            }, 4000);
        } catch (error) {
            toast.error("There was an error logging in with Google");
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={cn("flex flex-col justify-center", className)}
            {...props}
        >
            {loading && <Loader />}
            <form className="w-full" onSubmit={onSubmit}>
                <div className="mb-4">
                    <input
                        required
                        type="email"
                        name="email"
                        value={formValues.email}
                        onChange={onChange}
                        placeholder="Email address"
                        className={input_style}
                    />
                </div>
                <div className="mb-4">
                    <input
                        required
                        type="password"
                        name="password"
                        onChange={onChange}
                        value={formValues.password}
                        placeholder="Enter password"
                        className={input_style}
                    />
                </div>
                <Button
                    type="submit"
                    size="sm"
                    className="w-full py-6 font-bold "
                    disabled={loading}
                >
                    Sign in
                </Button>
            </form>
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>
            <Button
                type="button"
                size="sm"
                className="w-full py-6 "
                onClick={loginWithGoogle}
                disabled={loading}
            >
                <Icons.google className="h-4 w-4 mr-2" />
                Google
            </Button>
        </div>
    );
};

export default UserLoginForm;
