"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AdCard from "@/components/anuncios/adCard";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import LazyCardWrapper from "@/components/lazyCardWrapper";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";
import { NoticiaCardTextRight } from "@/components/noticias/noticiaCardTextRight";
import { NoticiaCardOverlay } from "@/components/noticias/NoticiaCardOverlay";
import NoticiaCarouselPrime from "@/components/noticias/noticiaCarroussel";
import NoticiaCard from "@/components/noticias/noticiaCard";

type NoticiaWithKey = NoticiaCardProps & { _key: string };

export default function HomePage() {
    const [anuncios, setAnuncios] = useState<AnuncioCardProps[]>([]);
    const [ultimasNoticias, setUltimasNoticias] = useState<NoticiaWithKey[]>([]);
    const [noticiasPorTag, setNoticiasPorTag] = useState<
        { tag: string; noticia: NoticiaCardProps["noticia"] }[]
    >([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const batchSize = 3; // <-- aqui: tamanho do pacote menor
    const noticiaKeyCounter = useRef(0);
    const maxNoticias = 21; // máximo de notícias na página

    useEffect(() => {
        const tags = ["Economia", "Saúde", "Tecnologia", "Meio ambiente", "Brasil", "Brasília"];

        async function fetchNoticiasPorTag() {
            try {
                const resTag = await fetch(`/api/noticias/por-tag?tags=${encodeURIComponent(tags.join(","))}`);
                if (resTag.ok) {
                    const noticiasPorTagRaw = await resTag.json();
                    setNoticiasPorTag(noticiasPorTagRaw);
                }
            } catch (err) {
                console.error("Erro ao carregar por tag:", err);
            }
        }

        async function fetchAnuncios() {
            try {
                const res = await fetch("/api/homePageAds");
                const data = await res.json();
                setAnuncios(data);
            } catch (err) {
                console.error("Erro ao carregar anúncios:", err);
            }
        }

        fetchNoticiasPorTag();
        fetchAnuncios();
    }, []);

    const loadMoreNoticias = useCallback(async () => {
        if (!hasMore || ultimasNoticias.length >= maxNoticias) {
            setHasMore(false);
            return;
        }

        try {
            const res = await fetch(`/api/noticias/ultimas?offset=${offset}&limit=${batchSize}`);
            if (!res.ok) throw new Error("Erro ao buscar notícias");
            const data: NoticiaCardProps[] = await res.json();

            if (data.length === 0) {
                setHasMore(false);
                return;
            }

            let i = 0;
            const interval = setInterval(() => {
                const noticia = data[i];
                if (noticia?.noticia?.id) {
                    setUltimasNoticias((prev) => {
                        const alreadyExists = prev.some(
                            (n) => n.noticia.id === noticia.noticia.id
                        );
                        if (alreadyExists || prev.length >= maxNoticias) return prev;

                        const keyedNoticia: NoticiaWithKey = {
                            ...noticia,
                            _key: `noticia-${noticiaKeyCounter.current++}`,
                        };

                        return [...prev, keyedNoticia];
                    });
                }
                i++;
                if (i >= data.length || ultimasNoticias.length + i >= maxNoticias) {
                    clearInterval(interval);
                    setOffset((prev) => prev + batchSize);
                }
            }, 150);
        } catch (err) {
            console.error("Erro no carregamento incremental:", err);
            setHasMore(false);
        }
    }, [offset, hasMore, ultimasNoticias.length]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreNoticias();
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loadMoreNoticias]);

    return (
        <div className="space-y-12">
            {anuncios.length > 0 && <AdSliderFull anuncioCardProps={anuncios} />}

            <section>
                <NoticiaCarouselPrime
                    noticias={noticiasPorTag
                        .filter(({ noticia }) => noticia?.id)
                        .map(({ noticia }) => ({ noticia }))}
                    numVisible={6}
                    numScroll={1}
                />
            </section>

            <section>
                <h1 className="text-3xl font-bold text-blue-800 mb-4">Últimas notícias</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {ultimasNoticias.map((n, i) => {
                        if (!n?.noticia) return null;
                        if (i < 6)
                            return (
                                <LazyCardWrapper key={n._key}>
                                    <NoticiaCardTextRight noticiaCardProps={n} />
                                </LazyCardWrapper>
                            );
                        if (i < 12)
                            return (
                                <LazyCardWrapper key={n._key}>
                                    <NoticiaCardOverlay noticiaCardProps={n} />
                                </LazyCardWrapper>
                            );
                        return (
                            <LazyCardWrapper key={n._key}>
                                <NoticiaCard noticiaCardProps={n} />
                            </LazyCardWrapper>
                        );
                    })}
                </div>
                {hasMore && (
                    <div ref={loaderRef} className="text-center py-10 text-blue-600 font-medium">
                        Carregando mais notícias...
                    </div>
                )}
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8">
                {anuncios.slice(0, 3).map((a) => (
                    <LazyCardWrapper key={a.anuncio.id}>
                        <AdCard anuncioCardProps={a} />
                    </LazyCardWrapper>
                ))}
            </section>
        </div>
    );
}
