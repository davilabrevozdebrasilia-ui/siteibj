"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import AdCard from "@/components/anuncios/adCard";
import LazyCardWrapper from "@/components/lazyCardWrapper";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";
import { NoticiaCardTextRight } from "@/components/noticias/noticiaCardTextRight";
import { NoticiaCardOverlay } from "@/components/noticias/NoticiaCardOverlay";
import NoticiaCard from "@/components/noticias/noticiaCard";
import { CarrousselCardProps } from "@/types/projetos";
import CarrouselPrime from "@/components/projetos/itemsCarroussel";

type NoticiaWithKey = NoticiaCardProps & { _key: string };

export default function HomePage() {
    const [anuncios, setAnuncios] = useState<AnuncioCardProps[]>([]);
    const [offsetAnuncios, setOffsetAnuncios] = useState(0);
    const [hasMoreAnuncios, setHasMoreAnuncios] = useState(true);
    const loaderAnunciosRef = useRef<HTMLDivElement | null>(null);
    const batchSize = 6;
    const [ultimasNoticias, setUltimasNoticias] = useState<NoticiaWithKey[]>([]);
    const [noticiasPorTag, setNoticiasPorTag] = useState<
        { tag: string; noticia: NoticiaCardProps["noticia"] }[]
    >([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null);
    const noticiaKeyCounter = useRef(0);
    const maxNoticias = 21;
    const maxAnunciosAuto = 18;
    const loadingAnunciosRef = useRef(false);
    const projetos: CarrousselCardProps[] = [
        {
            item: {
                titulo: "Meninas Luz",
                href: "/projetos/meninas-luz",
                imagem: "/projetos/meninas_luz.jpg",
            },
            titulo: "Projetos",
            style: "object-cover"
        },
        {
            item: {
                titulo: "Mulheres Belas",
                href: "/projetos/mulheres-belas",
                imagem: "/projetos/mulheres_belas.jpg",
            },
            titulo: "Projetos",
            style: "object-cover"
        },
        {
            item: {
                titulo: "Laços de Inclusão",
                href: "/projetos/lacos-de-inclusao",
                imagem: "/projetos/lacos_de_inclusao.jpg",
            },
            titulo: "Projetos",
            style: "object-cover"
        },
        {
            item: {
                titulo: "Esporte é Vida",
                href: "/projetos/esporte-e-vida",
                imagem: "/projetos/esporte_e_vida.jpg",
            },
            titulo: "Projetos",
            style: "object-cover"
        },
        {
            item: {
                titulo: "Visão para Todos",
                href: "/projetos/visao-para-todos",
                imagem: "/projetos/visao_para_todos.png",
            },
            titulo: "Projetos",
            style: "object-cover"
        },

        {
            item: {
                titulo: "Ações Comunitárias",
                href: "/projetos/acoes-comunitarias",
                imagem: "/projetos/acoes_comunitarias.jpg",
            },
            titulo: "Projetos",
            style: "object-cover"
        },
    ];

    useEffect(() => {
        const tags = [
            "mulheres-belas",
            "visao-para-todos",
            "lacos-de-inclusao",
            "esporte-e-vida",
            "meninas-luz",
            "acoes-comunitarias"
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
        if (loadingAnunciosRef.current) return;
        if (!hasMoreAnuncios || anuncios.length >= maxAnunciosAuto) {
            if (hasMoreAnuncios && anuncios.length >= maxAnunciosAuto) {
            }
            return;
        }

        loadingAnunciosRef.current = true;
        try {
            const res = await fetch(
                `/api/homePageAds?offset=${offsetAnuncios}&limit=${batchSize}`
            );
            if (!res.ok) throw new Error("Erro ao carregar anúncios");

            const data: AnuncioCardProps[] = await res.json();

            if (!data || data.length === 0) {
                setHasMoreAnuncios(false);
                return;
            }

            setAnuncios((prev) => [...prev, ...data]);
            setOffsetAnuncios((prev) => prev + batchSize);
        } catch (err) {
            console.error("Erro ao carregar anúncios incremental:", err);
            setHasMoreAnuncios(false);
        } finally {
            loadingAnunciosRef.current = false;
        }
    }, [hasMoreAnuncios, anuncios.length, offsetAnuncios]);

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

            setUltimasNoticias((prev) => {
                const newNoticias = data.filter(noticia =>
                    !prev.some((n) => n.noticia.id === noticia.noticia.id)
                ).slice(0, maxNoticias - prev.length);

                const keyedNoticias = newNoticias.map(noticia => ({
                    ...noticia,
                    _key: `noticia-${noticiaKeyCounter.current++}`
                }));

                return [...prev, ...keyedNoticias];
            });

            setOffset((prev) => prev + batchSize);
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


    // Flags de concorrência para impedir múltiplas requisições simultâneas
    const loadingNoticiasRef = useRef(false);
    useEffect(() => {
        if (
            hasMoreAnuncios &&
            anuncios.length < maxAnunciosAuto &&
            !loadingAnunciosRef.current
        ) {
            loadMoreAnuncios();
        }
    }, [hasMoreAnuncios, anuncios.length, loadMoreAnuncios]);

    useEffect(() => {
        loadMoreAnuncios();
    }, []);

    return (
        <div className="w-[90%] px-4 py-12 mb-[80] justify-self-center items-center gap-4 space-y-12">

            <div className="flex items-center w-full flex-col">
                <a href="/doacoes">
                    <button className="text-3xl font-bold text-blue-900  items-center cursor-pointer  rounded-md p-2  ">
                        Deseja contribuir para um mundo melhor? Clique aqui e faça sua doação
                    </button>
                </a>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <aside className="lg:col-span-1">
                    <img
                        src="/banner7.png"
                        alt="Banner de destaque"
                        className="w-full h-full min-h-80 object-cover lg:object-fill rounded-md shadow-md"
                    />
                </aside>

                <div className="lg:col-span-3 h-full ">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4 ">Últimas notícias</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
                        {ultimasNoticias.slice(0, 6).map((n) => {
                            if (!n?.noticia) return null;
                            return (
                                <LazyCardWrapper key={n._key}>
                                    <NoticiaCardTextRight noticiaCardProps={n} />
                                </LazyCardWrapper>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {ultimasNoticias.slice(6).map((n) => {
                    if (!n?.noticia) return null;

                    if (n._key && ultimasNoticias.indexOf(n) < 12) {
                        return (
                            <LazyCardWrapper key={n._key}>
                                <NoticiaCardOverlay noticiaCardProps={n} />
                            </LazyCardWrapper>
                        );
                    }

                    return (
                        <LazyCardWrapper key={n._key}>
                            <NoticiaCard noticiaCardProps={n} />
                        </LazyCardWrapper>
                    );
                })}

                {hasMore && (
                    <div ref={loaderRef} className="text-center py-10 text-blue-600 font-medium"></div>
                )}
            </section>

            <section >
                <section className="mb-6">
                    <CarrouselPrime item={projetos} />
                </section >
                <CarrouselPrime
                    item={anuncios.map((a) => ({
                        item: {
                            titulo: a.anuncio?.titulo ?? "Colaborador",
                            href: a.anuncio?.href ?? "#",
                            imagem: a.anuncio?.imagem ?? "/placeholder.jpg",
                        },
                        titulo: "Colaboradores",
                        style: "object-contain"
                    }))}
                />
            </section>
        </div>
    );
}

