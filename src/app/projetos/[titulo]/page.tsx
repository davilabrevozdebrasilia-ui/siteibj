"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import HTMLFlipBook from "react-pageflip";
import { Maximize, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";


type Imagem = {
    id: number;
    titulo: string;
    descricao?: string;
    url: string;
};

export default function ProjetoPage() {
    const { titulo } = useParams();
    const [imagens, setImagens] = useState<Imagem[]>([]);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const flipBookRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [paginaInput, setPaginaInput] = useState(1);
    const [fullscreenAtivo, setFullscreenAtivo] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [descricao, setDescricao] = useState("Descrição do projeto");
    const [tituloCorrigido, setTituloCorrigido] = useState("Título corrigido");
    const [bannerUrl, setBannerUrl] = useState("/logo.jpg");

    useEffect(() => {
        fetch(`/api/projetos/${titulo}?count=true`)
            .then((res) => res.json())
            .then((data) => setTotalPaginas(data.total));
    }, [titulo]);

    useEffect(() => {
        if (totalPaginas === 0) return;

        const carregarEmBlocos = async () => {
            let pagina = 0;
            const bloco = 1;

            while (pagina < totalPaginas) {
                const res = await fetch(`/api/projetos/${titulo}?page=${pagina}&limit=${bloco}`);
                const data: Imagem[] = await res.json();

                setImagens((prev) => [...prev, ...data]);

                pagina++; // incrementa de acordo com o tamanho do bloco
                await new Promise((resolve) => setTimeout(resolve, 50));
            }


        };

        carregarEmBlocos();
    }, [totalPaginas, titulo]);




    useEffect(() => {
        setPaginaInput(paginaAtual + 1);
    }, [paginaAtual]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1600);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile) return;
        const handleScroll = () => {
            if (!scrollRef.current) return;
            const scrollTop = scrollRef.current.scrollTop;
            const pageHeight = scrollRef.current.scrollHeight / totalPaginas;
            const newPage = Math.floor(scrollTop / pageHeight);
            setPaginaAtual(newPage);
        };
        const el = scrollRef.current;
        el?.addEventListener("scroll", handleScroll);
        return () => el?.removeEventListener("scroll", handleScroll);
    }, [isMobile, totalPaginas]);

    const onFlip = useCallback((e: any) => {
        setPaginaAtual(e.data);
    }, []);

    const virarPagina = (direcao: "proxima" | "anterior") => {
        if (!flipBookRef.current) return;
        if (direcao === "proxima") {
            flipBookRef.current.pageFlip().flipNext();
        } else {
            flipBookRef.current.pageFlip().flipPrev();
        }
    };

    const irPara = (index: number) => {
        if (!flipBookRef.current) return;
        if (index >= 0 && index < totalPaginas) {
            flipBookRef.current.pageFlip().flip(index);
        }
    };

    const tituloMap = {
        "lacos-de-inclusao": {
            descricao: "Respeito à Neurodiversidade, Amor à Inclusão",
            tituloCorrigido: "Laços de Inclusão",
            bannerUrl: "/projetos/lacos_de_inclusao.jpg",
        },
        "mulheres-belas": {
            descricao: "Mulheres Fortes, Futuros Brilhantes",
            tituloCorrigido: "MULHERES BELAS",
            bannerUrl: "/projetos/mulheres_belas.jpg",
        },
        "visao-para-todos": {
            descricao: "Devolvendo Olhares, Renovando Esperanças",
            tituloCorrigido: "VISÃO PARA TODOS",
            bannerUrl: "/projetos/visao_para_todos.png",
        },
        "meninas-luz": {
            descricao: "Protagonistas da Própria Vida",
            tituloCorrigido: "MENINAS LUZ",
            bannerUrl: "/projetos/meninas_luz.jpg",
        },
        "esporte-e-vida": {
            descricao: "Transformando vidas através do esporte",
            tituloCorrigido: "ESPORTE É VIDA",
            bannerUrl: "/projetos/esporte_e_vida.jpg",
        },
    };

    useEffect(() => {
        const projeto = tituloMap[titulo as string];
        if (!projeto) return;

        setDescricao((prev) => (prev !== projeto.descricao ? projeto.descricao : prev));
        setTituloCorrigido((prev) => (prev !== projeto.tituloCorrigido ? projeto.tituloCorrigido : prev));
        setBannerUrl((prev) => (prev !== projeto.bannerUrl ? projeto.bannerUrl : prev));
    }, [titulo]);

    const renderFlipBook = () => {
        if (imagens.length === 0) return null;

        if (isMobile) {
            return (
                <div
                    ref={scrollRef}
                    className="flex flex-col gap-4 w-full min-h-40 overflow-y-auto px-2"
                >
                    {imagens.map((img) => (
                        <div
                            key={img.id}
                            className="bg-slate-200 flex flex-col items-center rounded p-2 relative"
                        >
                            <img
                                src={img.url}
                                alt={img.titulo}
                                loading="lazy"
                                className="object-contain cursor-pointer max-w-full max-h-full"
                            />
                            <p className="text-center text-sm text-white bg-black/30 w-full p-1">
                                {img.titulo}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <HTMLFlipBook
                width={Math.min(900, window.innerWidth * 0.9)}
                height={Math.min(600, window.innerHeight * 0.8)}
                size="stretch"
                showCover={false}
                mobileScrollSupport={true}
                ref={flipBookRef}
                onFlip={onFlip}
                flippingTime={700}
                className="w-full"
                startPage={paginaAtual}
                drawShadow={false}
                usePortrait={false}
                autoSize={true}
                minWidth={0}
                maxWidth={0}
                minHeight={0}
                maxHeight={0}
                startZIndex={0}
                maxShadowOpacity={0}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={0}
                showPageCorners={false}
                disableFlipByClick={false} style={undefined}         >
                {imagens.map((img, index) => (
                    <div
                        key={img.id}
                        className="flex items-center justify-center bg-slate-200 w-full h-full rounded relative"
                    >
                        <img
                            src={img.url}
                            alt={img.titulo}
                            loading="lazy"
                            className="object-contain cursor-pointer max-w-full max-h-full place-self-center"
                        />
                        {!isMobile && (
                            <>
                                {index % 2 === 0 && index < imagens.length - 1 && (
                                    <div className="absolute bottom-4 left-4 text-white text-2xl animate-bounce">
                                        👈
                                    </div>
                                )}

                                {index % 2 === 1 && index > 0 && (
                                    <div className="absolute bottom-4 right-4 text-white text-2xl animate-bounce">
                                        👉
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
            </HTMLFlipBook>
        );
    };

    return (
        <main className="min-h-screen mx-12 py-12 mb-[80px] px-4 text-blue-900 flex flex-col gap-8">
            <div className="text-center">
                <img
                    src={bannerUrl}
                    alt="Capa do projeto"
                    className="shadow h-100 object-contain w-full max-w-4xl mx-auto rounded"
                />
                <h1 className="text-3xl sm:text-4xl font-bold mt-4 sm:mt-6">{tituloCorrigido}</h1>
                <p className="text-base sm:text-lg text-gray-600 mt-2">{descricao}</p>
            </div>

            {!fullscreenAtivo && (
                <section className="flex flex-col items-center w-full max-w-[95%] max-h-[100vh] relative bg-white/15 rounded-lg shadow-lg drop-shadow-slate-900 py-4 px-6 mx-auto">
                    <p className="text-3xl font-bold text-blue-900 mb-4 text-center">
                        Conheça mais sobre o projeto {tituloCorrigido} através da coleção abaixo:
                    </p>

                    <button
                        onClick={() => {
                            setFullscreenAtivo(true);
                            setPaginaAtual(0);
                        }}
                        className="bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2 sm:absolute sm:top-2 sm:right-2 sm:z-10"
                    >
                        Tela cheia
                        <Maximize size={20} />
                    </button>

                    {renderFlipBook()}

                    {!isMobile && (
                        <div className="flex flex-wrap justify-center items-center gap-2 mt-2 w-full mx-auto">
                            <button
                                onClick={() => irPara(0)}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <ChevronsLeft size={18} />
                                Página 1
                            </button>
                            <button
                                onClick={() => virarPagina("anterior")}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <ChevronLeft size={18} />
                                Página Anterior
                            </button>
                            <button
                                onClick={() => virarPagina("proxima")}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                Próxima Página
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => irPara(totalPaginas - 1)}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                Página {totalPaginas}
                                <ChevronsRight size={18} />
                            </button>
                        </div>

                    )}
                    <span className="text-slate-900 font-semibold my-2 select-none">
                        Página {paginaAtual + 1} de {totalPaginas}
                    </span>

                    <div className="flex items-center gap-2 ml-4 text-lg text-slate-900">
                        Ir para a página:
                        <input
                            type="number"
                            min={1}
                            max={totalPaginas}
                            value={paginaInput}
                            onChange={(e) => setPaginaInput(Number(e.target.value))}
                            onBlur={() => irPara(paginaInput - 1)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") irPara(paginaInput - 1);
                            }}
                            className="w-20 px-2 rounded bg-slate-200 text-slate-900 border-slate-900 border-2"
                        />
                    </div>

                    {/* Navegação */}
                    {!isMobile && (
                        <div className="flex flex-wrap justify-center items-center gap-2 mt-2 w-full mx-auto">
                            {/* ...botões */}
                        </div>
                    )}
                </section>

            )}

            {/* Visualização fullscreen */}
            {fullscreenAtivo && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center p-4 overflow-y-auto"
                    style={{ WebkitOverflowScrolling: "touch" }}
                >
                    <button
                        onClick={() => setFullscreenAtivo(false)}
                        className="sticky top-4 right-4 z-50 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2 self-end"
                    >
                        Fechar
                        <X size={20} />
                    </button>

                    {/* Container do flipbook maior e centralizado */}
                    <div className="flex-1 flex items-center justify-center w-full  ">
                        {renderFlipBook()}
                    </div>
                    {!isMobile && (
                        <div className="flex flex-wrap justify-center items-center gap-2 mt-2 w-full mx-auto">
                            <button
                                onClick={() => irPara(0)}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <ChevronsLeft size={18} />
                                Página 1
                            </button>
                            <button
                                onClick={() => virarPagina("anterior")}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <ChevronLeft size={18} />
                                Página Anterior
                            </button>
                            <button
                                onClick={() => virarPagina("proxima")}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                Próxima Página
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => irPara(totalPaginas - 1)}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                Página {totalPaginas}
                                <ChevronsRight size={18} />
                            </button>
                        </div>

                    )}
                    <div className="text-white font-semibold mt-4 select-none">
                        Página {paginaAtual + 1} de {totalPaginas}
                    </div>
                    <div className="flex items-center gap-2 ml-4 text-slate-100 text-lg">
                        Ir para a página:
                        <input
                            type="number"
                            min={1}
                            max={totalPaginas}
                            value={paginaInput}
                            onChange={(e) => setPaginaInput(Number(e.target.value))}
                            onBlur={() => irPara(paginaInput - 1)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") irPara(paginaInput - 1);
                            }}
                            className="w-20 px-2 rounded bg-slate-600 text-white shadow-md border-slate-200 border-2"
                        />
                    </div>

                </div>
            )}

        </main>
    );
}
