import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const noticiasDb = await prisma.noticia.findMany({
        orderBy: { id: "desc" },
        take: 31,
    });

    const noticias = noticiasDb.map((n) => ({
        noticia: {
            id: n.id,
            titulo: n.titulo,
            resumo: n.resumo,
            imagem: n.imagem,
            data: new Date(n.data).toLocaleDateString("pt-BR"),
            tags: n.tags,
            href: n.href,
        },
    }));

    return NextResponse.json(noticias);
}
