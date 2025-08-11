"use client";

import { Carousel } from "primereact/carousel";
import { ProjetoCardProps } from "@/types/projetos";
import { useState, useEffect } from "react";

export default function ProjetoCarouselPrime({ projetos }: { projetos: ProjetoCardProps[] }) {
  const projetoTemplate = (item: ProjetoCardProps) => {
    return (
      <a
        href={item.projeto.href}
        className="flex flex-col items-center h-full text-center transition-transform duration-300 ease-in-out
                hover:scale-105 hover:-translate-y-2 p-10 gap-2"
      >
        <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-300 shadow-md">
          <img
            src={item.projeto.imagem}
            alt={item.projeto.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 w-32 justify-self-center">
          {item.projeto.titulo}
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
    <div className="w-full h-60 bg-slate-50 rounded-lg shadow-md border-2 border-slate-300 items-center justify-center">
      <p className="text-center text-blue-900 font-bold text-2xl py-2">Projetos</p>
      <Carousel
        key={windowWidth} 
        value={projetos}
        itemTemplate={projetoTemplate}
        numVisible={6}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        circular
        showIndicators={false}
        showNavigators
      />
    </div>
  );
}
