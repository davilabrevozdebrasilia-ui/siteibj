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
    { label: "Política", href: "/noticias/politica" },
    { label: "Esportes", href: "/noticias/esportes" },
    { label: "Economia", href: "/noticias/entretenimento" },
    { label: "Tecnologia", href: "/noticias/tecnologia" },
    { label: "Meio ambiente", href: "/noticias/servicos" },
    { label: "Saúde", href: "/contato" },
    { label: "Notícias do Riella", href: "/noticias/riella" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 bg-white border-b drop-shadow-black">
            <div className="container mx-auto flex items-center justify-between px-4 ">
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="Logo Voz de Brasília"
                        className="h-full w-auto max-w-[130px] object-contain"
                    />
                </Link>

                <nav className="hidden md:flex gap-4 flex-wrap justify-end">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm px-2 py-1 whitespace-nowrap rounded-md hover:underline transition ${pathname === link.href
                                    ? "text-green-900 font-bold"
                                    : "text-green-700"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6 text-green-900" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 p-4 bg-green-50">
                            <div className="flex flex-col space-y-3 mt-6">
                                {links.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-base font-medium py-1 px-2 rounded hover:underline ${pathname === link.href
                                                ? "text-green-900 font-bold"
                                                : "text-green-700"
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
