"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AdCard from "@/components/anuncios/adCard";
import LazyCardWrapper from "@/components/lazyCardWrapper";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";
import { NoticiaCardTextRight } from "@/components/noticias/noticiaCardTextRight";
import { NoticiaCardOverlay } from "@/components/noticias/NoticiaCardOverlay";
import NoticiaCard from "@/components/noticias/noticiaCard";
import { ProjetoCardProps } from "@/types/projetos";
import ProjetoCarouselPrime from "@/components/projetos/projetosCarroussel";

type NoticiaWithKey = NoticiaCardProps & { _key: string };

export default function HomePage() {
    const [anuncios, setAnuncios] = useState<AnuncioCardProps[]>([]);
    const [offsetAnuncios, setOffsetAnuncios] = useState(0);
    const [hasMoreAnuncios, setHasMoreAnuncios] = useState(true);
    const loaderAnunciosRef = useRef<HTMLDivElement | null>(null);
    const batchSize = 1;
    const [ultimasNoticias, setUltimasNoticias] = useState<NoticiaWithKey[]>([]);
    const [noticiasPorTag, setNoticiasPorTag] = useState<
        { tag: string; noticia: NoticiaCardProps["noticia"] }[]
    >([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const noticiaKeyCounter = useRef(0);
    const maxNoticias = 21;

    const projetos: ProjetoCardProps[] = [
        {
            projeto: {
                titulo: "Meninas Luz",
                descricao: "Protagonistas da Própria Vida",
                href: "/projetos/meninas-luz",
                imagem: "/projetos/meninas_luz.jpg",
            },
        },
        {
            projeto: {
                titulo: "Mulheres Belas",
                descricao: "Mulheres Fortes, Futuros Brilhantes",
                href: "/projetos/mulheres-belas",
                imagem: "/projetos/mulheres_belas.jpg",
            },
        },
        {
            projeto: {
                titulo: "TEA Laços de Inclusão",
                descricao: "Respeito à Neurodiversidade, Amor à Inclusão",
                href: "/projetos/tea-lacos-de-inclusao",
                imagem: "/projetos/tea_lacos_de_inclusao.jpg",
            },
        },
        {
            projeto: {
                titulo: "Esporte é Vida",
                descricao: "Transformando vidas através do esporte",
                href: "/projetos/esporte-e-vida",
                imagem: "/projetos/esporte_e_vida.jpg",
            },
        },
        {
            projeto: {
                titulo: "Visão para Todos",
                descricao: "Devolvendo Olhares, Renovando Esperanças",
                href: "/projetos/visao-para-todos",
                imagem: "/projetos/visao_para_todos.png",
            },
        },
    ];

    useEffect(() => {
        const tags = [
            "mulheres-belas",
            "visao-para-todos",
            "tea-lacos-de-inclusao",
            "lacos-de-inclusao",
            "meninas-luz",
        ];

        async function fetchNoticiasPorTag() {
            try {
                const resTag = await fetch(
                    `/api/projetos/por-tag?tags=${encodeURIComponent(tags.join(","))}`
                );
                if (resTag.ok) {
                    const noticiasPorTagRaw = await resTag.json();
                    setNoticiasPorTag(noticiasPorTagRaw);
                }
            } catch (err) {
                console.error("Erro ao carregar por tag:", err);
            }
        }

        fetchNoticiasPorTag();
    }, []);

    const loadMoreAnuncios = useCallback(async () => {
        if (!hasMoreAnuncios) return;

        try {
            const res = await fetch(
                `/api/homePageAds?offset=${offsetAnuncios}&limit=${batchSize}`
            );
            if (!res.ok) throw new Error("Erro ao carregar anúncios");
            const data: AnuncioCardProps[] = await res.json();

            if (data.length === 0) {
                setHasMoreAnuncios(false);
                return;
            }

            setAnuncios((prev) => [...prev, ...data]);
            setOffsetAnuncios((prev) => prev + batchSize);
        } catch (err) {
            console.error("Erro ao carregar anúncios incremental:", err);
            setHasMoreAnuncios(false);
        }
    }, [offsetAnuncios, hasMoreAnuncios]);

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
                        const alreadyExists = prev.some((n) => n.noticia.id === noticia.noticia.id);
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

    useEffect(() => {
        if (!loaderAnunciosRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreAnuncios();
                }
            },
            { threshold: 1 }
        );

        observer.observe(loaderAnunciosRef.current);
        return () => observer.disconnect();
    }, [loadMoreAnuncios]);

    useEffect(() => {
        loadMoreAnuncios();
    }, []);

    return (
        <div className="w-[90%] px-4 py-12 mb-[80] justify-self-center items-center gap-4 space-y-12">
            {/* {anuncios.length > 0 && <AdSliderFull anuncioCardProps={anuncios} />} */}
            <div className="flex items-center w-full flex-col">
                <a href="/doacoes">
                    <button className="text-3xl font-bold text-blue-900  items-center cursor-pointer bg-slate-50 rounded-md p-2 drop-shadow-slate-950 shadow-md">
                        Deseja contribuir com o Instituto Brazil Just? Clique aqui e faça sua doação
                    </button>
                </a>
            </div>
            <section>
                <ProjetoCarouselPrime projetos={projetos} />
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


            {(hasMoreAnuncios && hasMoreAnuncios) && (
                <div
                    ref={loaderAnunciosRef}
                    className="text-center py-4 text-blue-600 font-medium cursor-pointer"
                >
                </div>
            )}
        </div>
    );
}

