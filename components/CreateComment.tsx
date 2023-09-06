"use client";

import { CommentRequest } from "@/lib/validators/comment";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import Loader from "./ui/loader";

interface CreateCommentProps {
    postId: string;
    replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
    const [input, setInput] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const router = useRouter();
    const comment = async ({ postId, text, replyToId }: CommentRequest) => {
        const payload: CommentRequest = { postId, text, replyToId };
        //    Call api
        try {
            setLoading(true);
            const res = await axios.patch(
                `/api/subreddit/post/comment/`,
                payload
            );
            if (res?.data) {
                toast.success("Successfully!");
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
        <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            {loading && <Loader />}
            <div className="mt-2">
                <Textarea
                    id="comment"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={1}
                    placeholder="What are your thoughts?"
                />

                <div className="mt-2 flex justify-end">
                    <Button
                        disabled={input.length === 0}
                        onClick={() =>
                            comment({ postId, text: input, replyToId })
                        }
                    >
                        Post
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateComment;
