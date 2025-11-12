"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";
import { motion } from "framer-motion";
import Link from "next/link";
const projetosSubmenu = [
    { label: "Mulheres Belas", href: "/projetos/mulheres-belas" },
    { label: "Visão para Todos", href: "/projetos/visao-para-todos" },
    { label: "Esporte é vida", href: "/projetos/esporte-e-vida" },
    { label: "Laços de Inclusao", href: "/projetos/lacos-de-inclusao" },
    { label: "Meninas Luz", href: "/projetos/meninas-luz" },
    { label: "Ações Comunitárias", href: "/projetos/acoes-comunitarias" },
];
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

    const batchSize = 6;
    const maxAnunciosAuto = 18;
    const loadingAnunciosRef = useRef(false);

    const loadMoreAnuncios = useCallback(async () => {
        if (loadingAnunciosRef.current) return;
        if (!hasMoreAnuncios || anuncios.length >= maxAnunciosAuto) return;

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

    useEffect(() => {
        if (anuncios.length < 12 && hasMoreAnuncios) {
            loadMoreAnuncios();
        }
    }, [anuncios.length, hasMoreAnuncios, loadMoreAnuncios]);

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

            <section className="w-[90%] mx-auto my-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-justify place-self-center">
                <motion.div
                    className="relative w-full h-full flex justify-center items-center group"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-r from-blue-300/30 to-purple-300/30 blur-3xl -z-10"
                        animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.img
                        src="/quemsomos/1.png"
                        alt="História extra esquerda"
                        className="w-40 sm:w-56 h-40 sm:h-56 rounded-full shadow-xl object-cover absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.img
                        src="/quemsomos/2.jpg"
                        alt="História do Instituto Brazil Just"
                        className="w-64 sm:w-80 h-64 sm:h-80 rounded-full shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ rotate: 2 }}
                    />
                    <motion.img
                        src="/quemsomos/3.jpg"
                        alt="História extra direita"
                        className="w-40 sm:w-56 h-40 sm:h-56 rounded-full shadow-xl object-cover absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 opacity-80"
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
            <section className="w-[90%]  my-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-justify place-self-center">
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
                    <motion.div
                        className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-r from-purple-300/30 to-pink-300/30 blur-3xl -z-10"
                        animate={{ x: [0, -25, 25, 0], y: [0, 15, -15, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.img
                        src="/quemsomos/4.jpg"
                        alt="Quem Somos extra esquerda"
                        className="w-40 sm:w-56 h-40 sm:h-56 rounded-full shadow-xl object-cover absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.img
                        src="/quemsomos/5.jpg"
                        alt="Quem Somos"
                        className="w-64 sm:w-80 h-64 sm:h-80 rounded-full shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ rotate: -2 }}
                    />
                    <motion.img
                        src="/quemsomos/6.jpg"
                        alt="Quem Somos extra direita"
                        className="w-40 sm:w-56 h-40 sm:h-56 rounded-full shadow-xl object-cover absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                </motion.div>


            </section>
            <section className="w-[90%]  my-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-justify place-self-center">
                <motion.div
                    className="relative w-full h-full flex justify-center items-center group"
                    initial={{ x: -100, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-r from-green-300/30 to-blue-300/30 blur-3xl -z-10"
                        animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
                        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.img
                        src="/quemsomos/7.jpg"
                        alt="Nossa Missão extra esquerda"
                        className="w-40 sm:w-56 h-40 sm:h-56 rounded-full shadow-xl object-cover absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 opacity-80"
                        whileHover={{ scale: 1.05 }}
                    />
                    <motion.img
                        src="/quemsomos/8.jpg"
                        alt="Nossa Missão"
                        className="w-64 sm:w-80 h-64 sm:h-80 rounded-full shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-110"
                        whileHover={{ rotate: 2 }}
                    />
                    <motion.img
                        src="/quemsomos/9.jpg"
                        alt="Nossa Missão extra direita"
                        className="w-40 sm:w-56 h-40 sm:h-56 rounded-full shadow-xl object-cover absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 opacity-80"
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
        <section className="w-full bg-blue-200 py-12">

         <div className="w-[90%] sm:max-w-[80%] mx-auto flex flex-col lg:flex-row items-center gap-6">
                    <img
                        src="/Novembro-Azul-1.jpg"
                        alt="Novembro Azul"
                        className="w-full lg:w-1/3 h-auto rounded-md shadow-md"
                    />
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                            Novembro Azul
                        </h2>
                        <p className="text-gray-800 text-base lg:text-lg text-justify">
                         Novembro é o mês de conscientização sobre a saúde do homem.
Cuidar de si também é um ato de coragem. A prevenção e o diagnóstico precoce do câncer de próstata salvam vidas.
Fique atento aos exames de rotina e não ignore sinais como dificuldade para urinar, dor ou alterações no corpo.
Converse com profissionais de saúde, tire suas dúvidas e incentive outros homens a fazer o mesmo.
Falar sobre saúde é um gesto de amor e responsabilidade consigo e com quem você ama.
Juntos, podemos vencer o preconceito e promover uma vida mais longa e saudável.
                        </p>

                    </div>
                </div>
            </section>
            <section className="relative drop-shadow-2xl overflow-hidden py-24 mx-auto">

                <motion.h2
                    className="text-4xl font-bold text-blue-950 mb-4 place-self-center text-center"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Conheça nossos projetos
                </motion.h2>

                <div className="relative w-[90%] sm:max-w-[80%] mx-auto p-8">
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="hidden lg:block relative h-100 overflow-hidden rounded-md shadow-lg p-4 bg-slate-900 backdrop-blur-md border border-slate-300 mt-8 lg:mt-0">
                            <div className="animate-scroll-up flex flex-col gap-4">
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
                        <div className="lg:col-span-1 flex flex-col items-center justify-center gap-6 text-center">
                            <div className="grid grid-cols-1 gap-4 w-full items-center place-self-center">
                                {projetosSubmenu.map((projeto, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={projeto.href}
                                        className="w-full py-3 text-center bg-blue-950 backdrop-blur-md border border-slate-900 rounded-xl shadow-md text-white font-semibold hover:bg-slate-900 transition"
                                        initial={{ y: 20, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    >
                                        {projeto.label}
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                        <div className="hidden lg:block relative h-100 overflow-hidden rounded-md shadow-lg p-4 bg-slate-900 backdrop-blur-md border border-slate-300 mt-8 lg:mt-0">
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

                        <div className="lg:hidden relative h-100 overflow-hidden rounded-md shadow-lg p-4 bg-slate-900 backdrop-blur-md border border-slate-300">
                            <div className="animate-scroll-up flex flex-col gap-4">
                                {[...imagesUp, ...imagesDown, ...imagesUp, ...imagesDown].map((src, idx) => (
                                    <img
                                        key={`mobile-${idx}`}
                                        src={src}
                                        alt={`img-mobile-${idx}`}
                                        className="w-full h-40 object-cover rounded-md shadow-md"
                                    />
                                ))}
                            </div>
                        </div>

                    </section>
                </div>

            </section>

            <section className="place-self-center bg-white  w-[80%] md:max-w-[80%]">
                <div className=" flex flex-col items-center text-center">
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
                        Pessoas e organizações que caminham conosco para transformar vidas e
                        construir um futuro mais justo.
                    </motion.p>

                    <motion.div
                        className="w-full max-w-6xl p-6 bg-white rounded-3xl shadow-xl border border-slate-200 relative"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        viewport={{ once: true }}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
                        }}
                    >
                        <motion.div
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            {anuncios.slice(0, 14).map((item) => (
                                <a
                                    key={item.anuncio.id}
                                    href={item.anuncio.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center p-2 border border-slate-200 rounded-xl bg-white shadow-sm hover:scale-105 hover:shadow-lg transition cursor-pointer"
                                >
                                    <img
                                        src={item.anuncio.imagem}
                                        alt={item.anuncio.titulo}
                                        className="w-full h-20 sm:h-24 lg:h-40 object-contain"
                                    />
                                </a>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>



        </div>
    );

}

