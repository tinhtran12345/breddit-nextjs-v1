import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession();

        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name } = UsernameValidator.parse(body);

        // check if username is taken
        const username = await db.user.findFirst({
            where: {
                username: name,
            },
        });

        if (username) {
            return new Response("Username is taken", { status: 409 });
        }

        // update username
        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                username: name,
            },
        });

        return new NextResponse("OK");
    } catch (error) {
        return new Response(
            "Could not update username at this time. Please try later",
            { status: 500 }
        );
    }
}
