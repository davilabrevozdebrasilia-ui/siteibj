'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const links = [
    { label: "Início", href: "/" },
    { label: "Projeto Mulheres Belas", href: "/noticias/mulheres-belas" },
    { label: "Projeto Visao para Todos", href: "/noticias/visao-para-todos" },
    { label: "TEA", href: "/noticias/tea" },
    { label: "Lacos de Inclusao", href: "/noticias/lacos-de-inclusao" },
    { label: "Quem Somos", href: "/noticias/quem-somos" },
    { label: "Projeto Meninas Luz", href: "/noticias/meninas-luz" },
    { label: "Faca sua Doacao", href: "/noticias/doacao" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white border-b drop-shadow-black">
            <div className="container mx-auto flex items-center justify-between px-4 ">
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

                <nav className="hidden lg:flex gap-4 flex-wrap justify-end">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm px-2 py-1 whitespace-nowrap rounded-md hover:underline transition ${pathname === link.href
                                ? "text-blue-900 font-bold"
                                : "text-blue-700"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6 text-blue-900" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 p-4 bg-blue-50">
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
