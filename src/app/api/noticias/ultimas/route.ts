// /app/api/noticias/ultimas/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const ultimasNoticias = await prisma.noticia.findMany({
      orderBy: { data: "desc" },
      take: 23,
    });

    console.log("🔎 Retornando notícias:", ultimasNoticias.length);

    return NextResponse.json(
      ultimasNoticias.map((noticia) => ({
        noticia, // você pode adaptar o formato aqui conforme o esperado
      }))
    );
  } catch (error) {
    console.error("Erro ao buscar últimas notícias:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
