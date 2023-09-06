import { db } from "@/lib/db";
import PostFeed from "../PostFeed";

const INFINITE_SCROLL_PAGINATION_RESULTS = 3;

const GeneralFeed = async () => {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            votes: true,
            author: true,
            comments: true,
            subreddit: true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS, // 4 to demonstrate infinite scroll, should be higher in production
    });

    return <PostFeed initialPosts={posts} />;
};

export default GeneralFeed;
