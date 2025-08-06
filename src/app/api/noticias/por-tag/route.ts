import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const tagsParam = url.searchParams.get("tags");

  if (!tagsParam) {
    return NextResponse.json({ error: "Tags são obrigatórias" }, { status: 400 });
  }

  const tags = tagsParam.split(",").map(tag => tag.trim()).filter(Boolean);

  try {
    const noticias = await Promise.all(
      tags.map(async (tag) => {
        const noticia = await prisma.noticia.findMany({
          where: {
            tags: {
              has: tag,
            },
          },
          orderBy: { data: "desc" },
          take: 2
        });

        return noticia ? { tag, noticia } : null;
      })
    );

    const noticiasFiltradas = noticias.filter(Boolean); // remove nulls

    return NextResponse.json(noticiasFiltradas);
  } catch (error) {
    console.error("Erro ao buscar notícias por tag:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
