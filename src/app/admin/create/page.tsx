"use client";

import Editor from "@/components/textEditor/editor";
import dynamic from "next/dynamic";
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

export default function AdminCreate() {
  const [token, setToken] = useState<string | null>(null);
  const [aba, setAba] = useState<"noticia" | "anuncio">("noticia");
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

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>,
    isNoticia: boolean
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (isNoticia) {
        setNoticiaForm((f) => ({ ...f, imagem: base64 }));
      } else {
        setAnuncioForm((f) => ({ ...f, imagem: base64 }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmitNoticia() {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Você precisa estar logado para cadastrar notícias.");
      return;
    }

    const tagsArray = noticiaForm.tags.split(",").map((t) => t.trim());

    const res = await fetch("/api/noticias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...noticiaForm, tags: tagsArray }),
    });

    if (res.ok) {
      setSuccess("Notícia cadastrada com sucesso!");
      setNoticiaForm({
        titulo: "",
        resumo: "",
        imagem: "",
        tags: "",
      });
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao cadastrar notícia");
    }
  }

  async function handleSubmitAnuncio() {
    setError("");
    setSuccess("");

    if (!token) {
      setError("Você precisa estar logado para cadastrar anúncios.");
      return;
    }

    const res = await fetch("/api/anuncios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(anuncioForm),
    });

    if (res.ok) {
      setSuccess("Anúncio cadastrado com sucesso!");
      setAnuncioForm({
        titulo: "",
        imagem: "",
        href: "",
      });
    } else {
      const data = await res.json();
      setError(data.error || "Erro ao cadastrar anúncio");
    }
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
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded space-y-6">
      <div className="flex gap-4">
        <button
          className={`flex-1 p-2 rounded ${
            aba === "noticia" ? "bg-green-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setError("");
            setSuccess("");
            setAba("noticia");
          }}
        >
          Criar Notícia
        </button>
        <button
          className={`flex-1 p-2 rounded ${
            aba === "anuncio" ? "bg-green-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => {
            setError("");
            setSuccess("");
            setAba("anuncio");
          }}
        >
          Criar Anúncio
        </button>
      </div>

      {aba === "noticia" && (
        <form
          className="flex flex-col gap-4"
          onClick={(e) => {
            // Evita submit ao clicar em botões que não sejam submit (aqui só tem um tipo: submit removido)
            const target = e.target as HTMLElement;
            if (
              target.tagName === "BUTTON" &&
              (target as HTMLButtonElement).type !== "button"
            ) {
              e.preventDefault();
            }
          }}
        >
          <input
            type="text"
            placeholder="Título"
            value={noticiaForm.titulo}
            onChange={(e) => setNoticiaForm({ ...noticiaForm, titulo: e.target.value })}
            required
            className="border p-2 rounded"
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
            required
            className="border p-2 rounded"
          />
          <input
            required
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, true)}
            className="border p-2 rounded"
          />
          {noticiaForm.imagem && (
            <img src={noticiaForm.imagem} alt="Preview" className="mt-2 max-h-40 object-contain" />
          )}
          <button
            type="button"
            onClick={handleSubmitNoticia}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
          >
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
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Link do anúncio (href)"
            value={anuncioForm.href}
            onChange={(e) => setAnuncioForm({ ...anuncioForm, href: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, false)}
            className="border p-2 rounded"
            required
          />
          {anuncioForm.imagem && (
            <img src={anuncioForm.imagem} alt="Preview" className="mt-2 max-h-40 object-contain" />
          )}
          <button
            type="button"
            onClick={handleSubmitAnuncio}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
          >
            Cadastrar Anúncio
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
