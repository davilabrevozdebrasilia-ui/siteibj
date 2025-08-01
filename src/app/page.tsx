"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdCard from "@/components/anuncios/adCard";
import AdSliderFull from "@/components/anuncios/adSliderFull";
import LazyCardWrapper from "@/components/lazyCardWrapper";
import { AnuncioCardProps } from "@/types/anuncios";
import { NoticiaCardProps } from "@/types/noticias";
import { NoticiaCardTextRight } from "@/components/noticias/noticiaCardTextRight";
import { NoticiaCardOverlay } from "@/components/noticias/NoticiaCardOverlay";
import NoticiaCarouselPrime from "@/components/noticias/noticiaCarroussel";
import NoticiaCard from "@/components/noticias/noticiaCard";


export default function HomePage() {
  const [anuncios, setAnuncios] = useState<AnuncioCardProps[]>([]);
  const [ultimasNoticias, setUltimasNoticias] = useState<NoticiaCardProps[]>([]);
  const [noticiasPorTag, setNoticiasPorTag] = useState<
    { tag: string; noticia: NoticiaCardProps["noticia"] }[]
  >([]);

  useEffect(() => {
    const tags = ["Economia", "Saúde", "Tecnologia", "Meio ambiente", "Brasil", "Brasília"];

    async function fetchNoticias() {
      try {
        const resTag = await fetch(`/api/noticias/por-tag?tags=${encodeURIComponent(tags.join(","))}`);
        if (!resTag.ok) throw new Error("Erro ao buscar por tags");
        const noticiasPorTagRaw = await resTag.json();
        setNoticiasPorTag(noticiasPorTagRaw);

        const resUltimas = await fetch(`/api/noticias/ultimas`);
        if (!resUltimas.ok) throw new Error("Erro ao buscar últimas notícias");
        const ultimasNoticiasRaw = await resUltimas.json();
        setUltimasNoticias(ultimasNoticiasRaw);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      }
    }

    async function fetchAnuncios() {
      try {
        const res = await fetch("/api/homePageAds");
        if (!res.ok) throw new Error("Erro ao buscar anúncios");
        const data = await res.json();
        setAnuncios(data);
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
      }
    }

    fetchNoticias();
    fetchAnuncios();
  }, []);

  return (
    <div className="space-y-12">
      {anuncios.length > 0 && <AdSliderFull anuncioCardProps={anuncios} />}

      <section>
        <NoticiaCarouselPrime
          noticias={noticiasPorTag
            .filter(({ noticia }) => noticia?.id)
            .map(({ noticia }) => ({ noticia }))}
          numVisible={6}
          numScroll={1}
        />
      </section>

      <section>
        <h1 className="text-3xl font-bold text-blue-800 mb-4">Últimas notícias</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ultimasNoticias.slice(0, 6).map((n) => (
            <LazyCardWrapper key={n.noticia.id}>
              <NoticiaCardTextRight noticiaCardProps={n} />
            </LazyCardWrapper>
          ))}
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ultimasNoticias.slice(6, 12).map((n) => (
            <LazyCardWrapper key={n.noticia.id}>
              <NoticiaCardOverlay noticiaCardProps={n} />
            </LazyCardWrapper>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {ultimasNoticias.slice(12, 20).map((n) => (
          <LazyCardWrapper key={n.noticia.id}>
            <NoticiaCard noticiaCardProps={n} />
          </LazyCardWrapper>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {anuncios.slice(0, 3).map((a) => (
          <LazyCardWrapper key={a.anuncio.id}>
            <AdCard anuncioCardProps={a} />
          </LazyCardWrapper>
        ))}
      </section>
    </div>
  );
}
