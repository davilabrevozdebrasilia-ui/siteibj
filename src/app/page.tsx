"use client";

import { useEffect, useRef, useState } from "react";
import AdCard from "@/components/anuncios/adCard";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import NoticiaCard from "@/components/noticias/noticiaCard";
import NoticiaGrid from "@/components/noticias/noticiaGrid";
import NoticiaLista from "@/components/noticias/noticiaList";
import NoticiaCarouselPrime from "@/components/noticias/noticiaCarroussel";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";

export default function HomePage() {
    const [noticias, setNoticias] = useState<NoticiaCardProps[]>([]);
    const [anuncios, setAnuncios] = useState<AnuncioCardProps[]>([]);
    const usadasRef = useRef<Set<number>>(new Set());

    useEffect(() => {
        fetch("/api/homePageNews")
            .then((res) => res.json())
            .then((data) => setNoticias(data));
        fetch("/api/homePageAds")
            .then((res) => res.json())
            .then((data) => setAnuncios(data));
    }, []);


    const pegarNaoUsadas = (lista: NoticiaCardProps[], quantidade: number) => {
        const resultado: NoticiaCardProps[] = [];
        const usadas = usadasRef.current;

        for (const n of lista) {
            if (!usadas.has(n.noticia.id)) {
                resultado.push(n);
                usadas.add(n.noticia.id);
            }
            if (resultado.length >= quantidade) break;
        }

        return resultado;
    };



    if (noticias.length === 0 || anuncios.length === 0) {
        return <p className="text-center p-10">Carregando...</p>;
    }

    const noticiaDestaqueCardProps = pegarNaoUsadas(noticias, 11);
    const noticiaComumCardProps = pegarNaoUsadas(noticias, 8);
    const noticiaCarrousselCardProps = pegarNaoUsadas(noticias, 6);

    const tags = ["Economia", "Saúde", "Tecnologia", "Meio ambiente", "Brasil", "Brasília"];

    const noticiasPorTag = tags.map((tag, i) => {
        const noticia = noticias.find((n) => {
            const contemTag = n.noticia.tags?.some(
                (t) => t.toLowerCase() === tag.toLowerCase()
            );
            const aindaNaoUsada = !usadasRef.current.has(n.noticia.id);
            return contemTag && aindaNaoUsada;
        });

        if (noticia) usadasRef.current.add(noticia.noticia.id);

        return (
            <div key={i}>
                <h2 className="text-2xl font-semibold text-blue-700 mb-4">{tag}</h2>
                {noticia ? (
                    <NoticiaLista noticiaCardProps={[noticia]} />
                ) : (
                    <p className="text-gray-500">Nenhuma notícia disponível</p>
                )}
            </div>
        );
    });

    return (
        <div className="space-y-12">
            <section className="w-full flex justify-center py-2 bg-yellow-100 border-b rounded-md border-yellow-300">
                <div className="flex items-center gap-2 text-sm text-yellow-800 font-medium select-none">
                    <span role="img" aria-label="martelo">🔨</span>
                    <span>Site em construção</span>
                </div>
            </section>
            {anuncios.length > 0 && <AdSliderFull anuncioCardProps={anuncios} />}


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
                        {anuncios[0] && <AdCard anuncioCardProps={anuncios[0]} />}
                    </div>
                </div>
            </section>

            <section>
                <NoticiaGrid noticiaCardProps={noticiaDestaqueCardProps.slice(5, 11)} />
            </section>

            {noticiaComumCardProps.length > 0 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {noticiasPorTag}
                </section>
            )}

            <section>
                <NoticiaCarouselPrime noticias={noticiaCarrousselCardProps} numVisible={6} numScroll={1} />
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {anuncios.slice(0, 3).map((a) => (
                    <div key={a.anuncio.id}>
                        <AdCard anuncioCardProps={a} />
                    </div>
                ))}
            </section>
        </div>
    );
}
