"use client";

import React, { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";

interface ClientProps {
    slug: string;
}

interface Noticia {
    id: number;
    titulo: string;
    resumo: string;
    imagem: string;
    data: string;
    tags: string[];
    href: string;
}

interface Anuncio {
    id: number;
    titulo: string;
    imagem: string;
    href: string;
}

export default function NoticiaPageClient({ slug }: ClientProps) {
    const [noticia, setNoticia] = useState<Noticia | null>(null);
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const idString = slug.substring(slug.lastIndexOf("-") + 1);
    const id = Number(idString);

    useEffect(() => {
        if (isNaN(id)) {
            setError("Notícia inválida");
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                const noticiaRes = await fetch(`/api/noticias?id=${id}`);
                if (!noticiaRes.ok) throw new Error("Notícia não encontrada");
                const noticiaData = await noticiaRes.json();


                setNoticia({
                    ...noticiaData,
                    resumo: sanitizeHtml(noticiaData.resumo, {
                        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                            "img",
                            "span",
                            "p",
                            "br",
                            "a",
                        ]),
                        allowedAttributes: {
                            ...sanitizeHtml.defaults.allowedAttributes,
                            img: ["src", "alt", "width", "height"],
                            span: ["style"],
                            p: ["style", "align"],
                            a: ["href", "target", "rel", "style"],
                        },
                        allowedStyles: {
                            "*": {
                                color: [/^#[0-9A-Fa-f]{3,6}$/, /^rgb\(/, /^rgba\(/],
                                "font-size": [/^\d+(px|em|rem|%)$/],
                                "text-align": [/^(left|center|right|justify)$/],
                            },
                        },
                        nonTextTags: [],
                    }).replace(/<p><\/p>/g, "<p>&nbsp;</p>"),
                });

            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!noticia) return <div>Notícia não encontrada.</div>;

    return (
        <div className="max-w-[1600px] mx-auto py-12 mb-[80px] items-center space-y-8 px-4">
            <section>
                <img
                    src={noticia.imagem}
                    alt={noticia.titulo}
                    className="w-full h-120 object-contain bg-slate-100 rounded-lg mb-6"
                />

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">
                        {noticia.titulo}
                    </h1>

                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-gray-500">
                            Publicado em {new Date(noticia.data).toLocaleDateString("pt-BR")}
                        </p>


                        {noticia.tags && noticia.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2">
                                {noticia.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="noticia-conteudo text-gray-700 mb-4 mx-4 sm:mx-6 md:mx-12 lg:mx-24 xl:mx-32"
                        dangerouslySetInnerHTML={{ __html: noticia.resumo }}
                    />
                </div>

            </section>

            <style jsx>{`
                .noticia-conteudo p {
                    margin-bottom: 1rem;
                }
                .noticia-conteudo a {
                    color: #2563eb;
                    text-decoration: underline;
                }
                .noticia-conteudo span {
                    display: inline;
                }
                .noticia-conteudo p[style*="text-align:center"] {
                    text-align: center;
                }
                .noticia-conteudo p[style*="text-align:right"] {
                    text-align: right;
                }
                .noticia-conteudo p[style*="text-align:left"] {
                    text-align: left;
                }
            `}</style>
        </div>
    );
}
