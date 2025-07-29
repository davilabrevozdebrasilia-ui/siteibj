import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const anunciosDb = await prisma.anuncio.findMany({
        orderBy: { id: "desc" },
        take: 8,
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
