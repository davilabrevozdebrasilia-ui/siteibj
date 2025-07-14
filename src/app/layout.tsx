import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navBar";
import Footer from "@/components/footer";

const poppins = Poppins({
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    subsets: ['latin'],
});


export const metadata = {
    title: 'Portal de Notícias',
    description: 'Fique por dentro das últimas notícias',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="pt-BR">
            <body >
                <div className="bg-slate-50 text-gray-900 suppressHydrationWarning">
                    <Navbar />
                    <main className={`${poppins.className} antialiased min-h-[100vh] px-4 py-8 container mx-auto `}>{children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}

