import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TOKEN = process.env.ADMIN_TOKEN;

function checkAuth(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    return authHeader === `Bearer ${TOKEN}`;
}

export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();

        // Validação básica (sem data)
        if (!data.titulo || !data.resumo || !data.tags) {
            return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
        }

        // Gera a data do servidor com dia/mês/ano zerados
        const hoje = new Date();
        const dataFormatada = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

        // Cria a notícia com href provisório
        const noticiaCriada = await prisma.noticia.create({
            data: {
                titulo: data.titulo,
                resumo: data.resumo,
                imagem: data.imagem || "",
                data: dataFormatada,
                tags: data.tags,
                href: "/noticia/pendente",  // href provisório obrigatório
            },
        });

        // Gera o href correto
        const hrefCorreto = `/noticia/${noticiaCriada.id}`;

        // Atualiza a notícia com o href correto
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
