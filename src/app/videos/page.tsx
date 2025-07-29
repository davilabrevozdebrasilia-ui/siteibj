"use client";

import { useEffect, useState } from "react";

interface Anuncio {
    id: number;
    titulo: string;
    url: string;
    link: string;
    site: string;
}

export default function PaginaVideos() {
    const [videos, setVideos] = useState<Anuncio[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            const res = await fetch(`/api/videos?page=${page}&limit=6`);
            const json = await res.json();

            const novosVideos = json.data ?? [];

            setVideos((prev) => [...prev, ...novosVideos]);
            if (novosVideos.length < 6) setHasMore(false);
            setLoading(false);
        };

        fetchVideos();
    }, [page]);


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-900">Vídeos</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((vid) => (
                    <div
                        key={vid.id}
                        className="rounded shadow bg-slate-100 p-2 flex flex-col items-center"
                    >
                        <div className="w-full h-40 overflow-hidden rounded">
                            <video
                                controls
                                className="w-full h-full object-full"
                                preload="metadata"
                            >
                                <source src={vid.url} type="video/mp4" />
                                Seu navegador não suporta vídeo.
                            </video>
                        </div>

                        { <a
                            href={vid.link}
                            className="mt-2 text-blue-600 text-sm font-medium text-center hover:underline"
                            target="_blank"
                        >
                            {vid.titulo}
                        </a> }
                    </div>
                ))}
            </div>


            {hasMore && !loading && (
                <button
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setPage((prev) => prev + 1)}
                >
                    Carregar mais
                </button>
            )}

            {loading && <p className="mt-4 text-gray-500">Carregando...</p>}
        </div>
    );
}
