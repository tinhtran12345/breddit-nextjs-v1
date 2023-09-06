"use client";

import { ExtendedPost } from "@/types/db";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "./Post";
import { useSession } from "next-auth/react";
import { InfinitySpin } from "react-loader-spinner";

// work flow:

interface PostFeedProps {
    initialPosts: ExtendedPost[];
    subredditName?: string;
}
const INFINITE_SCROLL_PAGINATION_RESULTS = 3;

const PostFeed: React.FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
    const [items, setItems] = useState<object[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const { data: session } = useSession();

    const fetchData = async () => {
        try {
            const { data } = await axios.get(
                `/api/posts?page=${page}&limit=${INFINITE_SCROLL_PAGINATION_RESULTS}` +
                    (!!subredditName ? `&subredditName=${subredditName}` : "")
            );
            setItems([...items, ...data]);
            if (data.length === 0) {
                setHasMore(false);
            }
            setPage(page + 1);
        } catch (error) {
            console.log(error);
            toast.error("Error fetching data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <ul className="flex flex-col col-span-2 space-y-6 overflow-auto">
            <InfiniteScroll
                dataLength={items.length}
                next={fetchData}
                hasMore={hasMore}
                loader={
                    <div className="flex h-full w-full items-center justify-center">
                        <InfinitySpin width="150" color="#4fa94d" />
                    </div>
                }
            >
                {/* Render your items here */}
                {items.length > 0 ? (
                    items.map((item) => {
                        const votesAmt = item?.votes.reduce(
                            (acc: number, vote: any) => {
                                if (vote.type === "UP") return acc + 1;
                                if (vote.type === "DOWN") return acc - 1;
                                return acc;
                            },
                            0
                        );
                        const currentVote = item?.votes.find(
                            (vote: any) => vote.userId === session?.user.id
                        );

                        return (
                            <Post
                                key={item.id}
                                post={item}
                                commentAmt={item?.comments.length}
                                subredditName={item?.subreddit.name}
                                votesAmt={votesAmt}
                                currentVote={currentVote}
                            />
                        );
                    })
                ) : (
                    <p className="text-slate-400">No posts</p>
                )}
            </InfiniteScroll>
        </ul>
    );
};

export default PostFeed;
