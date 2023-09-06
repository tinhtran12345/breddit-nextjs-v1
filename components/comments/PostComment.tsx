"use client";

import { formatTimeToNow } from "@/lib/utils";
import { CommentRequest } from "@/lib/validators/comment";
import { Comment, CommentVote, User } from "@prisma/client";

import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useRef, useState } from "react";
import CommentVotes from "../CommentVotes";

import { useSession } from "next-auth/react";
import UserAvatar from "../ui/user-avatar";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import toast from "react-hot-toast";
import Loader from "../ui/loader";

type ExtendedComment = Comment & {
    votes: CommentVote[];
    author: User;
};

interface PostCommentProps {
    comment: ExtendedComment;
    votesAmt: number;
    currentVote: CommentVote | undefined;
    postId: string;
}

const PostComment: FC<PostCommentProps> = ({
    comment,
    votesAmt,
    currentVote,
    postId,
}) => {
    const { data: session } = useSession();
    const [loading, setLoading] = useState<boolean>(false);
    const [isReplying, setIsReplying] = useState<boolean>(false);
    const commentRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState<string>(`@${comment.author.username} `);
    const router = useRouter();
    const postComment = async ({ postId, text, replyToId }: CommentRequest) => {
        const payload: CommentRequest = { postId, text, replyToId };
        try {
            setLoading(true);
            const res = await axios.patch(
                `/api/subreddit/post/comment/`,
                payload
            );
            if (res?.data) {
                toast.success("Successfully!");
                setIsReplying(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        } finally {
            router.refresh();
            setInput("");
            setLoading(false);
        }
    };

    return (
        <div ref={commentRef} className="flex flex-col">
            <div className="flex items-center">
                <UserAvatar
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null,
                    }}
                    className="h-6 w-6"
                />
                <div className="ml-2 flex items-center gap-x-2">
                    <p className="text-sm font-medium ">
                        u/{comment.author.username}
                    </p>

                    <p className="max-h-40 truncate text-xs ">
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>

            <p className="text-sm  mt-2">{comment.text}</p>

            <div className="flex gap-2 items-center">
                <CommentVotes
                    commentId={comment.id}
                    votesAmt={votesAmt}
                    currentVote={currentVote}
                />

                <Button
                    onClick={() => {
                        if (!session) return router.push("/sign-in");
                        setIsReplying(true);
                    }}
                    variant="ghost"
                >
                    <MessageSquare className="h-4 w-4 mr-1.5" />
                    Reply
                </Button>
            </div>

            {isReplying ? (
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="comment">Your comment</Label>
                    {loading && <Loader />}
                    <div className="mt-2">
                        <Textarea
                            onFocus={(e) =>
                                e.currentTarget.setSelectionRange(
                                    e.currentTarget.value.length,
                                    e.currentTarget.value.length
                                )
                            }
                            autoFocus
                            id="comment"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            rows={1}
                            placeholder="What are your thoughts?"
                        />

                        <div className="mt-2 flex justify-end gap-2">
                            <Button
                                tabIndex={-1}
                                onClick={() => setIsReplying(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={loading}
                                onClick={() => {
                                    if (!input) return;
                                    postComment({
                                        postId,
                                        text: input,
                                        replyToId:
                                            comment.replyToId ?? comment.id, // default to top-level comment
                                    });
                                }}
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default PostComment;
