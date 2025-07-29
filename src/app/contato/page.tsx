"use client";

import { useState } from "react";
import { Instagram, Facebook, Youtube} from "lucide-react";

const redes = [
    {
        nome: "Instituto Brazil Just",
        logo: "/logo1.png",
        links: {
            instagram: "https://www.instagram.com/ibraziljust/",
            facebook: "https://www.facebook.com/ibraziljust/",
        },
    },
    {
        nome: "Voz de Brasília",
        logo: "/logo2.png",
        links: {
            instagram: "https://www.instagram.com/vozdebrasilia_/",
            facebook: "https://www.facebook.com/VozBrasilia",
            youtube: "https://www.youtube.com/@VozdebrasiliaTV",
        },
    },
    
];

export default function ContatoPage() {
    const [titulo, setTitulo] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "enviado" | "erro">("idle");

    const enviarEmail = async () => {
        setStatus("loading");
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ titulo, mensagem }),
            });

            if (res.ok) {
                setStatus("enviado");
                setTitulo("");
                setMensagem("");
            } else {
                setStatus("erro");
            }
        } catch (error) {
            setStatus("erro");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-10 text-center">Entre em Contato</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow border border-slate-100 p-6 space-y-4">
                    <h2 className="text-2xl font-semibold text-blue-900 mb-2">Envie seu e-mail</h2>

                    <label className="block">
                        <span className="text-gray-700 font-semibold">Título</span>
                        <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Assunto do contato"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-700 font-semibold">Mensagem</span>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            rows={6}
                            className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                            placeholder="Digite sua mensagem aqui"
                        />
                    </label>

                    <button
                        onClick={enviarEmail}
                        disabled={status === "loading"}
                        className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition disabled:opacity-50"
                    >
                        {status === "loading" ? "Enviando..." : "Enviar Mensagem"}
                    </button>

                    {status === "enviado" && <p className="text-green-600">Email enviado com sucesso!</p>}
                    {status === "erro" && <p className="text-red-600">Erro ao enviar. Tente novamente.</p>}
                </div>

                <div className="bg-white rounded-lg shadow border border-slate-100 p-6 space-y-8">
                    <h2 className="text-2xl font-semibold text-blue-900">Nossas Redes</h2>

                    {redes.map((site, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center gap-3">
                                <img
                                    src={site.logo}
                                    alt={`Logo ${site.nome}`}
                                    className="w-10 h-10 rounded-lg object-contain border"
                                />
                                <h3 className="text-lg font-semibold text-gray-800">{site.nome}</h3>
                            </div>

                            <div className="flex gap-4 pl-1">
                                <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <Instagram className="w-6 h-6 text-blue-900" />
                                </a>
                                <a href={site.links.facebook} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <Facebook className="w-6 h-6 text-blue-900" />
                                </a>
                                <a href={site.links.youtube} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                                    <Youtube className="w-6 h-6 text-blue-900" />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
