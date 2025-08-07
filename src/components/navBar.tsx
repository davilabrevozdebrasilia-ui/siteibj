"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Calendar, ChevronDown } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useState, useRef } from "react";

const projetosSubmenu = [
    { label: "Mulheres Belas", href: "/projetos/mulheres-belas" },
    { label: "Visão para Todos", href: "/projetos/visao-para-todos" },
    { label: "Esporte é vida", href: "/projetos/esporte-e-vida" },
    { label: "TEA Laços de Inclusao", href: "/projetos/tea-lacos-de-inclusao" },
    { label: "Meninas Luz", href: "/projetos/meninas-luz" },
];

const links = [
    { label: "Início", href: "/" },
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Visão", href: "/visao" },
    { label: "Projetos", href: "#" },
    { label: "Videos", href: "/videos" },
    { label: "Fotos", href: "/imagens" },
    { label: "Contato", href: "/contato" },
    { label: "Transparência", href: "/transparencia" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [horaAtual, setHoraAtual] = useState<string>(() => {
        const agora = new Date();
        const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const data = agora.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${data} - ${hora}`;
    });

    const [projetosAberto, setProjetosAberto] = useState(false);
    const [projetosMobileAberto, setProjetosMobileAberto] = useState(false);
    const projetosRef = useRef<HTMLDivElement>(null);

    // Fecha o submenu de projetos se clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                projetosRef.current &&
                !projetosRef.current.contains(event.target as Node)
            ) {
                setProjetosAberto(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b">
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

            <div className="h-12 flex items-center md:justify-center justify-between px-4 bg-blue-500 drop-shadow-slate-400 drop-shadow-md ">
                <nav className="hidden md:flex gap-4 flex-wrap justify-end relative">
                    {links.map((link) => {
                        if (link.label === "Projetos") {
                            return (
                                <div
                                    key="projetos"
                                    className="relative group"
                                >
                                    <span
                                        className="cursor-pointer text-md px-2 py-3 h-full text-slate-100 hover:bg-blue-400 flex items-center gap-1"
                                    >
                                        Projetos <ChevronDown className="w-4 h-4" />
                                    </span>
                                    <div className="absolute top-full left-0 bg-white shadow-lg rounded text-blue-900 z-50 hidden group-hover:block">
                                        {projetosSubmenu.map((proj) => (
                                            <Link
                                                key={proj.href}
                                                href={proj.href}
                                                className="block px-4 py-2 hover:bg-blue-100 whitespace-nowrap"
                                            >
                                                {proj.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-md px-2 py-3 whitespace-nowrap h-full hover:bg-blue-400 transition ${pathname === link.href
                                        ? "text-slate-100 font-bold"
                                        : "text-slate-100"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                </nav>

                <div className="md:hidden">
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
                                {links.map((link) => {
                                    if (link.label === "Projetos") {
                                        return (
                                            <div key="projetos-mobile">
                                                <button
                                                    onClick={() =>
                                                        setProjetosMobileAberto((prev) => !prev)
                                                    }
                                                    className="text-left w-full text-base font-medium py-1 px-2 rounded hover:underline text-blue-700"
                                                >
                                                    Projetos{" "}
                                                    <ChevronDown className="inline w-4 h-4 ml-1" />
                                                </button>
                                                {projetosMobileAberto && (
                                                    <div className="pl-4 mt-1">
                                                        {projetosSubmenu.map((proj) => (
                                                            <Link
                                                                key={proj.href}
                                                                href={proj.href}
                                                                className="block text-sm py-1 px-2 text-blue-700 hover:underline"
                                                            >
                                                                {proj.label}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
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
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
