import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const TOKEN = process.env.ADMIN_TOKEN;

function checkAuth(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    return authHeader === `Bearer ${TOKEN}`;
}

export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    if (!data.titulo || !data.url) {
        return NextResponse.json(
            { error: "Campos obrigatórios faltando: titulo e url" },
            { status: 400 }
        );
    }

    let tags: string[] = [];
    if (Array.isArray(data.tags)) {
        tags = data.tags;
    } else if (typeof data.tags === "string") {
        tags = data.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    try {
        const videoCriado = await prisma.video.create({
            data: {
                titulo: data.titulo,
                descricao: data.descricao || null,
                url: data.url,
                projetos: data.projetos
            },
        });

        return NextResponse.json(videoCriado);
    } catch (error) {
        console.error("Erro ao criar vídeo:", error);
        return NextResponse.json({ error: "Erro interno" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    try {
        const [videos, total] = await Promise.all([
            prisma.video.findMany({
                skip,
                take: limit,
                orderBy: { dataCriacao: "desc" },
                select: {
                    id: true,
                    titulo: true,
                    descricao: true,
                    url: true,
                    dataCriacao: true,
                    projetos: true
                },
            }),
            prisma.video.count(),
        ]);

        return NextResponse.json({
            data: videos,
            meta: {
                page,
                perPage: limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
        return new NextResponse("Erro ao buscar vídeos", { status: 500 });
    }
}
