import AdCard400 from "@/components/anuncios/adCard400";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import NoticiaCard from "@/components/noticias/noticiaCard";
import NoticiaGrid from "@/components/noticias/noticiaGrid";
import NoticiaLista from "@/components/noticias/noticiaList";
import { prisma } from "@/lib/prisma";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";

export default async function HomePage() {
    const noticiasDb = await prisma.noticia.findMany({
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
    const usadas = new Set<number>();

    // 🔪 Função auxiliar para filtrar sem repetir
    const pegarNaoUsadas = (lista: NoticiaCardProps[], quantidade: number) => {
        const resultado: NoticiaCardProps[] = [];
        for (const n of lista) {
            if (!usadas.has(n.noticia.id)) {
                resultado.push(n);
                usadas.add(n.noticia.id);
            }
            if (resultado.length >= quantidade) break;
        }
        return resultado;
    };
    const noticiaDestaqueCardProps = noticias.slice(0, 10);
    const noticiaMinorCardProps = noticias.slice(10, 11);
    const noticiaComumCardProps = noticias.slice(10, 18);
    const anuncioCardProps = anuncios;

    return (
        <div className="space-y-12">
            {anuncioCardProps.length > 0 && (
                <AdSliderFull anuncioCardProps={anuncioCardProps} />
            )}

            {noticiaDestaqueCardProps.length > 0 && (
                <section>
                    <h1 className="text-3xl font-bold text-green-800 mb-4">Últimas notícias</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        <div className="flex flex-col gap-10">
                            {noticiaDestaqueCardProps[0] && (
                                <NoticiaCard noticiaCardProps={noticiaDestaqueCardProps[0]} />
                            )}
                        </div>
                        <div className="flex flex-col gap-10">
                            {noticiaDestaqueCardProps.slice(0, 2).map((n) => (
                                <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                            ))}
                        </div>
                        <div className="flex flex-col gap-10">
                            {noticiaDestaqueCardProps.slice(2, 4).map((n) => (
                                <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                            ))}
                        </div>
                        <div className="flex flex-col gap-10">
                            {anuncioCardProps[0] && (
                                <AdCard400 anuncioCardProps={anuncioCardProps[0]} />
                            )}
                        </div>
                    </div>
                </section>
            )}

            {noticiaDestaqueCardProps.length > 0 && (
                <section>
                    <NoticiaGrid noticiaCardProps={noticiaDestaqueCardProps.slice(4, 10)} />
                </section>
            )}

            {anuncioCardProps.length > 0 && (
                <AdSliderFull anuncioCardProps={anuncioCardProps} />
            )}

            {noticiaComumCardProps.length > 0 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(() => {
                        const tags = ["Economia", "Saúde", "Tecnologia", "Meio ambiente", "Brasil", "Brasília"].slice(0, 6);
                        const usadas = new Set<number>(); 
                        return tags.map((tag, i) => {
                            const noticia = noticiaComumCardProps.find((n) => {
                                const contemTag = n.noticia.tags?.some(
                                    (t) => t.toLowerCase() === tag.toLowerCase()
                                );
                                const aindaNaoUsada = !usadas.has(n.noticia.id);
                                return contemTag && aindaNaoUsada;
                            });

                            if (noticia) usadas.add(noticia.noticia.id);

                            return (
                                <div key={i}>
                                    <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                        {tag}
                                    </h2>
                                    {noticia ? (
                                        <NoticiaLista noticiaCardProps={[noticia]} />
                                    ) : (
                                        <p className="text-gray-500">Nenhuma notícia disponível</p>
                                    )}
                                </div>
                            );
                        });
                    })()}
                </section>
            )}


            {anuncioCardProps.length > 0 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {anuncioCardProps.slice(0, 3).map((a) => (
                        <div key={a.anuncio.id}>
                            <AdCard400 anuncioCardProps={a} />
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
