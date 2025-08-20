"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Maximize, X } from "lucide-react";

type Documento = {
    titulo: string;
    pasta: string;
    totalPaginas: number;
};

export default function Transparencia() {
    const documentos: Documento[] = [
        { titulo: "Atestado de capacidade técnica", pasta: "/AtestadoDeCapacidadeTecnica", totalPaginas: 5 },
        { titulo: "Termo de fomento 2023-04", pasta: "/SEI_MDHC", totalPaginas: 24 },
        { titulo: "Termo de fomento 2023-08", pasta: "/TermoDeFomento", totalPaginas: 18 },
    ];

    const [fullscreenAtivo, setFullscreenAtivo] = useState(false);
    const [docAtual, setDocAtual] = useState<Documento | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [paginaInput, setPaginaInput] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    const flipBookRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setPaginaInput(paginaAtual + 1);
    }, [paginaAtual]);

    useEffect(() => {
        if (!isMobile) return;

        const handleScroll = () => {
            if (!scrollRef.current || !docAtual) return;
            const scrollTop = scrollRef.current.scrollTop;
            const pageHeight = scrollRef.current.scrollHeight / docAtual.totalPaginas;
            const newPage = Math.floor(scrollTop / pageHeight);
            setPaginaAtual(newPage);
        };

        const el = scrollRef.current;
        el?.addEventListener("scroll", handleScroll);
        return () => el?.removeEventListener("scroll", handleScroll);
    }, [isMobile, docAtual]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1600);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
        if (docAtual && index >= 0 && index < docAtual.totalPaginas) {
            flipBookRef.current.pageFlip().flip(index);
        }
    };

    const renderFlipBook = () => {
        if (!docAtual) return null;

        const imagens = Array.from({ length: docAtual.totalPaginas }, (_, i) => ({
            id: i,
            titulo: `Página ${i + 1}`,
            url: `${docAtual.pasta}/Page${i + 1}.png`,
        }));

        if (isMobile) {
            return (
                <div
                    ref={scrollRef}
                    className="flex flex-col gap-4 w-full max-h-[80vh] overflow-y-auto px-2"
                >
                    {imagens.map((img) => (
                        <div key={img.id} className="bg-slate-200 flex flex-col items-center rounded p-2">
                            <img
                                src={img.url}
                                alt={img.titulo}
                                className="object-contain max-w-full"
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
                className="mx-auto"
                startPage={paginaAtual}
                drawShadow={false}
                usePortrait={false}
                autoSize={true}
                style={undefined}
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
                disableFlipByClick={false}
            >
                {imagens.map((img) => (
                    <div
                        key={img.id}
                        className="flex items-center justify-center bg-slate-200 w-full h-full rounded relative"
                    >
                        <img
                            src={img.url}
                            alt={img.titulo}
                            className="object-contain cursor-pointer max-w-full max-h-full"
                        />
                        <p className="text-center text-white absolute bottom-0 bg-black/30 w-full p-2">
                            {img.titulo}
                        </p>
                        
                    </div>
                ))}
            </HTMLFlipBook>
        );
    };

    return (
        <main className="min-h-screen max-w-7xl mx-auto py-12 mb-[80px] px-4 text-blue-900">
            <h1 className="text-3xl font-bold mb-6">Transparência</h1>

            <div className="space-y-12">
                {documentos.map((doc, idx) => (
                    <section key={idx}>
                        <h2 className="text-xl font-semibold mb-2">{doc.titulo}</h2>
                        <div className="flex justify-between border rounded-md overflow-hidden bg-slate-100 p-4">
                            <p className="text-gray-600">Visualize todas as páginas deste documento.</p>
                            <button
                                onClick={() => {
                                    setDocAtual(doc);
                                    setFullscreenAtivo(true);
                                    setPaginaAtual(0);
                                }}
                                className=" bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2"
                            >
                                Tela cheia
                                <Maximize size={18} />
                            </button>
                        </div>
                    </section>
                ))}
            </div>

    <span className="absolute bottom-2 left-2 text-2xl">👉</span>
    <span className="absolute bottom-2 right-2 text-2xl">👈</span>
            {fullscreenAtivo && docAtual && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center p-4">
                    {/* Botão fechar */}
                    <button
                        onClick={() => setFullscreenAtivo(false)}
                        className="absolute top-4 right-4 z-50 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center"
                    >
                        Fechar
                        <X className="ms-2" size={20} />
                    </button>

                    <div className="flex-1 flex items-center justify-center w-full ">
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
                            <div className="text-white font-semibold mt-2">
                                Página {paginaAtual + 1} de {docAtual.totalPaginas}
                            </div>
                            <button
                                onClick={() => virarPagina("proxima")}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                Próxima Página
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => irPara(docAtual.totalPaginas - 1)}
                                className="bg-blue-900 hover:bg-blue-600 rounded text-white px-3 py-1 font-bold flex items-center gap-1 cursor-pointer"
                            >
                                Página {docAtual.totalPaginas}
                                <ChevronsRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Paginador */}
                    {!isMobile && (
                        <div className="flex gap-2 text-slate-100 mt-2">
                            Ir para a página:
                            <input
                                type="number"
                                min={1}
                                max={docAtual.totalPaginas}
                                value={paginaInput}
                                onChange={(e) => setPaginaInput(Number(e.target.value))}
                                onBlur={() => irPara(paginaInput - 1)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        irPara(paginaInput - 1);
                                    }
                                }}
                                className="w-20 px-2 rounded bg-slate-600 border-slate-200 border-2"
                            />
                        </div>
                    )}


                </div>
            )}
        </main>
    );
}
