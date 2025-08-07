"use client";

import { Carousel } from "primereact/carousel";
import { ProjetoCardProps } from "@/types/projetos";

export default function ProjetoCarouselPrime({projetos}: { projetos: ProjetoCardProps[] }) {
    const projetoTemplate = (item: ProjetoCardProps) => {
        return (
            <a href={item.projeto.href} className="flex flex-col items-center h-full text-center transition-transform duration-300 ease-in-out
                hover:scale-105 hover:-translate-y-2 p-10 gap-2">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow-md ">
                    <img
                        src={item.projeto.imagem}
                        alt={item.projeto.titulo}
                        className="w-full h-full object-cover "
                    />
                </div>
                <h3 className=" text-sm font-semibold text-slate-900 line-clamp-2 w-32 justify-self-center">
                    {item.projeto.titulo}
                </h3>
            </a>
        );
    };

    return (
        <div className="w-full h-50 bg-slate-50  rounded-lg shadow-md border-2 border-slate-300 items-center justify-center">
            <Carousel
                value={projetos}
                itemTemplate={projetoTemplate}
                numVisible={5}
                numScroll={1}
                circular
                showIndicators={false}
                showNavigators
            />
        </div>
    );
}
