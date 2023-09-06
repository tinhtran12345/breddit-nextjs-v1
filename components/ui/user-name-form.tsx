"use client";

import { User } from "@prisma/client";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { Input } from "./input";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { UsernameValidator } from "@/lib/validators/username";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import Loader from "./loader";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, "id" | "username">;
}
type FormData = z.infer<typeof UsernameValidator>;

const UserNameForm = ({ user, className, ...props }: UserNameFormProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(UsernameValidator),
        defaultValues: {
            name: user?.username || "",
        },
    });
    const onSubmit = async (values: FormData) => {
        setLoading(true);
        try {
            await axios.patch("/api/username", values);
            window.location.reload();

            toast.success("Update successfully!");
        } catch (error: any) {
            toast.error(error?.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <form
                    className={cn(className)}
                    onSubmit={handleSubmit(onSubmit)}
                    {...props}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Your username</CardTitle>
                            <CardDescription>
                                Please enter a display name you are comfortable
                                with.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative grid gap-1">
                                <Label className="sr-only" htmlFor="name">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    className="w-[400px] pl-6"
                                    size={32}
                                    placeholder="Enter username"
                                    {...register("name")}
                                />
                                {errors?.name && (
                                    <p className="px-1 text-xs text-red-600">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Change username</Button>
                        </CardFooter>
                    </Card>
                </form>
            )}
        </>
    );
};

export default UserNameForm;
