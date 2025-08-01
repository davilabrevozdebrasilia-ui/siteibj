// /app/api/noticias/ultimas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const offsetParam = url.searchParams.get("offset");
    const limitParam = url.searchParams.get("limit");

    const offset = parseInt(offsetParam || "0", 10);
    const limit = parseInt(limitParam || "6", 10);

    const ultimasNoticias = await prisma.noticia.findMany({
      orderBy: { data: "desc" },
      skip: offset,
      take: limit,
    });

    console.log(`🔎 Retornando ${ultimasNoticias.length} notícias (offset: ${offset}, limit: ${limit})`);

    return NextResponse.json(
      ultimasNoticias.map((noticia) => ({
        noticia,
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar últimas notícias:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
