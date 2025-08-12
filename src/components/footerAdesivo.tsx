"use client"
import { useState, useEffect } from "react";
import { AnuncioCardProps } from "@/types/anuncios";
import AdBarCarousel from "./anuncios/adSliderFull";

const AdFooter = ({ anuncioCardProps }: { anuncioCardProps: AnuncioCardProps[] }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !anuncioCardProps?.length) return null;

    return (
        <div className="bg-transparent text-white text-center fixed bottom-0 place-self-end px-10 py-2">
            <AdBarCarousel anuncioCardProps={anuncioCardProps} />
        </div>
    );
};

export default AdFooter;
