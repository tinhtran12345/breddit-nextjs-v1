"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/loader";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const CreatePage = () => {
    const router = useRouter();
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const onCreateCommunity = async () => {
        try {
            setLoading(true);
            const res = await axios.post("/api/subreddit", {
                name: input,
            });
            if (res?.data) {
                setInput("");
                router.push(`/redis/${res?.data.name}`);
                toast.success("Create successfully!");
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data || "Create failed ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            {loading ? (
                <Loader />
            ) : (
                <div className="relative  w-full h-fit p-4 rounded-lg space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-xl font-semibold">
                            Create a Community
                        </h1>
                    </div>

                    <hr className="bg-red-500 h-px" />

                    <div>
                        <p className="text-lg font-medium">Name</p>
                        <p className="text-xs pb-2">
                            Community names including capitalization cannot be
                            changed.
                        </p>
                        <div className="relative">
                            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                                r/
                            </p>
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="pl-6 border-black"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            disabled={loading}
                            variant={"destructive"}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={input.length === 0}
                            onClick={onCreateCommunity}
                        >
                            Create Community
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePage;
