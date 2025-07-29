import { prisma } from "@/lib/prisma";
import { NoticiaCardProps } from "@/types/noticias";
import { AnuncioCardProps } from "@/types/anuncios";

export async function getHomePageData() {
    const noticiasDb = await prisma.noticia.findMany({
        select: {
            id: true,
            titulo: true,
            resumo: true,
            imagem: true,
            data: true,
            tags: true,
            href: true,
        },
        orderBy: { id: "desc" },
        take: 25,
    });

    const anunciosDb = await prisma.anuncio.findMany({
        select: {
            id: true,
            titulo: true,
            imagem: true,
            href: true,
        },
        orderBy: { id: "desc" },
        take: 8,
    });

    const noticias: NoticiaCardProps[] = noticiasDb.map((n) => ({
        noticia: {
            id: n.id,
            titulo: n.titulo,
            resumo: n.resumo,
            imagem: n.imagem,
            data: new Date(n.data).toLocaleDateString("pt-BR"),
            tags: n.tags,
            href: n.href,
        },
    }));

    const anuncios: AnuncioCardProps[] = anunciosDb.map((a) => ({
        anuncio: {
            id: a.id,
            titulo: a.titulo,
            imagem: a.imagem,
            href: a.href,
        },
    }));

    return { noticias, anuncios };
}
