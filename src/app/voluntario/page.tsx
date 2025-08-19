"use client";

import { useState } from "react";

export default function SejaVoluntarioPage() {
    const [nome, setNome] = useState("");
    const [endereco, setEndereco] = useState("");
    const [profissao, setProfissao] = useState("");
    const [idade, setIdade] = useState("");
    const [dias, setDias] = useState("");
    const [horario, setHorario] = useState("");

    const gerarMailTo = () => {
        const assunto = encodeURIComponent("Seja Voluntário - Inscrição");
        const corpo = encodeURIComponent(
            `Nome: ${nome}\n` +
            `Endereço: ${endereco}\n` +
            `Profissão: ${profissao}\n` +
            `Idade: ${idade}\n` +
            `Dias disponíveis: ${dias}\n` +
            `Horário que pode ajudar: ${horario}`
        );
        return `mailto:institutobraziljust@gmail.com?subject=${assunto}&body=${corpo}`;
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-10 text-center">
                Seja um Voluntário
            </h1>

            <div className="bg-white rounded-lg shadow border border-slate-100 p-6 space-y-4">
                <h2 className="text-2xl font-semibold text-blue-900 mb-2">
                    Preencha o formulário
                </h2>

                <label className="block">
                    <span className="text-gray-700 font-semibold">Nome</span>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Digite seu nome"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-semibold">Endereço</span>
                    <input
                        type="text"
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Digite seu endereço"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-semibold">Profissão</span>
                    <input
                        type="text"
                        value={profissao}
                        onChange={(e) => setProfissao(e.target.value)}
                        className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Sua profissão"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-semibold">Idade</span>
                    <input
                        type="number"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                        className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Digite sua idade"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-semibold">Dias da semana disponíveis</span>
                    <input
                        type="text"
                        value={dias}
                        onChange={(e) => setDias(e.target.value)}
                        className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Ex: Segunda, Quarta e Sexta"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-semibold">Horário que pode ajudar</span>
                    <input
                        type="text"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                        className="mt-1 w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
                        placeholder="Ex: Tarde, noite, horário comercial"
                    />
                </label>

                <a
                    href={gerarMailTo()}
                    className="inline-block bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
                >
                    Enviar Inscrição
                </a>
            </div>
        </div>
    );
}
