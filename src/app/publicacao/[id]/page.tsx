export const dynamic = "force-dynamic";

import AdSliderFull from "@/components/anuncios/adSliderFull";
import AdCard from "@/components/anuncios/adCard";
import { prisma } from "@/lib/prisma";
import DOMPurify from "isomorphic-dompurify";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NoticiaPage({ params }: PageProps) {
    const id = Number((await params).id);

    const noticiaDb = await prisma.noticia.findUnique({
        where: { id },
    });

    if (!noticiaDb) {
        return <div className="p-6 text-center">Notícia não encontrada.</div>;
    }

    const anunciosDb = await prisma.anuncio.findMany({
        take: 8,
    });

    const noticia = {
        id: noticiaDb.id,
        titulo: noticiaDb.titulo,
        resumo: noticiaDb.resumo,
        imagem: noticiaDb.imagem,
        data: new Date(noticiaDb.data).toLocaleDateString("pt-BR"),
        tags: noticiaDb.tags,
        href: noticiaDb.href,
    };

    const anuncios = anunciosDb.map((a) => ({
        anuncio: {
            id: a.id,
            titulo: a.titulo,
            imagem: a.imagem,
            href: a.href,
        },
    }));

    return (
        <div className="max-w-7xl mx-auto py-12 mb-[80] justify-self-center items-center space-y-8">
            {anuncios.length > 0 && (
                <AdSliderFull anuncioCardProps={anuncios} />
            )}

            <section>
                <img
                    src={noticia.imagem}
                    alt={noticia.titulo}
                    className="w-full h-120 object-contain bg-slate-100 rounded-lg mb-6"
                />

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">
                        {noticia.titulo}
                    </h1>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">
                            Publicado em {noticia.data}
                        </p>

                        {noticia.tags && noticia.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                {noticia.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div
                        className="text-gray-700 mb-4 text-justify"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(noticia.resumo),
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    <div className="flex flex-col gap-10">
                        {anuncios.length > 1 && (
                            <AdCard anuncioCardProps={anuncios[1]} />
                        )}
                    </div>
                    <div className="flex flex-col gap-10">
                        {anuncios.length > 2 && (
                            <AdCard anuncioCardProps={anuncios[2]} />
                        )}
                    </div>
                    <div className="flex flex-col gap-10">
                        {anuncios.length > 3 && (
                            <AdCard anuncioCardProps={anuncios[3]} />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
