import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TOKEN = process.env.ADMIN_TOKEN;

function checkAuth(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    return authHeader === `Bearer ${TOKEN}`;
}

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        if (!data.titulo || !data.resumo || !data.tags) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
        }

        const hoje = new Date();
        const dataFormatada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        const noticiaCriada = await prisma.noticia.create({
            data: {
                titulo: data.titulo,
                resumo: data.resumo,
                imagem: data.imagem || "",
                data: dataFormatada,
                tags: data.tags,
                href: "/publicacao/pendente",
            },
        });

        const slug = slugify(data.titulo);
        const hrefCorreto = `/publicacao/${slug}-${noticiaCriada.id}`;

        const noticiaAtualizada = await prisma.noticia.update({
            where: { id: noticiaCriada.id },
            data: { href: hrefCorreto },
        });

        return NextResponse.json(noticiaAtualizada);
    } catch (error) {
        console.error("Erro ao criar notícia:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
