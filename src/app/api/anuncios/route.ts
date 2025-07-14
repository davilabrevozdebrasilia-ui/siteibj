import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
const TOKEN = process.env.ADMIN_TOKEN;

function checkAuth(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    return authHeader === `Bearer ${TOKEN}`;
}

export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.titulo || !data.imagem || !data.href) {
        return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
    }

    const anuncioCriado = await prisma.anuncio.create({
        data: {
            titulo: data.titulo,
            imagem: data.imagem,
            href: data.href,
        },
    });

    return NextResponse.json(anuncioCriado);
}
