import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const parts = pathname.split("/");
    const titulo = decodeURIComponent(parts[parts.length - 1]);

    const countOnly = url.searchParams.get("count") === "true";

    if (countOnly) {
        const total = await prisma.imagem.count({
            where: {
                projetos: { has: titulo },
            },
        });
        return NextResponse.json({ total });
    }
    const page = parseInt(url.searchParams.get("page") || "0");
    const pageSize = parseInt(url.searchParams.get("limit") || "2");

    const imagens = await prisma.imagem.findMany({
        where: {
            projetos: { has: titulo },
        },
        orderBy: { id: "asc" },
        skip: page * pageSize,
        take: pageSize,
    });

    return NextResponse.json(imagens);
}
