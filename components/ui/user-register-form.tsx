import React, { ChangeEvent, useState } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import axios from "axios";

import Loader from "./loader";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const input_style =
    "form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

const UserRegisterForm: React.FC<UserAuthFormProps> = ({
    className,
    ...props
}) => {
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
            await axios.post("/api/register", formValues);
            toast.success("Successfully");

            signIn(undefined, { callbackUrl: "/" });
        } catch (error) {
            toast.error("User is existed");
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
                    Sign up
                </Button>
            </form>
        </div>
    );
};

export default UserRegisterForm;
