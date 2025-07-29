import AdCard from "@/components/anuncios/adCard";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import NoticiaCard from "@/components/noticias/noticiaCard";
import NoticiaCarouselPrime from "@/components/noticias/noticiaCarroussel";
import NoticiaGrid from "@/components/noticias/noticiaGrid";
import NoticiaLista from "@/components/noticias/noticiaList";
import { prisma } from "@/lib/prisma";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";

export default async function HomePage() {
    const noticiasDb = await prisma.noticia.findMany({
        orderBy: { id: "desc" },
        take: 31,
    });

    const anunciosDb = await prisma.anuncio.findMany({
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
    const usadas = new Set<number>();
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



    const tags = ["Economia", "Saúde", "Tecnologia", "Meio ambiente", "Brasil", "Brasília"];

    const noticiasPorTag = tags.map((tag, i) => {
        const noticia = noticias.find((n) => {
            const contemTag = n.noticia.tags?.some(
                (t) => t.toLowerCase() === tag.toLowerCase()
            );
            const aindaNaoUsada = !usadas.has(n.noticia.id);
            return contemTag && aindaNaoUsada;
        });

        if (noticia) usadas.add(noticia.noticia.id);

        return (
            <div key={i}>
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">
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



    const noticiaDestaqueCardProps = pegarNaoUsadas(noticias, 11);
    const noticiaComumCardProps = pegarNaoUsadas(noticias, 8);
    const noticiaCarrousselCardProps = pegarNaoUsadas(noticias, 6);

    const anuncioCardProps = anuncios;

    return (
    <div className="space-y-12">
        {anuncioCardProps.length > 0 && (
            <AdSliderFull anuncioCardProps={anuncioCardProps} />
        )}

        {noticiaDestaqueCardProps.length > 0 && (
            <section>
                <h1 className="text-3xl font-bold text-blue-800 mb-4">Últimas notícias</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="flex flex-col gap-10">
                        {noticiaDestaqueCardProps[0] && (
                            <NoticiaCard noticiaCardProps={noticiaDestaqueCardProps[0]} />
                        )}
                    </div>
                    <div className="flex flex-col gap-10">
                        {noticiaDestaqueCardProps.slice(1, 3).map((n) => (
                            <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        {noticiaDestaqueCardProps.slice(3, 5).map((n) => (
                            <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        {anuncioCardProps[0] && (
                            <AdCard anuncioCardProps={anuncioCardProps[0]} />
                        )}
                    </div>
                </div>
            </section>
        )}

        {noticiaDestaqueCardProps.length > 0 && (
            <section>
                <NoticiaGrid noticiaCardProps={noticiaDestaqueCardProps.slice(5, 11)} />
            </section>
        )}

        {anuncioCardProps.length > 0 && (
            <AdSliderFull anuncioCardProps={anuncioCardProps} />
        )}

        {noticiaComumCardProps.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {(() => {
                    const tags = ["Economia", "Saúde", "Tecnologia", "Meio ambiente", "Brasil", "Brasília"];
                    return tags.map((tag, i) => {
                        const noticia = noticias.find((n) => {
                            const contemTag = n.noticia.tags?.some(
                                (t) => t.toLowerCase() === tag.toLowerCase()
                            );
                            const aindaNaoUsada = !usadas.has(n.noticia.id);
                            return contemTag && aindaNaoUsada;
                        });

                        if (noticia) usadas.add(noticia.noticia.id);

                        return (
                            <div key={i}>
                                <h2 className="text-2xl font-semibold text-blue-700 mb-4">
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

        <section>
            <NoticiaCarouselPrime noticias={noticiaCarrousselCardProps} numVisible={6} numScroll={1} />
        </section>

        {anuncioCardProps.length > 0 && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {anuncioCardProps.slice(0, 3).map((a) => (
                    <div key={a.anuncio.id}>
                        <AdCard anuncioCardProps={a} />
                    </div>
                ))}
            </section>
        )}
    </div>
);
}
