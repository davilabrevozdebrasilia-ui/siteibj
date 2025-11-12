import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(req: NextRequest) {
    const data = await req.json();

    if (!data.titulo || !data.url) {
        return NextResponse.json(
            { error: "Campos obrigatórios faltando: titulo e url" },
            { status: 400 }
        );
    }

    let tags: string[] = [];
    if (Array.isArray(data.tags)) tags = data.tags;
    else if (typeof data.tags === "string")
        tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);

    try {
        const response = await fetch(data.url);
        const buffer = Buffer.from(await response.arrayBuffer());

        const optimizedBuffer = await sharp(buffer)
            .webp({ quality: 75 })
            .toBuffer();

        const optimizedBase64 = `data:image/webp;base64,${optimizedBuffer.toString(
            "base64"
        )}`;

        const imagemCriada = await prisma.imagem.create({
            data: {
                titulo: data.titulo,
                descricao: data.descricao || null,
                url: optimizedBase64,
                projetos: data.projetos,
            },
        });

        return NextResponse.json(imagemCriada);
    } catch (error) {
        console.error("Erro ao criar imagem:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const tagsParam = searchParams.get("tags");
    const projetosParam = searchParams.get("projetos");

    const tags = tagsParam
        ? tagsParam.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const projetos = projetosParam
        ? projetosParam.split(",").map((p) => p.trim()).filter(Boolean)
        : [];

    const where: any = {};

    if (tags.length > 0) {
        where.tags = { hasSome: tags };
    }

    if (projetos.length > 0) {
        where.projetos = { hasSome: projetos };
    }

    try {
        const [imagens, total] = await Promise.all([
            prisma.imagem.findMany({
                where,
                skip,
                take: limit,
                orderBy: { dataCriacao: "asc" },
                select: {
                    id: true,
                    titulo: true,
                    descricao: true,
                    dataCriacao: true,
                    projetos: true,
                },
            }),
            prisma.imagem.count({ where }),
        ]);

        return NextResponse.json({
            data: imagens,
            meta: {
                page,
                perPage: limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Erro ao buscar imagens:", error);
        return new NextResponse("Erro ao buscar imagens", { status: 500 });
    }
}

