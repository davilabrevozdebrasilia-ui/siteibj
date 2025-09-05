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
    { label: "Laços de Inclusao", href: "/projetos/lacos-de-inclusao" },
    { label: "Meninas Luz", href: "/projetos/meninas-luz" },
    { label: "Ações Comunitárias", href: "/projetos/acoes-comunitarias" },
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
    { label: "Doações", href: "/doacoes" },
    { label: "Seja Voluntário", href: "/voluntario" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [projetosAberto, setProjetosAberto] = useState(false);
    const [projetosMobileAberto, setProjetosMobileAberto] = useState(false);
    const projetosRef = useRef<HTMLDivElement>(null);

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
            <Link
                href="/"
                className="relative flex items-center w-full h-32 md:h-40 lg:h-48 rounded-xl shadow-md overflow-hidden bg-contain bg-center"
                style={{ backgroundImage: "url('/banner6.png')" }}
            >
                <div
                    className="h-full w-full bg-contain bg-left bg-no-repeat ms-4"
                    style={{ backgroundImage: "url('/banner5.png')" }}
                />

            </Link>

            <div className="h-12 flex items-center lg:justify-center justify-between px-4 
    bg-blue-700 
    shadow-md border-y-1 border-slate-600">    <nav className="hidden lg:flex gap-4 flex-wrap justify-end relative">
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
                                    <div className="absolute top-full left-0 bg-white shadow-lg rounded text-blue-950 z-50 hidden group-hover:block">
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

                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6 text-blue-950" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 p-4 bg-blue-50">
                            <DialogTitle>
                                <h2 className="text-lg font-bold mb-4 text-blue-950">Menu</h2>
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
                                                ? "text-blue-950 font-bold"
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
