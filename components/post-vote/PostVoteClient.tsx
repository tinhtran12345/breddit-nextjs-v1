"use client";
import { VoteType } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { usePrevious } from "@mantine/hooks";
import { Button } from "../ui/button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios from "axios";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// work flow: 1. Thiết kế UI:
//          => Gồm 2 nút bấm và một p để show số lượng vote hiện tại.
//            2. Tạo chức năng vote (onClick) cho 2 button:
//          => Nêu type === "UP" => call api để tăng số lượng lượt thích
//          => Nêu type === "DOWN" => call api để giảm số lượng lượt thích
//            3. Viết API
//          => Input: TypeVote và PostId:
//                  - Đâu tiên check authorized
//                  - Check xem tài khoản đăng đang nhập đã vote cho post này hay chưa
//                  - Nếu đã vote:
//            4. Viết chức năng cho hàm vote

interface PostVoteClientProps {
    postId: string;
    initialVoteAmt: number;
    initialVote?: VoteType | null;
}

const PostVoteClient = ({
    postId,
    initialVoteAmt,
    initialVote,
}: PostVoteClientProps) => {
    const [votesAmt, setVotesAmt] = useState<number>(initialVoteAmt);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const { data: session } = useSession();
    const router = useRouter();

    const vote = async (type: VoteType) => {
        const payload: PostVoteRequest = {
            voteType: type,
            postId: postId,
        };
        try {
            if (!session) {
                router.push("/sign-in");
                return;
            }
            await axios.patch("/api/subreddit/post/vote", payload);
            if (currentVote === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined);
                if (type === "UP") setVotesAmt((prev) => prev - 1);
                else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
            } else {
                // User is voting in the opposite direction, so subtract 2
                setCurrentVote(type);
                if (type === "UP")
                    setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
                else if (type === "DOWN")
                    setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    };
    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);
    return (
        <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
            {/* upvote */}
            <Button
                onClick={() => vote("UP")}
                size="sm"
                variant="ghost"
                aria-label="upvote"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 ", {
                        "text-emerald-500 fill-emerald-500":
                            currentVote === "UP",
                    })}
                />
            </Button>

            {/* score */}
            <p className="text-center py-2 font-medium text-sm ">{votesAmt}</p>

            {/* downvote */}
            <Button
                onClick={() => vote("DOWN")}
                size="sm"
                className={cn({
                    "text-emerald-500": currentVote === "DOWN",
                })}
                variant="ghost"
                aria-label="downvote"
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 ", {
                        "text-red-500 fill-red-500": currentVote === "DOWN",
                    })}
                />
            </Button>
        </div>
    );
};

export default PostVoteClient;
