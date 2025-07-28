"use client";

import { Carousel } from "primereact/carousel";
import { NoticiaCardProps } from "@/types/noticias";

interface NoticiaCarouselProps {
    noticias: NoticiaCardProps[];
    numVisible?: number;
    numScroll?: number;
}

export default function NoticiaCarouselPrime({
    noticias,
    numVisible = 3,
    numScroll = 1,
}: NoticiaCarouselProps) {
    const noticiaTemplate = (item: NoticiaCardProps) => {
        return (
            <a href={item.noticia.href} className="flex flex-col  h-full text-center transition-transform duration-300 ease-in-out
    hover:scale-105 hover:-translate-y-2 p-10 gap-2">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-300 shadow-md ">
                    <img
                        src={item.noticia.imagem}
                        alt={item.noticia.titulo}
                        className="w-full h-full object-cover "
                    />
                </div>
                <h3 className=" text-sm font-semibold text-slate-900 line-clamp-2 w-32">
                    {item.noticia.titulo}
                </h3>
            </a>
        );
    };

    return (
        <div className="w-full h-58 bg-slate-50  rounded-lg shadow-md border-2 border-slate-300 items-center justify-center">
            <Carousel
                value={noticias}
                itemTemplate={noticiaTemplate}
                numVisible={numVisible}
                numScroll={numScroll}
                circular
                showIndicators={false}
                showNavigators
            />
        </div>
    );
}
