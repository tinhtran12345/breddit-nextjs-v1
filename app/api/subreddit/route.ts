import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { NextResponse } from "next/server";
import { z } from "zod";

//  flow: check authorized => Nếu tên của reddit đã tồn tại thì trả về thông báo.
//                         => Nếu tên chưa từng tồn tại tạo ra new reddit (name và người tạo ra new reddit) => tạo một subscription ( người đăng kí, id của reddit)

export async function POST(req: Response) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
        const body = await req.json();
        const { name } = SubredditValidator.parse(body);
        // Check if subreddit already existed
        const subredditExists = await db.subreddit.findFirst({
            where: {
                name,
            },
        });
        if (subredditExists) {
            return new NextResponse("Subreddit already exists", {
                status: 409,
            });
        }
        // create subreddit and associate it with the user
        const subreddit = await db.subreddit.create({
            data: {
                name,
                creatorId: session.user.id,
            },
        });
        // creator also has to be subscribed
        await db.subscription.create({
            data: {
                userId: session.user.id,
                subredditId: subreddit.id,
            },
        });
        return NextResponse.json(subreddit);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.message, { status: 422 });
        }

        return new NextResponse("Could not create subreddit", { status: 500 });
    }
}
