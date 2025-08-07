"use client";

import ProjetoDropdown from "@/components/projetos/dropdown";
import Editor from "@/components/textEditor/editor";
import { Upload } from "lucide-react";
import { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

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
const projetosDisponiveis = [
    "Mulheres-Belas",
    "Visao-Para-Todos",
    "TEA",
    "Lacos-de-Inclusao",
    "Meninas-Luz",
];

export default function AdminCreate() {
    const [token, setToken] = useState<string | null>(null);
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

    const [imagemForm, setImagemForm] = useState<ImagemForm>({
        titulo: "",
        descricao: "",
        url: "",
        projetos: "",
    });

    const [videoForm, setVideoForm] = useState<VideoForm>({
        titulo: "",
        descricao: "",
        url: "",
        projetos: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            setError("Acesso negado. Faça login para continuar.");
        }
    }, []);
    const [batchFiles, setBatchFiles] = useState<{ tipo: "imagem" | "video"; files: File[] }>({
        tipo: "imagem",
        files: [],
    });

    function handleMultipleUpload(tipo: "imagem" | "video") {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files && files.length > 0) {
                setBatchFiles({ tipo, files: Array.from(files) });
            }
        };
    }

    function submitBatch(tipo: "imagem" | "video") {
        return async () => {
            if (!batchFiles.files.length) return setError("Nenhum arquivo selecionado.");

            for (const file of batchFiles.files) {
                const base64 = await readFileAsBase64(file);
                const data = {
                    titulo: tipo,
                    descricao: "",
                    url: base64,
                    tags: [tipo],
                };

                await submit(data, `/api/${tipo === "imagem" ? "imagens" : "videos"}`, () => { });
            }

            setSuccess(`${batchFiles.files.length} ${tipo}s cadastrados com sucesso.`);
            setBatchFiles({ tipo, files: [] });
        };
    }

    function readFileAsBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, tipo: string) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result as string;
            switch (tipo) {
                case "noticia":
                    setNoticiaForm((f) => ({ ...f, imagem: base64 }));
                    break;
                case "anuncio":
                    setAnuncioForm((f) => ({ ...f, imagem: base64 }));
                    break;
                case "imagem":
                    setImagemForm((f) => ({ ...f, url: base64 }));
                    break;
                case "video":
                    setVideoForm((f) => ({ ...f, url: base64 }));
                    break;
            }
        };
        reader.readAsDataURL(file);
    }

    async function submit(formData: any, endpoint: string, clearFn: () => void) {
        setError("");
        setSuccess("");
        if (!token) {
            setError("Você precisa estar logado para cadastrar.");
            return;
        }

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
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
        await submit({ ...noticiaForm, tags }, "/api/noticias", () =>
            setNoticiaForm({ titulo: "", resumo: "", imagem: "", tags: "" })
        );
    }

    async function handleSubmitAnuncio() {
        await submit(anuncioForm, "/api/anuncios", () =>
            setAnuncioForm({ titulo: "", imagem: "", href: "" })
        );
    }

    async function handleSubmitImagem() {
        const projetos = imagemForm.projetos.split(",").map((t) => t.trim());
        await submit({ ...imagemForm, projetos }, "/api/images", () =>
            setImagemForm({ titulo: "", descricao: "", url: "", projetos: "" })
        );
    }

    async function handleSubmitVideo() {
        const projetos = videoForm.projetos.split(",").map((t) => t.trim());
        await submit({ ...videoForm, projetos }, "/api/videos", () =>
            setVideoForm({ titulo: "", descricao: "", url: "", projetos: "" })
        );
    }

    if (!token) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 border rounded text-center">
                <p className="text-red-600 font-semibold mb-4">
                    {error || "Acesso negado. Faça login para continuar."}
                </p>
                <button
                    onClick={() => (window.location.href = "/admin")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                    Ir para Login
                </button>
            </div>
        );
    }

    return (
        <div className="w-[60%] mx-auto mt-20  py-12 mb-[200] justify-self-center p-6 gap-4 bg-slate-100 rounded drop-shadow-slate-900 shadow-lg space-y-8">
            <div className="flex flex-wrap gap-2 justify-center">
                {["noticia", "anuncio", "imagem", "video"].map((tab) => (
                    <button
                        key={tab}
                        className={`hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer px-4 py-2 rounded ${aba === tab ? "bg-green-700 text-white" : "bg-gray-200 "
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
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={noticiaForm.titulo}
                        onChange={(e) => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <Editor
                        value={noticiaForm.resumo}
                        onChange={(html) => setNoticiaForm({ ...noticiaForm, resumo: html })}
                    />
                    <input
                        type="text"
                        placeholder="Tags (separadas por vírgula)"
                        value={noticiaForm.tags}
                        onChange={(e) => setNoticiaForm({ ...noticiaForm, tags: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <label className="bg-slate-400 rounded-md px-4 font-bold h-10 cursor-pointer flex items-center gap-2 text-white hover:bg-slate-500 drop-shadow-sm drop-shadow-slate-900">
                        <Upload size={18} />
                        Enviar Imagem
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "noticia")}
                            className="hidden"
                        />
                    </label>
                    {noticiaForm.imagem && (
                        <img src={noticiaForm.imagem} className="max-h-40 object-contain" alt="Preview" />
                    )}
                    <button type="button" onClick={handleSubmitNoticia} className="bg-green-600 rounded-md text-white px-4 text-bold h-10 hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer font-bold">
                        Cadastrar Notícia
                    </button>
                </form>
            )}

            {aba === "anuncio" && (
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={anuncioForm.titulo}
                        onChange={(e) => setAnuncioForm({ ...anuncioForm, titulo: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <input
                        type="text"
                        placeholder="Link (href)"
                        value={anuncioForm.href}
                        onChange={(e) => setAnuncioForm({ ...anuncioForm, href: e.target.value })}
                        className="border p-2 rounded-md bg-white "
                    />
                    <label className="bg-slate-400 rounded-md px-4 font-bold h-10 cursor-pointer flex items-center gap-2 text-white hover:bg-slate-500 drop-shadow-sm drop-shadow-slate-900">
                        <Upload size={18} />
                        Enviar Imagem
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "anuncio")}
                            className="hidden "
                        />
                    </label>
                    {anuncioForm.imagem && (
                        <img src={anuncioForm.imagem} className="max-h-40 object-contain" alt="Preview" />
                    )}
                    <button type="button" onClick={handleSubmitAnuncio} className="bg-green-600 rounded-md-md text-white px-4 text-bold h-10 hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer font-bold">
                        Cadastrar Anúncio
                    </button>
                </form>
            )}

            {aba === "imagem" && (
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={imagemForm.titulo}
                        onChange={(e) => setImagemForm({ ...imagemForm, titulo: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <textarea
                        placeholder="Descrição"
                        value={imagemForm.descricao}
                        onChange={(e) => setImagemForm({ ...imagemForm, descricao: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <ProjetoDropdown
                        value={imagemForm.projetos}
                        onChange={(val) => setImagemForm({ ...imagemForm, projetos: val })}
                    />


                    <label className="bg-slate-400 rounded-md px-4 font-bold h-10 cursor-pointer flex items-center gap-2 text-white hover:bg-slate-500 drop-shadow-sm drop-shadow-slate-900">
                        <Upload size={18} />
                        Enviar Imagem
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "imagem")}
                            className="hidden"
                        />
                    </label>{imagemForm.url && (
                        <img src={imagemForm.url} className="max-h-40 object-contain " alt="Preview" />
                    )}
                    <button type="button" onClick={handleSubmitImagem} className="bg-green-600 rounded-md text-white px-4 text-bold h-10 hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer font-bold">
                        Cadastrar Imagem
                    </button>
                </form>
            )}

            {aba === "video" && (
                <form className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Título"
                        value={videoForm.titulo}
                        onChange={(e) => setVideoForm({ ...videoForm, titulo: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <textarea
                        placeholder="Descrição"
                        value={videoForm.descricao}
                        onChange={(e) => setVideoForm({ ...videoForm, descricao: e.target.value })}
                        className="border p-2 rounded-md bg-white"
                    />
                    <ProjetoDropdown
                        value={imagemForm.projetos}
                        onChange={(val) => setImagemForm({ ...imagemForm, projetos: val })}
                    />


                    <label className="bg-slate-400 rounded-md px-4 font-bold h-10 cursor-pointer flex items-center gap-2 text-white hover:bg-slate-500 drop-shadow-sm drop-shadow-slate-900">
                        <Upload size={18} />
                        Enviar Vídeo
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, "video")}
                            className="hidden"
                        />
                    </label>
                    {videoForm.url && (
                        <video src={videoForm.url} controls className="max-h-40 object-contain" />
                    )}

                    <button type="button" onClick={handleSubmitVideo} className="bg-green-600 rounded-md text-white px-4 text-bold h-10 hover:bg-green-500 drop-shadow-slate-900 drop-shadow-sm cursor-pointer font-bold">
                        Cadastrar Vídeo
                    </button>
                </form>
            )}

            {(error || success) && (
                <p className={`${error ? "text-red-600" : "text-green-600"} mt-4`}>
                    {error || success}
                </p>
            )}
        </div>
    );
}
