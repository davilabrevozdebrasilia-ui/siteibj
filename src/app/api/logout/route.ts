import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const cookie = serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // remove cookie
    });

    return NextResponse.json(
        { success: true },
        {
            status: 200,
            headers: {
                "Set-Cookie": cookie,
            },
        }
    );
}
