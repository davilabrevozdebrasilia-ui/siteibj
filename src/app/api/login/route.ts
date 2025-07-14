import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const USERNAME = process.env.ADMIN_USERNAME;
// Aqui substituímos '-' por '$' para restaurar o hash original
const PASSWORD_HASH_RAW = process.env.ADMIN_PASSWORD || "";
const PASSWORD_HASH = PASSWORD_HASH_RAW.replace(/-/g, "$");
const TOKEN = process.env.ADMIN_TOKEN;

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();

    console.log("Tentativa de login recebida:");
    console.log("Usuário enviado:", username);
    console.log("Senha enviada:", password ? "[OCULTA]" : "[NÃO ENVIADA]");
    console.log("Usuário esperado:", USERNAME);
    console.log("Hash salvo (com -):", PASSWORD_HASH_RAW);
    console.log("Hash usado para comparação (com $):", PASSWORD_HASH);

    if (username !== USERNAME) {
        console.warn("⚠️ Usuário inválido.");
        return NextResponse.json({ error: "Unauthorized - usuário inválido" }, { status: 401 });
    }

    let isPasswordValid = false;
    try {
        isPasswordValid = await bcrypt.compare(password, PASSWORD_HASH);
    } catch (error) {
        console.error("Erro ao comparar senhas:", error);
    }

    if (!isPasswordValid) {
        console.warn("⚠️ Senha inválida.");
        return NextResponse.json({ error: "Unauthorized - senha inválida" }, { status: 401 });
    }

    console.log("✅ Login autorizado. Retornando token.");
    return NextResponse.json({ token: TOKEN });
}
