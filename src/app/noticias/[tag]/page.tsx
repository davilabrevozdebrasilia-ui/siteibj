import { prisma } from "@/lib/prisma";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import NoticiaCard from "@/components/noticias/noticiaCard";
import { NoticiaCardProps } from "@/types/noticias";
import { AnuncioCardProps } from "@/types/anuncios";

interface PageProps {
  params: { tag: string };
}

export default async function NoticiasPorTagPage({ params }: PageProps) {
    const tag = params.tag;

    const noticiasDb = await prisma.noticia.findMany({
        where: {
            tags: {
                has: tag,
            },
        },
        orderBy: { data: "desc" },
        take: 20,
    });

    const anunciosDb = await prisma.anuncio.findMany({
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

    return (
        <div className="space-y-12">
            {anuncios.length > 0 && (
                <AdSliderFull anuncioCardProps={anuncios} />
            )}

            <section>
                <h1 className="text-3xl font-bold text-green-800 mb-4">
                    Notícias sobre "{tag}"
                </h1>

                {noticias.length === 0 ? (
                    <p className="text-center text-gray-500">Nenhuma notícia encontrada para esta tag.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {noticias[0] && (
                            <NoticiaCard noticiaCardProps={noticias[0]} />
                        )}

                        <div className="flex flex-col gap-10">
                            {noticias.slice(1, 3).map((n) => (
                                <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                            ))}
                        </div>

                        <div className="flex flex-col gap-10">
                            {noticias.slice(3, 6).map((n) => (
                                <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
