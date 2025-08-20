"use client";

import { useEffect, useRef, useState } from "react";

interface Imagem {
  id: number;
  titulo: string;
  // agora só temos id e titulo; a URL será gerada dinamicamente
}

function LazyImage({ id, alt }: { id: number; alt: string }) {
  const [visible, setVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={visible ? `/api/images/${id}` : ""}
      alt={alt}
      className={`max-w-full max-h-full object-contain transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

export default function PaginaImagens() {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [modalImg, setModalImg] = useState<Imagem | null>(null);

  const ITEMS_PER_PAGE = 1;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchImagens = async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`/api/images?page=${pageNum}&limit=${ITEMS_PER_PAGE}`);
    const json = await res.json();
    const novasImagens: Imagem[] = json.data ?? [];

    for (const img of novasImagens) {
      setImagens((prev) => [...prev, img]);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }

    if (novasImagens.length < ITEMS_PER_PAGE) setHasMore(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchImagens(page);
  }, [page]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loading) {
            setPage((prev) => prev + 1);
          }
        });
      },
      { rootMargin: "200px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  const closeModal = () => setModalImg(null);

  const emptySlots = hasMore
    ? 0
    : ITEMS_PER_PAGE - (imagens.length % ITEMS_PER_PAGE || ITEMS_PER_PAGE);

  return (
    <div className="w-[95%] mx-auto px-4 py-12 mb-[80] justify-self-center items-center gap-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Imagens</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {imagens.map((img) => (
          <div
            key={`img-${img.id}`}
            className="rounded shadow bg-slate-100 p-2 flex flex-col items-center cursor-pointer"
            onClick={() => setModalImg(img)}
            title={img.titulo}
          >
            <div className="w-full h-40 overflow-hidden rounded bg-gray-200 flex items-center justify-center">
              <LazyImage id={img.id} alt={img.titulo} />
            </div>
            <p className="mt-2 text-blue-600 text-sm font-medium text-center">{img.titulo}</p>
          </div>
        ))}

        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="rounded shadow bg-slate-100 p-2 flex items-center justify-center h-40"
          />
        ))}
      </div>

      {/* Elemento sentinela */}
      <div ref={loaderRef} className="h-10 flex justify-center items-center mt-4">
        {loading && <p className="text-gray-500">Carregando...</p>}
      </div>

      {modalImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded p-4 max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold"
              onClick={closeModal}
              aria-label="Fechar modal"
            >
              &times;
            </button>
            <img
              src={`/api/images/${modalImg.id}`}
              alt={modalImg.titulo}
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
            <p className="mt-2 text-center font-semibold">{modalImg.titulo}</p>
          </div>
        </div>
      )}
    </div>
  );
}
