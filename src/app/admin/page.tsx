"use client";

import { useState } from "react";

export default function AdminPage() {
    const [token, setToken] = useState<string | null>(null);
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [statusCode, setStatusCode] = useState<number | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setStatusCode(null);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            setStatusCode(res.status);

            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                setError("Resposta inválida do servidor (não é JSON).");
                console.error("Erro ao parsear JSON:", jsonErr);
                return;
            }

            if (!res.ok) {

                setError(data.error || `Erro ao tentar logar (status ${res.status})`);
                console.error("Erro no login:", data);
                return;
            }

            setToken(data.token);
            localStorage.setItem('token', data.token);
            setError(null);
        } catch (fetchErr) {
            setError("Erro ao conectar com o servidor");
            console.error("Erro fetch login:", fetchErr);
        }
    }

    function handleLogout() {
        localStorage.removeItem("token"); // limpa o token do armazenamento local
        setToken(null);
        setLoginData({ username: "", password: "" });
        setError(null);
        setStatusCode(null);
        window.location.href = "/admin";
    }

    if (!token) {
        return (
            <div className="w-[60%] mx-auto  py-12 mb-[200] justify-self-center p-6 gap-4">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4 border-1  drop-shadow-slate-900 shadow-md p-6 rounded">
                    <input
                        type="text"
                        placeholder="Usuário"
                        value={loginData.username}
                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                        className="border p-2 rounded"
                        required
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-green-700 text-white p-2 rounded hover:bg-green-800"
                    >
                        Entrar
                    </button>
                    {error && <p className="text-red-600 mt-2 whitespace-pre-wrap">{error}</p>}
                    {statusCode && <p className="text-gray-500 mt-1">Status HTTP: {statusCode}</p>}
                </form>
            </div>
        );
    }

    return (
            <div className="w-[60%] mx-auto  py-12 mb-[200] justify-self-center p-6 gap-4">
            <h1 className="text-2xl font-bold mb-4">Logado com sucesso!</h1>
            <div className="flex flex-col gap-4 border-1  drop-shadow-slate-900 shadow-md p-6 rounded">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
                >
                    Sair

                </button>

                <button
                    onClick={() => window.location.href = "/admin/create"}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                    Criar notícia/anúncio</button>
            </div>

        </div>
    );
}
