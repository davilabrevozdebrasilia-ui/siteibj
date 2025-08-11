"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { Maximize, X } from "lucide-react";
import { pdfjs } from "react-pdf";

// Worker do pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type Documento = {
    titulo: string;
    arquivo: string;
};

export default function Transparencia() {
    const documentos: Documento[] = [
        { titulo: "Atestado de capacidade técnica", arquivo: "/docs/AtestadoDeCapacidadeTecnica.pdf" },
        { titulo: "Termo de fomento 2023-04", arquivo: "/docs/SEI_MDHC.pdf" },
        { titulo: "Termo de fomento 2023-08", arquivo: "/docs/TermoDeFomento.pdf" },
    ];

    const [fullscreenAtivo, setFullscreenAtivo] = useState(false);
    const [docAtual, setDocAtual] = useState<Documento | null>(null);
    const [paginas, setPaginas] = useState<string[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);

    const flipBookRef = useRef<any>(null);

    // Carrega PDF e converte páginas em imagens
    const carregarPDF = useCallback(async (url: string) => {
        const loadingTask = pdfjs.getDocument(url);
        const pdf = await loadingTask.promise;

        const renderedPages: string[] = [];
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 }); // resolução boa
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d")!;
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;
            renderedPages.push(canvas.toDataURL("image/png"));
        }

        setPaginas(renderedPages);
        setTotalPaginas(renderedPages.length);
        setPaginaAtual(0);
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
        if (index >= 0 && index < totalPaginas) {
            flipBookRef.current.pageFlip().flip(index);
        }
    };

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
            {paginas.map((src, idx) => (
                <div key={idx} className="flex items-center justify-center bg-slate-200 w-full h-full rounded">
                    <img src={src} alt={`Página ${idx + 1}`} className="w-full h-full object-contain" />
                </div>
            ))}
        </HTMLFlipBook>
    );

    return (
        <main className="min-h-screen max-w-7xl mx-auto py-12 mb-[80] px-4 text-blue-900">
            <h1 className="text-3xl font-bold mb-6">Transparência</h1>

            <div className="space-y-12">
                {documentos.map((doc, idx) => (
                    <section key={idx}>
                        <h2 className="text-xl font-semibold mb-2">{doc.titulo}</h2>
                        <div className="relative border rounded-md overflow-hidden">
                           
                            <button
                                onClick={() => {
                                    setDocAtual(doc);
                                    setFullscreenAtivo(true);
                                    carregarPDF(doc.arquivo);
                                }}
                                className="absolute bottom-2 right-2 bg-slate-200 hover:bg-slate-400 text-blue-900 font-bold px-4 py-2 rounded shadow cursor-pointer flex items-center gap-2"
                            >
                                Tela cheia
                                <Maximize size={18} />
                            </button>
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
                            Página {paginaAtual + 1} de {totalPaginas}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                            <button
                                onClick={() => irPara(0)}
                                className="bg-slate-200 text-blue-900 font-bold px-2 py-1 rounded hover:bg-slate-400"
                            >
                                « Página 1
                            </button>
                            <button
                                onClick={() => virarPagina("anterior")}
                                className="bg-slate-200 text-blue-900 font-bold px-2 py-1 rounded hover:bg-slate-400"
                            >
                                ‹ Página Anterior
                            </button>
                            <button
                                onClick={() => virarPagina("proxima")}
                                className="bg-slate-200 text-blue-900 font-bold px-2 py-1 rounded hover:bg-slate-400"
                            >
                                Próxima Página ›
                            </button>
                            <button
                                onClick={() => irPara(totalPaginas - 1)}
                                className="bg-slate-200 text-blue-900 font-bold px-2 py-1 rounded hover:bg-slate-400"
                            >
                                Página {totalPaginas} »
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
