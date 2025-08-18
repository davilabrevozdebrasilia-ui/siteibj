"use client";

import { useEffect, useRef, useState } from "react";

interface Video {
    id: number;
    titulo: string;
    url: string;
    descricao?: string | null;
}

function LazyVideo({ src, titulo }: { src: string; titulo: string }) {
    const [visible, setVisible] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);

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

        if (videoRef.current) observer.observe(videoRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <video
            ref={videoRef}
            src={visible ? src : undefined}
            controls
            preload="metadata"
            className={`max-w-full max-h-full object-contain rounded transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"
                }`}
            aria-label={titulo}
        />
    );
}

export default function PaginaVideos() {
    const ITEMS_PER_PAGE = 1;
    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [modalVideo, setModalVideo] = useState<Video | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const fetchSingleVideo = async (index: number) => {
        try {
            const res = await fetch(`/api/videos?page=${index}&limit=1`);
            const json = await res.json();
            return json.data[0] || null;
        } catch {
            return null;
        }
    };

    const fetchBatch = async (startingIndex: number) => {
        setLoading(true);
        for (let i = 0; i < ITEMS_PER_PAGE; i++) {
            const video = await fetchSingleVideo(startingIndex + i);
            if (video) {
                setVideos((prev) => [...prev, video]);
                await new Promise((resolve) => requestAnimationFrame(resolve));
            } else {
                setHasMore(false);
                break;
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBatch(1);
    }, []);

    useEffect(() => {
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !loading) {
                        const nextIndex = page * ITEMS_PER_PAGE + 1;
                        setPage((prev) => prev + 1);
                        fetchBatch(nextIndex);
                    }
                });
            },
            { rootMargin: "200px" }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, loading, page]);

    const emptySlots = hasMore
        ? 0
        : ITEMS_PER_PAGE - (videos.length % ITEMS_PER_PAGE || ITEMS_PER_PAGE);

    const closeModal = () => setModalVideo(null);

    return (
        <div className="w-[95%] mx-auto py-12 mb-[80] justify-self-center items-center gap-4 px-4">
            <h1 className="text-2xl font-bold mb-4 text-blue-900">Vídeos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {videos.map((video) => (
                    <div
                        key={`video-${video.id}`}
                        className="rounded shadow bg-slate-100 p-2 flex flex-col items-center cursor-pointer"
                        onClick={() => setModalVideo(video)}
                        title={video.titulo}
                    >
                        <div className="w-full h-40 overflow-hidden rounded bg-gray-200 flex items-center justify-center">
                            <LazyVideo src={video.url} titulo={video.titulo} />
                        </div>
                        <p className="mt-2 text-blue-600 text-sm font-medium text-center">{video.titulo}</p>
                    </div>
                ))}

                {Array.from({ length: emptySlots }).map((_, i) => (
                    <div
                        key={`empty-${i}`}
                        className="rounded shadow bg-slate-100 p-2 flex items-center justify-center h-40"
                    />
                ))}
            </div>

            <div ref={loaderRef} className="h-10 flex justify-center items-center mt-4">
                {loading && <p className="text-gray-500">Carregando...</p>}
            </div>

            {modalVideo && (
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
                        <video
                            src={modalVideo.url}
                            controls
                            autoPlay
                            className="max-w-full max-h-[80vh] object-contain rounded"
                        />
                        <p className="mt-2 text-center font-semibold">{modalVideo.titulo}</p>
                        {modalVideo.descricao && (
                            <p className="mt-1 text-center text-gray-600">{modalVideo.descricao}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
