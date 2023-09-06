// work flow: Find tất cả các subreddit mà tài khoản của user hiện tại đang subscription => Sau đó lấy các params cần thiết từ url
//          => Có hai kiểu truy vấn:
//             1. Nếu chưa đang nhập thì truy vấn =  subredditname
//             2. Nếu đăng nhập thì truy vấn = tất cả các subreddit(id) mà tài khoản đăng nhập đang follow

//          => Sau khi có truy vấn => truy cập post => dùng điều kiện truy vấn ở trên để lọc

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const session = await getAuthSession();
    let followedCommunitiesIds: string[] = [];

    if (session) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                subreddit: true,
            },
        });
        followedCommunitiesIds = followedCommunities.map(
            (sub) => sub.subreddit.id
        );
        // console.log(followedCommunitiesIds);
    }

    try {
        const subredditName = url.searchParams.get("subredditName") as string;
        const limit = url.searchParams.get("limit") as string;
        const page = url.searchParams.get("page") as string;
        // console.log(subredditName, ":", limit, ":", page);
        let whereClause = {};

        if (subredditName) {
            whereClause = {
                subreddit: {
                    name: subredditName,
                },
            };
        } else if (session) {
            whereClause = {
                subreddit: {
                    id: {
                        in: followedCommunitiesIds,
                    },
                },
            };
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
            orderBy: {
                createdAt: "desc",
            },
            include: {
                subreddit: true,
                votes: true,
                author: true,
                comments: true,
            },
            where: whereClause,
        });

        return Response.json(posts);
    } catch (error) {
        console.log(error);
        return new Response("Could not fetch posts", { status: 500 });
    }
}
