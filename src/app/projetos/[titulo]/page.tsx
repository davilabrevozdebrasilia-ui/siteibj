"use client";

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import HTMLFlipBook from "react-pageflip";
import { Maximize, X } from "lucide-react";

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
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [fullscreenAtivo, setFullscreenAtivo] = useState(false);

    const [descricao, setDescricao] = useState("Descrição do projeto");
    const [tituloCorrigido, setTituloCorrigido] = useState("Título corrigido");
    const [bannerUrl, setBannerUrl] = useState("/logo.jpg");
    useEffect(() => {
        fetch(`/api/projetos/${titulo}?count=true`)
            .then((res) => res.json())
            .then((data) => setTotalPaginas(data.total));
    }, [titulo]);

    useEffect(() => {
        const carregarTodas = async () => {
            const res = await fetch(`/api/projetos/${titulo}?page=0&limit=${totalPaginas}`);
            const data: Imagem[] = await res.json();
            setImagens(data);
        };
        if (totalPaginas > 0) {
            carregarTodas();
        }
    }, [totalPaginas, titulo]);

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
        "tea-lacos-de-inclusao": {
            descricao: "Respeito à Neurodiversidade, Amor à Inclusão",
            tituloCorrigido: "TEA Laços de Inclusão",
            bannerUrl: "/projetos/tea_lacos_de_inclusao.jpg",
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
        const projeto = tituloMap[titulo  as string];
        if (!projeto) return;

        setDescricao((prev) => (prev !== projeto.descricao ? projeto.descricao : prev));
        setTituloCorrigido((prev) => (prev !== projeto.tituloCorrigido ? projeto.tituloCorrigido : prev));
        setBannerUrl((prev) => (prev !== projeto.bannerUrl ? projeto.bannerUrl : prev));
    }, [titulo]);

    const renderFlipBook = () => (
        <HTMLFlipBook
            width={1920}
            height={1080}
            size="stretch"
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport={true}
            useMouseEvents={true}
            ref={flipBookRef}
            onFlip={onFlip}
            flippingTime={700}
            autoSize={true}
            className="w-full h-full align-middle justify-center justify-self-center items-center" style={undefined} startPage={paginaAtual} minWidth={0} maxWidth={0} minHeight={0} maxHeight={0} drawShadow={false} usePortrait={false} startZIndex={0} clickEventForward={false} swipeDistance={0} showPageCorners={true} disableFlipByClick={false}    >
            {imagens.map((img) => (
                <div
                    key={img.id}
                    className="flex items-center justify-center bg-slate-200 w-full h-full rounded"
                >

                    <img
                        src={img.url}
                        alt={img.titulo}
                        className="w-full h-full object-contain cursor-pointer"
                    />
                    <p
                        className="text-center text-white absolute bottom-0 bg-black/30 w-full p-2"
                    >
                        {img.titulo}
                    </p>
                </div>
            ))}
        </HTMLFlipBook>
    );

    return (
        <div className="flex flex-col gap-4 mb-[80] px-4 ">
            <div className="text-center">
                <img
                    src={bannerUrl}
                    alt="Capa do projeto"
                    className=" shadow h-100  object-contain w-full"
                />
                <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mt-4 sm:mt-6">
                    {tituloCorrigido}
                </h1>
                <p className="text-base sm:text-lg text-gray-600 mt-2">
                    {descricao}
                </p>
            </div>

            {!fullscreenAtivo && (
                <div className="flex flex-col items-center justify-center place-self-center w-[95%] h-[80vh] relative bg-white/15 rounded-lg shadow-lg drop-shadow-slate-900  mt-12 py-2">

                    <p className=" sm:text-lg text-3xl font-bold text-blue-900 mt-2">
                        Galeria
                    </p>
                    <button
                        onClick={() => setFullscreenAtivo(true)}
                        className="absolute top-2 right-2 z-10 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2"
                    >
                        Tela cheia
                        <Maximize className="justify-center self-center  " size={20} />
                    </button>

                    {renderFlipBook()}

                    <span className="text-slate-900 font-semibold my-2 select-none">
                        Página {paginaAtual + 1} de {totalPaginas}
                    </span>

                    <div className="pointer-events-none flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-2">
                        <button
                            onClick={() => irPara(0)}
                            className="pointer-events-auto bg-blue-900 hover:bg-blue-600 rounded text-white text-md font-bold px-2 py-1 cursor-pointer"
                        >
                            « Página 1
                        </button>
                        <button
                            onClick={() => virarPagina("anterior")}
                            className="pointer-events-auto bg-blue-900 hover:bg-blue-600 rounded text-white text-md font-bold px-2 py-1 cursor-pointer"
                        >
                            ‹ Página Anterior
                        </button>
                        <button
                            onClick={() => virarPagina("proxima")}
                            className="pointer-events-auto bg-blue-900 hover:bg-blue-600 rounded text-white text-md font-bold px-2 py-1 cursor-pointer"
                        >
                            Próxima Página ›
                        </button>
                        <button
                            onClick={() => irPara(totalPaginas - 1)}
                            className="pointer-events-auto bg-blue-900 hover:bg-blue-600 rounded text-white text-md font-bold px-2 py-1 cursor-pointer"
                        >
                            Página {totalPaginas} »
                        </button>
                    </div>
                </div>
            )}

            {fullscreenAtivo && (
                <div className="fixed inset-0 z-50 bg-black/95 bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center">
                    <button
                        onClick={() => setFullscreenAtivo(false)}
                        className="flex absolute top-4 right-4 z-50 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer"
                    >
                        Fechar
                        <X className="justify-center self-center ms-2 " size={20} />
                    </button>

                    <div className="w-full h-full px-2 sm:px-8 flex flex-col items-center">
                        {renderFlipBook()}

                        <div className="flex justify-center text-white font-semibold absolute bottom-3/12 sm:bottom-2/12">
                            Página {paginaAtual + 1} de {totalPaginas}
                        </div>

                        <div className="  justify-center items-center gap-2 absolute bottom-1/12 sm:bottom-16 grid grid-cols-2 sm:grid-cols-4">
                            <button
                                onClick={() => irPara(0)}
                                className="bg-slate-200 text-blue-900 font-bold text-md px-2 py-1 rounded cursor-pointer hover:bg-slate-400"
                            >
                                « Página 1
                            </button>
                            <button
                                onClick={() => virarPagina("anterior")}
                                className="bg-slate-200 text-blue-900 font-bold text-md px-2 py-1 rounded cursor-pointer hover:bg-slate-400"
                            >
                                ‹ Página Anterior
                            </button>
                            <button
                                onClick={() => virarPagina("proxima")}
                                className="bg-slate-200 text-blue-900 font-bold text-md px-2 py-1 rounded cursor-pointer hover:bg-slate-400"
                            >
                                Próxima Página ›
                            </button>
                            <button
                                onClick={() => irPara(totalPaginas - 1)}
                                className="bg-slate-200 text-blue-900 font-bold text-md px-2 py-1 rounded cursor-pointer hover:bg-slate-400"
                            >
                                Página {totalPaginas} »
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
