import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    context: { params: { id: number } }
) {
    const { id } = context.params;

    try {
        const noticia = await prisma.noticia.findUnique({
            where: { id },
        });

        if (!noticia) {
            return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
        }

        return NextResponse.json(noticia);
    } catch (error) {
        console.error("Erro ao buscar notícia por ID:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
