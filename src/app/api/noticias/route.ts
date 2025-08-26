import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .replace(/\s+/g, "-");
}

// Criar notícia
export async function POST(req: NextRequest) {
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

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
        }

        const noticia = await prisma.noticia.findUnique({
            where: { id: Number(id) },
        });

        if (!noticia) {
            return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
        }

        return NextResponse.json(noticia);
    } catch (error) {
        console.error("Erro ao buscar notícia:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}
