"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
    const [error, setError] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const hasToken = document.cookie.split("; ").some((cookie) => cookie.startsWith("token="));
        if (hasToken) setLoggedIn(true);
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setStatusCode(null);

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    username: formData.get("username"),
                    password: formData.get("password"),
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            setStatusCode(res.status);

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || `Erro ao tentar logar (status ${res.status})`);
                return;
            }

            setLoggedIn(true);
            setError(null);
        } catch (err) {
            setError("Erro ao conectar com o servidor");
            console.error(err);
        }
    }

    async function handleLogout() {
        await fetch("/api/logout", {
            method: "POST",
            credentials: "include",
        });

        setLoggedIn(false);
    }

    if (!loggedIn) {
        return (
            <div className="w-[40%] mx-auto py-12 mb-[200] justify-self-center p-6 gap-4 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 border drop-shadow p-6 rounded">
                    <input
                        type="text"
                        name="username"
                        placeholder="Usuário"
                        className="border p-2 rounded"
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        className="border p-2 rounded"
                        required
                    />
                    <button type="submit" className="bg-green-700 text-white p-2 rounded hover:bg-green-800 cursor-pointer">
                        Entrar
                    </button>
                    {error && <p className="text-red-600 mt-2 whitespace-pre-wrap">{error}</p>}
                </form>
            </div>
        );
    }

    return (
        <div className="w-[40%] mx-auto py-12 mb-[260] justify-self-center p-6 gap-4 space-y-4">
            <h1 className="text-2xl font-bold mb-4">Logado com sucesso!</h1>
            <div className="flex flex-col gap-4 border drop-shadow p-6 rounded">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 cursor-pointer"
                >
                    Sair
                </button>

                <button
                    onClick={() => (window.location.href = "/admin/create")}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition cursor-pointer"
                >
                    Criar notícia/anúncio
                </button>
            </div>
        </div>
    );
}
