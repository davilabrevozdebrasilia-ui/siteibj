"use client";

import React, { useState, useRef, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { Maximize, X } from "lucide-react";

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

    const flipBookRef = useRef<any>(null);

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

        return (
            <HTMLFlipBook
                width={1200}
                height={800}
                size="fixed"
                maxShadowOpacity={0.5}
                showCover={false}
                mobileScrollSupport={true}
                useMouseEvents={true}
                ref={flipBookRef}
                onFlip={onFlip}
                flippingTime={700}
                className="mx-auto"
                startPage={paginaAtual} style={undefined} minWidth={0} maxWidth={0} minHeight={0} maxHeight={0} drawShadow={false} usePortrait={false} startZIndex={0} autoSize={false} clickEventForward={false} swipeDistance={0} showPageCorners={false} disableFlipByClick={false}            >
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
                        <div className="relative border rounded-md overflow-hidden bg-slate-100 p-4">
                            <button
                                onClick={() => {
                                    setDocAtual(doc);
                                    setFullscreenAtivo(true);
                                    setPaginaAtual(0);
                                }}
                                className="absolute bottom-2 right-2 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2"
                            >
                                Tela cheia
                                <Maximize size={18} />
                            </button>
                            <p className="text-gray-600">Visualize todas as páginas deste documento.</p>
                        </div>
                    </section>
                ))}
            </div>

            {fullscreenAtivo && docAtual && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center">
                    <button
                        onClick={() => setFullscreenAtivo(false)}
                        className="flex absolute top-4 right-4 z-50 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer"
                    >
                        Fechar
                        <X className="ms-2" size={20} />
                    </button>

                    <div className="w-full h-full px-2 sm:px-8 flex flex-col items-center justify-center">
                        {renderFlipBook()}

                        <div className="flex justify-center text-white font-semibold mt-4">
                            Página {paginaAtual + 1} de {docAtual.totalPaginas}
                        </div>

                        <div className="pointer-events-none flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-4">
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
                                onClick={() => irPara(docAtual.totalPaginas - 1)}
                                className="pointer-events-auto bg-blue-900 hover:bg-blue-600 rounded text-white text-md font-bold px-2 py-1 cursor-pointer"
                            >
                                Página {docAtual.totalPaginas} »
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
