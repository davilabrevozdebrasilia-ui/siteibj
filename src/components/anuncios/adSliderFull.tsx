"use client";

import { AnuncioCardProps } from "@/types/anuncios";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function AdBarCarousel({ anuncioCardProps }: { anuncioCardProps: AnuncioCardProps[] }) {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true); // Marca que já está no cliente
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % anuncioCardProps.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [anuncioCardProps.length, mounted]);

    if (!mounted || !visible) return null;

    const anuncioAtual = anuncioCardProps[index];

    return (
        <div className="relative rounded-lg w-80 h-80 place-self-end bg-slate-100 border border-slate-300 shadow-md overflow-hidden">
            <button
                onClick={() => setVisible(false)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white shadow"
            >
                <X className="w-4 h-4 text-gray-600" />
            </button>

            <a
                href={anuncioAtual.anuncio.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
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
