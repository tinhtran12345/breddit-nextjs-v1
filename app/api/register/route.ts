import { db } from "@/lib/db";
import { generatePassword } from "@/lib/utils";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;
        const hashPassword = await generatePassword(password);

        const res = await db.user.findFirst({
            where: {
                email: email,
            },
        });

        if (res) {
            return new NextResponse("User is existed", { status: 403 });
        }
        const newUser = await db.user.create({
            data: {
                email,
                password: hashPassword,
            },
        });

        return NextResponse.json({
            data: {
                email: newUser.email,
            },
        });
    } catch (error) {
        console.log("[REGISTER_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
