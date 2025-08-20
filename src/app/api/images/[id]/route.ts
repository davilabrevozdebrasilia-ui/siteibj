import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const idStr = url.pathname.split("/").pop(); 
  const id = Number(idStr);

  if (isNaN(id)) return new NextResponse("ID inválido", { status: 400 });

  const imagem = await prisma.imagem.findUnique({
    where: { id },
    select: { url: true },
  });

  if (!imagem) return new NextResponse("Imagem não encontrada", { status: 404 });

  const buffer = Buffer.from(imagem.url.split(",")[1], "base64");
  return new NextResponse(buffer, {
    status: 200,
    headers: { "Content-Type": "image/webp" },
  });
}
