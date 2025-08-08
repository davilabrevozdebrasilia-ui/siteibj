import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const USERNAME = process.env.ADMIN_USERNAME;
const PASSWORD_HASH_RAW = process.env.ADMIN_PASSWORD || "";
const PASSWORD_HASH = PASSWORD_HASH_RAW.replace(/-/g, "$");
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = "24h";

export async function POST(req: Request) {
    const { username, password } = await req.json();

    if (username !== USERNAME) {
        return NextResponse.json({ error: "Unauthorized - usuário inválido" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, PASSWORD_HASH);
    if (!isPasswordValid) {
        return NextResponse.json({ error: "Unauthorized - senha inválida" }, { status: 401 });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return NextResponse.json({ token });
}
