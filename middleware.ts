// middleware.ts na raiz do projeto
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;

    // Rota protegida
    const protectedPath = "/admin/create";

    if (request.nextUrl.pathname.startsWith(protectedPath)) {
        if (!token) {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            // token válido, deixa passar
            return NextResponse.next();
        } catch (e) {
            // token inválido ou expirado
            return NextResponse.redirect(new URL("/admin", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/create", "/admin/create/:path*"],
};
