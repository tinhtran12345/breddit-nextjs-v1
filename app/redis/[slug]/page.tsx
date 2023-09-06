import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        slug: string;
    };
}
// work flow: (Tạo Infinite Scroll): viết api để get all post and get posts with query
// Ở bước này:

// Link tham khảo:https://xerosource.com/how-to-implement-infinite-scroll-in-nextjs/

const Page = async ({ params }: PageProps) => {
    const { slug } = params;
    const session = await getAuthSession();

    const subreddit = await db.subreddit.findFirst({
        where: { name: slug },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                    comments: true,
                    subreddit: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 2,
            },
        },
    });

    if (!subreddit) return notFound();

    return (
        <>
            <h1 className="font-bold text-3xl md:text-4xl h-14">
                redis/{subreddit.name}
            </h1>
            <MiniCreatePost session={session} />
            <PostFeed
                initialPosts={subreddit.posts}
                subredditName={subreddit.name}
            />
        </>
    );
};

export default Page;
