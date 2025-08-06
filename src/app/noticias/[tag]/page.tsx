// app/noticias/[tag]/page.tsx
import AdCard from "@/components/anuncios/adCard";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import NoticiaCard from "@/components/noticias/noticiaCard";
import { prisma } from "@/lib/prisma";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";

interface PageProps {
    params: Promise<{ tag: string }>;
}

function formatTagTitle(tag: string) {
    return tag
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export default async function NoticiasPorTagPage({ params }: PageProps) {
    const tag = (await params).tag;
    const formattedTag = formatTagTitle(tag);

    const noticiasDb = await prisma.noticia.findMany({
        where: {
            tags: {
                has: tag,
            },
        },
        orderBy: { data: "desc" },
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
        <div className="max-w-7xl mx-auto  py-12 mb-[80] justify-self-center items-center gap-4">
            {anuncios.length > 0 && <AdSliderFull anuncioCardProps={anuncios} />}

            <section>
                <h1 className="text-3xl font-bold text-blue-800 mb-4">{formattedTag}</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div className="flex flex-col gap-10">
                        {noticias[0] && <NoticiaCard noticiaCardProps={noticias[0]} />}
                    </div>
                    <div className="flex flex-col gap-10">
                        {noticias.slice(0, 2).map((n) => (
                            <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        {noticias.slice(2, 4).map((n) => (
                            <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        {noticias[0] && <AdCard anuncioCardProps={anuncios[0]} />}
                    </div>
                </div>
            </section>

            {noticias.length > 5 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {noticias.slice(4, noticias.length - 1).map((n) => (
                        <div key={n.noticia.id} className="flex flex-col gap-10">
                            <NoticiaCard key={n.noticia.id} noticiaCardProps={n} />
                        </div>
                    ))}
                </section>
            )}

            {anuncios.length > 0 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {anuncios.slice(0, 3).map((a) => (
                        <div key={a.anuncio.id}>
                            <AdCard anuncioCardProps={a} />
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}
