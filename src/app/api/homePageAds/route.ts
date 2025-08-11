import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset")) || 0;
    const limit = Number(url.searchParams.get("limit")) || 20;

    const anunciosDb = await prisma.anuncio.findMany({
        orderBy: { id: "desc" },
        skip: offset,
        take: limit,
    });

    const anuncios = anunciosDb.map((a) => ({
        anuncio: {
            id: a.id,
            titulo: a.titulo,
            imagem: a.imagem,
            href: a.href,
        },
    }));

    return NextResponse.json(anuncios);
}
