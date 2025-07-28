"use client";

import { AnuncioCardProps } from "@/types/anuncios";
import { useEffect, useState } from "react";

export default function AdBarCarousel({ anuncioCardProps }: { anuncioCardProps: AnuncioCardProps[] }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % anuncioCardProps.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [anuncioCardProps.length]);

    const anuncioAtual = anuncioCardProps[index];

    return (
        <div className="rounded-lg w-full h-[80px] bg-slate-100 border border-slate-300 shadow-md overflow-hidden">
            <a
                href={anuncioAtual.anuncio.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full block flex items-center justify-center"
            >
                <img
                    src={anuncioAtual.anuncio.imagem}
                    alt={anuncioAtual.anuncio.titulo || "Anúncio"}
                    className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                />
            </a>
        </div>
    );
}
