import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navBar";
import Footer from "@/components/footer";
import { AnuncioCardProps } from "@/types/anuncios";
import { prisma } from "@/lib/prisma";
import AdFooter from "@/components/footerAdesivo";

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});


export const metadata = {
    title: 'Instituo Brazil Just',
    description: 'Fique por dentro das últimas notícias',
    icons: {
        icon: "/favicon.ico",
    },
};

const anunciosDb = await prisma.anuncio.findMany({
    take: 20,
});

const anuncios: AnuncioCardProps[] = anunciosDb?.length
    ? anunciosDb.map((a) => ({
        anuncio: {
            id: a.id,
            titulo: a.titulo,
            imagem: a.imagem,
            href: a.href,
        },
    }))
    : [];



export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-BR">
            <body >
                <div className={`${poppins.className}bg-blue-50 text-gray-900 suppressHydrationWarning`}>
                    <Navbar />
                    <main className={`antialiased`}>{children}
                    </main>
                    <Footer />
                    <AdFooter anuncioCardProps={anuncios} />
                </div>
            </body>
        </html>
    );
}

