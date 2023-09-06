// Method: POST
// wf: input: {title, content, subredditId}: authorized user=> check xem user đã subscribe cái  subreddit này chưa:
//          + => Nếu user chưa subscribe cái subreddit này thì trả về: Subscribe to post
//          + => Ngược lại: thì create ra cái post này => Trả về oke.

import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, content, subredditId } = PostValidator.parse(body);
        const session = await getAuthSession();
        if (!session) {
            return new Response("Authorized", { status: 401 });
        }
        const subscription = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id,
            },
        });
        if (!subscription) {
            return new Response("Join to post, please!", { status: 403 });
        }
        await db.post.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                subredditId,
            },
        });
        return Response.json("OK");
    } catch (error) {
        console.log(error);
        return new Response(
            "Could not post to subreddit at this time. Please try later",
            { status: 500 }
        );
    }
}
