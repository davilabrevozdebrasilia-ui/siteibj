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
    title: 'Portal de Notícias',
    description: 'Fique por dentro das últimas notícias',
};

const anunciosDb = await prisma.anuncio.findMany({
    take: 8,
});

const anuncios: AnuncioCardProps[] = anunciosDb.map((a) => ({
    anuncio: {
        id: a.id,
        titulo: a.titulo,
        imagem: a.imagem,
        href: a.href,
    },
}));

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-BR">
            <body >
                <div className={`${poppins.className}bg-slate-50 text-gray-900 suppressHydrationWarning`}>
                    <Navbar />
                    <main className={` antialiased min-h-[100vh] px-4 py-8 mb-[80] container mx-auto `}>{children}
                    </main>
                    <Footer/>
                    <AdFooter anuncioCardProps={anuncios} />
                </div>
            </body>
        </html>
    );
}

