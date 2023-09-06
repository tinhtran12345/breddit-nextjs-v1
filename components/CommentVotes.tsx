"use client";

import { cn } from "@/lib/utils";
import { CommentVoteRequest } from "@/lib/validators/vote";

import { CommentVote, VoteType } from "@prisma/client";

import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

interface CommentVotesProps {
    commentId: string;
    votesAmt: number;
    currentVote?: PartialVote;
}

type PartialVote = Pick<CommentVote, "type">;

const CommentVotes: FC<CommentVotesProps> = ({
    commentId,
    votesAmt: _votesAmt,
    currentVote: _currentVote,
}) => {
    const [votesAmt, setVotesAmt] = useState<number>(_votesAmt);
    const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
        _currentVote
    );
    const vote = async (type: VoteType) => {
        const payload: CommentVoteRequest = {
            voteType: type,
            commentId,
        };
        try {
            await axios.patch("/api/subreddit/post/comment/vote", payload);
            if (currentVote?.type === type) {
                // User is voting the same way again, so remove their vote
                setCurrentVote(undefined);
                if (type === "UP") setVotesAmt((prev) => prev - 1);
                else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
            } else {
                // User is voting in the opposite direction, so subtract 2
                setCurrentVote({ type });
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

    return (
        <div className="flex gap-1 items-center">
            {/* upvote */}
            <Button
                onClick={() => vote("UP")}
                variant="ghost"
                aria-label="upvote"
            >
                <ArrowBigUp
                    className={cn("h-5 w-5 ", {
                        "text-emerald-500 fill-emerald-500":
                            currentVote?.type === "UP",
                    })}
                />
            </Button>

            {/* score */}
            <p className="text-center py-2 px-1 font-medium text-xs ">
                {votesAmt}
            </p>

            {/* downvote */}
            <Button
                onClick={() => vote("DOWN")}
                className={cn({
                    "text-emerald-500": currentVote?.type === "DOWN",
                })}
                variant="ghost"
                aria-label="downvote"
            >
                <ArrowBigDown
                    className={cn("h-5 w-5 ", {
                        "text-red-500 fill-red-500":
                            currentVote?.type === "DOWN",
                    })}
                />
            </Button>
        </div>
    );
};

export default CommentVotes;
