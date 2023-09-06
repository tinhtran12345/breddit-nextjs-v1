"use client";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
import UserAvatar from "./ui/user-avatar";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Image as ImageIcon, Link2, User } from "lucide-react";

interface MiniCreatePostProps {
    session: Session | null;
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ session }) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <li className="overflow-hidden rounded-md shadow">
            <div className="h-full px-6 py-4 flex justify-between gap-6">
                <div className="relative">
                    <User className="w-8 h-8" />
                    <span className="absolute top-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
                </div>
                <Input
                    onClick={() => router.push(pathname + "/submit")}
                    readOnly
                    placeholder="Create post"
                />
                <Button
                    onClick={() => router.push(pathname + "/submit")}
                    variant="ghost"
                >
                    <ImageIcon className="text-zinc-600" />
                </Button>
                <Button
                    onClick={() => router.push(pathname + "/submit")}
                    variant="ghost"
                >
                    <Link2 className="text-zinc-600" />
                </Button>
            </div>
        </li>
    );
};

export default MiniCreatePost;
