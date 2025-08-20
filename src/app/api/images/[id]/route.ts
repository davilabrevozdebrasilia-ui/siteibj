import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);

    try {
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
    } catch (error) {
        console.error("Erro ao buscar imagem:", error);
        return new NextResponse("Erro interno", { status: 500 });
    }
}
