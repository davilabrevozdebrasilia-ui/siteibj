"use client";

import { Carousel } from "primereact/carousel";
import { CarrousselCardProps } from "@/types/projetos";
import { useState, useEffect } from "react";

export default function CarrouselPrime({ item }: { item: CarrousselCardProps[] }) {
    const itemTemplate = (item: CarrousselCardProps) => {
        return (
            <a
                href={item.item.href}
                className="flex flex-col items-center h-full text-center transition-transform duration-300 ease-in-out
                hover:scale-105 hover:-translate-y-2 p-10 gap-2 "
                target="_blank"
            >
                <div className="w-24 h-24 rounded-full overflow-hidden border border-slate-300 shadow-md">
                    <img
                        src={item.item.imagem}
                        alt={item.item.titulo}
                        className={`w-full h-full ${item.style}`}
                    />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 w-32 justify-self-center">
                    {item.item.titulo}
                </h3>
            </a>
        );
    };

    const responsiveOptions = [
        {
            breakpoint: "1600px",
            numVisible: 6,
            numScroll: 1,
        },
        {
            breakpoint: "1200px",
            numVisible: 4,
            numScroll: 1,
        },
        {
            breakpoint: "992px",
            numVisible: 3,
            numScroll: 1,
        },
        {
            breakpoint: "768px",
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: "576px",
            numVisible: 1,
            numScroll: 1,
        },
    ];

    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

    useEffect(() => {
        const onResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div>
            <p className="text-center text-blue-900 font-bold text-2xl py-2 px-2 h-fit rounded-t-lg drop-shadow-2xl shadow-slate-900  border-t-2 border-x-2 border-slate-300 bg-slate-100 w-fit place-self-center">{item[0]?.titulo || "Carregando..."}</p>
            <div className="w-full h-50 bg-slate-50 rounded-lg shadow-md border-2 border-slate-300">
                <Carousel
                    key={windowWidth}
                    value={item}
                    itemTemplate={itemTemplate}
                    numVisible={6}
                    numScroll={3}
                    responsiveOptions={responsiveOptions}
                    circular
                    showIndicators={false}
                    showNavigators
                />
            </div>
        </div>
    );
}
