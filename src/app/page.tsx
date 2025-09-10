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
import { motion } from "framer-motion";
import Link from "next/link";

const imagesUp = [
    "/strips/strip1.jpg",
    "/strips/strip2.jpg",
    "/strips/strip3.jpg",
    "/strips/strip4.jpg",
];

const imagesDown = [
    "/strips/strip5.jpg",
    "/strips/strip6.jpg",
    "/strips/strip7.jpg",
    "/strips/strip8.jpg",
];
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
        <div className="w-[100%] mb-[80] justify-self-center items-center gap-4 ">
            <section>
                <Link href={"/doacoes"}>
                    <div className="w-full h-full overflow-hidden  shadow-md ">
                        <video
                            src="/3.mp4"
                            autoPlay
                            muted
                            playsInline
                            className="hidden lg:block w-full h-full object-fill"
                        />

                        <video
                            src="/1.mp4"
                            autoPlay
                            muted
                            playsInline
                            className="block lg:hidden w-full h-full object-100"
                        />
                    </div>
                </Link>
            </section>

            {/* Seção Nossa História */}
            <section className="w-[90%] mx-auto my-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-justify">
                {/* Coluna esquerda - imagens */}
                <motion.div
                    className="relative w-full h-full flex justify-center items-center group"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    {/* Background animado */}
                    <motion.div
                        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-300/30 to-purple-300/30 blur-3xl -z-10"
                        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Imagem esquerda */}
                    <motion.img
                        src="/quemsomos/1.png"
                        alt="História extra esquerda"
                        className="w-56 h-56 rounded-full shadow-xl object-cover absolute left-10 top-10 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />

                    {/* Imagem central */}
                    <motion.img
                        src="/quemsomos/2.jpg"
                        alt="História do Instituto Brazil Just"
                        className="w-80 h-80 rounded-full shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ rotate: 2 }}
                    />

                    {/* Imagem direita */}
                    <motion.img
                        src="/quemsomos/3.jpg"
                        alt="História extra direita"
                        className="w-56 h-56 rounded-full shadow-xl object-cover absolute right-10 bottom-10 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                </motion.div>

                {/* Coluna direita - texto */}
                <motion.div
                    className="flex flex-col justify-center gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.2 } },
                    }}
                >
                    <motion.h2
                        className="text-4xl font-bold text-blue-950"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        Nossa História
                    </motion.h2>

                    <motion.p
                        className="text-lg text-slate-700 leading-relaxed"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        O Instituto Brazil Just nasceu com a missão de promover inclusão social e transformar vidas em todo o território nacional.
                        Fundado no Distrito Federal, o IBJ atua como uma organização autônoma, sem fins lucrativos, guiada por valores de justiça e solidariedade.
                        Sua trajetória é marcada por projetos voltados à educação, esporte, cultura, saúde e meio ambiente, sempre oferecendo serviços gratuitos.
                        Entre as iniciativas de destaque estão programas como Esporte é Vida, Mulheres Belas e TEA Laços de Inclusão, que acolhem famílias em situação de vulnerabilidade.
                        O Instituto também apoia causas indígenas, promove a defesa da floresta e abraça o diálogo com diferentes setores da sociedade civil.
                        Em cada ação, o IBJ reafirma seu compromisso com a dignidade humana e a igualdade de oportunidades.
                        Assim, constrói diariamente uma história de impacto social e esperança para o Brasil.</motion.p>
                </motion.div>
            </section>

            {/* Seção Quem Somos */}
            <section className="w-[90%] mx-auto my-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-justify">
                <motion.div
                    className="flex flex-col justify-center gap-6 order-2 lg:order-1"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.2 } },
                    }}
                >
                    <motion.h2
                        className="text-4xl font-bold text-blue-950"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        Quem Somos
                    </motion.h2>

                    <motion.p
                        className="text-lg text-slate-700 leading-relaxed"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        O Instituto Brazil Just é uma organização de caráter social e educativo, comprometida em transformar realidades e gerar impacto positivo nas comunidades brasileiras, o Instituto se consolida como um agente de mudança, presente nas regiões mais diversas do país. Nosso propósito é inspirar esperança, construir caminhos de dignidade e oferecer às pessoas ferramentas para alcançarem uma vida mais justa, equilibrada e plena.</motion.p>
                </motion.div>

                <motion.div
                    className="relative w-full h-full flex justify-center items-center order-1 lg:order-2 group"
                    initial={{ x: 100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    {/* Background animado */}
                    <motion.div
                        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 blur-3xl -z-10"
                        animate={{ x: [0, -25, 25, 0], y: [0, 15, -15, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Imagem esquerda */}
                    <motion.img
                        src="/quemsomos/4.jpg"
                        alt="Quem Somos extra esquerda"
                        className="w-56 h-56 rounded-full shadow-xl object-cover absolute left-10 bottom-10 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />

                    {/* Imagem central */}
                    <motion.img
                        src="/quemsomos/5.jpg"
                        alt="Quem Somos"
                        className="w-80 h-80 rounded-full shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ rotate: -2 }}
                    />

                    {/* Imagem direita */}
                    <motion.img
                        src="/quemsomos/6.jpg"
                        alt="Quem Somos extra direita"
                        className="w-56 h-56 rounded-full shadow-xl object-cover absolute right-10 top-10 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                </motion.div>
            </section>

            {/* Seção Nossa Missão */}
            <section className="w-[90%] mx-auto my-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-justify">
                <motion.div
                    className="relative w-full h-full flex justify-center items-center group"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    {/* Background animado */}
                    <motion.div
                        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-green-300/30 to-blue-300/30 blur-3xl -z-10"
                        animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Imagem esquerda */}
                    <motion.img
                        src="/quemsomos/7.jpg"
                        alt="Nossa Missão extra esquerda"
                        className="w-56 h-56 rounded-full shadow-xl object-cover absolute left-10 top-10 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />

                    {/* Imagem central */}
                    <motion.img
                        src="/quemsomos/8.jpg"
                        alt="Nossa Missão"
                        className="w-80 h-80 rounded-full shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ rotate: 2 }}
                    />

                    {/* Imagem direita */}
                    <motion.img
                        src="/quemsomos/9.jpg"
                        alt="Nossa Missão extra direita"
                        className="w-56 h-56 rounded-full shadow-xl object-cover absolute right-10 bottom-10 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                </motion.div>

                <motion.div
                    className="flex flex-col justify-center gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.2 } },
                    }}
                >
                    <motion.h2
                        className="text-4xl font-bold text-blue-950"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        Nossa Missão
                    </motion.h2>

                    <motion.p
                        className="text-lg text-slate-700 leading-relaxed"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Nossa missão vai além da promoção de ações pontuais: buscamos criar oportunidades que fortaleçam a cidadania, incentivem a educação, promovam a inclusão e ampliem o acesso a direitos fundamentais. Por meio de projetos inovadores, parcerias estratégicas e atuação em diversas áreas, como saúde, esporte, cultura, meio ambiente e desenvolvimento humano. Com uma visão pautada na ética, na solidariedade e na responsabilidade social, o Instituto Brazil Just reafirma seu compromisso com o Brasil e com cada indivíduo que dele faz parte, acreditando que quando a justiça social se une à educação, o futuro se torna possível para todos.</motion.p>
                </motion.div>
            </section>



            <div className="relative bg-gradient-to-r from-blue-900/90 via-blue-950/90 to-indigo-900/90  drop-shadow-2xl overflow-hidden py-24">
                {/* Linhas diagonais e shapes */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-diagonal-lines animate-diagonalScroll"></div>

                    <div className="absolute w-72 h-72 bg-blue-800 rounded-full opacity-20 -top-16 -left-16 blur-3xl animate-pulseSlow"></div>
                    <div className="absolute w-96 h-96 bg-indigo-800 rounded-full opacity-10 -bottom-20 -right-24 blur-3xl animate-pulseSlow"></div>
                </div>

                <div className="relative w-[90%] mx-auto p-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3  lg:gap-24 ">
                            {/* Fita única no mobile, duas no desktop */}
                            <aside className="lg:col-span-1">
                                <img
                                    src="/banner7.png"
                                    alt="Banner de destaque"
                                    className="w-full h-100 min-h-80 object-fill  rounded-md shadow-md"
                                />
                            </aside>
                            <div className="relative h-100 overflow-hidden rounded-md shadow-lg p-4 bg-white/10 backdrop-blur-md border border-white/20">
                                <div className="animate-scroll-up flex flex-col gap-4">
                                    {/* No mobile, renderiza todas as imagens juntas */}
                                    {[...imagesUp, ...imagesDown, ...imagesUp, ...imagesDown].map((src, idx) => (
                                        <img
                                            key={`combined-${idx}`}
                                            src={src}
                                            alt={`img-${idx}`}
                                            className="w-full h-40 object-cover rounded-md shadow-md"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Apenas desktop: fita rolando para baixo */}
                            <div className="hidden lg:block relative h-100 overflow-hidden rounded-md shadow-lg p-4 bg-white/10 backdrop-blur-md border border-white/20 mt-8 lg:mt-0">
                                <div className="animate-scroll-down flex flex-col gap-4">
                                    {[...imagesDown, ...imagesDown].map((src, idx) => (
                                        <img
                                            key={`down-${idx}`}
                                            src={src}
                                            alt={`img-down-${idx}`}
                                            className="w-full h-40 object-cover rounded-md shadow-md"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                </div>




            </div>
            {/* Seção Colaboradores */}
            <section className="relative bg-white py-24 mt-20">
                <div className="w-[90%] mx-auto flex flex-col items-center text-center">
                    <motion.h2
                        className="text-4xl lg:text-5xl font-bold text-blue-950 mb-6"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                        Nossos Colaboradores
                    </motion.h2>

                    <motion.p
                        className="text-lg text-slate-600 max-w-2xl mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        Pessoas e organizações que caminham conosco para transformar vidas e construir um futuro mais justo.
                    </motion.p>

                    <motion.div
                        className="w-full max-w-6xl p-6 bg-white rounded-3xl shadow-xl border border-slate-200 relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px rgba(0,0,0,0.15)" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <img
                                src="/colaboradores.png"
                                alt="Colaboradores do Instituto Brazil Just"
                                className="w-full h-auto rounded-2xl shadow-md object-contain"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

        </div>
    );

}

