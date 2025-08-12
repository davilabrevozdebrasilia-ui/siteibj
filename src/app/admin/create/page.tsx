"use client";

import AnuncioFormComponent from "@/components/admin/AnuncioForm";
import ImagemFormComponent from "@/components/admin/ImagemForm";
import NoticiaFormComponent from "@/components/admin/NoticiaForm";
import VideoFormComponent from "@/components/admin/VideoForm";
import { useState } from "react";

type NoticiaForm = {
    titulo: string;
    resumo: string;
    imagem: string;
    tags: string;
};

type AnuncioForm = {
    titulo: string;
    imagem: string;
    href: string;
};

type ImagemForm = {
    titulo: string;
    descricao: string;
    url: string;
    projetos: string;
};

type VideoForm = {
    titulo: string;
    descricao: string;
    url: string;
    projetos: string;
};

export default function AdminCreate() {
    const [aba, setAba] = useState<"noticia" | "anuncio" | "imagem" | "video">("noticia");

    const [noticiaForm, setNoticiaForm] = useState<NoticiaForm>({
        titulo: "",
        resumo: "",
        imagem: "",
        tags: "",
    });

    const [anuncioForm, setAnuncioForm] = useState<AnuncioForm>({
        titulo: "",
        imagem: "",
        href: "",
    });

    const [imagemForm, setImagemForm] = useState<ImagemForm & { urls: string[] }>({
        titulo: "",
        descricao: "",
        url: "",
        projetos: "",
        urls: [],
    });

    const [videoForm, setVideoForm] = useState<VideoForm>({
        titulo: "",
        descricao: "",
        url: "",
        projetos: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, tipo: string) {
        const files = e.target.files;
        if (!files) return;

        const readers: Promise<string>[] = [];

        for (let i = 0; i < files.length; i++) {
            readers.push(
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(files[i]);
                })
            );
        }

        Promise.all(readers).then((base64Images) => {
            if (tipo === "imagem") {
                setImagemForm((f) => ({
                    ...f,
                    urls: [...f.urls, ...base64Images], // acumula todas
                }));
            }
        });
    }

    async function handleSubmitImagem() {
        const projetos = imagemForm.projetos.split(",").map((t) => t.trim());

        for (const img of imagemForm.urls) {
            await submit(
                { ...imagemForm, url: img, projetos },
                "/api/images",
                () =>
                    setImagemForm({
                        titulo: "",
                        descricao: "",
                        url: "",
                        projetos: "",
                        urls: [],
                    })
            );
        }
    }

    async function submit(formData: any, endpoint: string, clearFn: () => void) {
        setError("");
        setSuccess("");

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess("Cadastro realizado com sucesso!");
                clearFn();
            } else {
                const data = await res.json();
                setError(data.error || "Erro ao cadastrar.");
            }
        } catch {
            setError("Erro ao cadastrar.");
        }
    }

    async function handleSubmitNoticia() {
        const tags = noticiaForm.tags.split(",").map((t) => t.trim());
        await submit(
            { ...noticiaForm, tags },
            "/api/noticias",
            () => setNoticiaForm({ titulo: "", resumo: "", imagem: "", tags: "" })
        );
    }

    async function handleSubmitAnuncio() {
        await submit(
            anuncioForm,
            "/api/anuncios",
            () => setAnuncioForm({ titulo: "", imagem: "", href: "" })
        );
    }


    async function handleSubmitVideo() {
        const projetos = videoForm.projetos.split(",").map((t) => t.trim());
        await submit(
            { ...videoForm, projetos },
            "/api/videos",
            () => setVideoForm({ titulo: "", descricao: "", url: "", projetos: "" })
        );
    }

    return (
        <div className="w-[60%] mx-auto mt-20 py-12 mb-[200] justify-self-center p-6 gap-4 bg-slate-100 rounded drop-shadow-slate-900 shadow-lg space-y-8">
            <div className="flex flex-wrap gap-2 justify-center">
                {["noticia", "anuncio", "imagem", "video"].map((tab) => (
                    <button
                        key={tab}
                        className={`hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer px-4 py-2 rounded ${aba === tab ? "bg-green-700 text-white" : "bg-gray-200"
                            }`}
                        onClick={() => {
                            setError("");
                            setSuccess("");
                            setAba(tab as any);
                        }}
                    >
                        {tab[0].toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {aba === "noticia" && (
                <NoticiaFormComponent
                    form={noticiaForm}
                    setForm={setNoticiaForm}
                    handleFileChange={handleFileChange}
                    onSubmit={handleSubmitNoticia}
                />
            )}

            {aba === "anuncio" && (
                <AnuncioFormComponent
                    form={anuncioForm}
                    setForm={setAnuncioForm}
                    handleFileChange={handleFileChange}
                    onSubmit={handleSubmitAnuncio}
                />
            )}

            {aba === "imagem" && (
                <ImagemFormComponent
                    form={imagemForm}
                    setForm={setImagemForm}
                    handleFileChange={handleFileChange}
                    onSubmit={handleSubmitImagem}
                />
            )}

            {aba === "video" && (
                <VideoFormComponent
                    form={videoForm}
                    setForm={setVideoForm}
                    handleFileChange={handleFileChange}
                    onSubmit={handleSubmitVideo}
                />
            )}

            {(error || success) && (
                <p className={`${error ? "text-red-600" : "text-green-600"} mt-4`}>{error || success}</p>
            )}
        </div>
    );
}
