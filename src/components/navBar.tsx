"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Calendar } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

const links = [
    { label: "Início", href: "/" },
    { label: "Mulheres Belas", href: "/noticias/mulheres-belas" },
    { label: "Visão para Todos", href: "/noticias/visao-para-todos" },
    { label: "TEA", href: "/noticias/tea" },
    { label: "Laços de Inclusao", href: "/noticias/lacos-de-inclusao" },
    { label: "Quem Somos", href: "/noticias/quem-somos" },
    { label: "Meninas Luz", href: "/noticias/meninas-luz" },
    { label: "Contato", href: "/contato" },
    { label: "Videos", href: "/videos" },
    { label: "Imagens", href: "/imagens" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [horaAtual, setHoraAtual] = useState<string>("");

    useEffect(() => {
        const atualizarHora = () => {
            const agora = new Date();
            const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const data = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            setHoraAtual(`${data} - ${hora}`);
        };

        atualizarHora();
        const intervalo = setInterval(atualizarHora, 60000);
        return () => clearInterval(intervalo);
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b  ">
            <div className="flex justify-between items-center px-4 py-2 z-50">
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/logo.jpg"
                        alt="Instituto Brazil Just"
                        className="h-full w-auto max-w-[80px] object-contain"
                    />
                    <span className="text-xl font-bold text-blue-900">
                        Instituto Brazil Just
                    </span>
                </Link>

                <div className="sm:text-lg text-md text-blue-900 font-mono bg-slate-100 px-2 py-1 rounded shadow-sm font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-900" />
                    {horaAtual}
                </div>
            </div>

            <div className="h-12 flex items-center justify-between px-4 bg-blue-500 drop-shadow-slate-400 drop-shadow-md ">
                <nav className="hidden xl:flex gap-4 flex-wrap justify-end">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-md px-2 py-3 whitespace-nowrap h-full hover:bg-blue-400  transition ${pathname === link.href
                                ? "text-slate-100 font-bold"
                                : "text-slate-100"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="xl:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6 text-blue-900" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 p-4 bg-blue-50">
                            <DialogTitle>
                                <h2 className="text-lg font-bold mb-4 text-blue-900">Menu</h2>
                            </DialogTitle>
                            <div className="flex flex-col space-y-3 mt-6">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-base font-medium py-1 px-2 rounded hover:underline ${pathname === link.href
                                            ? "text-blue-900 font-bold"
                                            : "text-blue-700"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
