import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tag = url.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json({ error: "Tag é obrigatória" }, { status: 400 });
  }

  try {
    const noticias = await prisma.noticia.findMany({
      where: {
        tags: {
          has: tag,
        },
      },
      orderBy: {
        data: "desc",
      },
    });

    return NextResponse.json(noticias);
  } catch (error) {
    console.error("Erro ao buscar notícias por tag:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
