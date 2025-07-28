import { AnuncioCardProps } from "@/types/anuncios";

export default function AdCard({ anuncioCardProps }: { anuncioCardProps: AnuncioCardProps }) {
    return (
        <a
            href={anuncioCardProps.anuncio.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden flex h-full w-full flex-col"
        >
            <div className="flex-1 relative min-h-[200px] bg-slate-100 flex items-center justify-center">
                <img
                    src={anuncioCardProps.anuncio.imagem}
                    alt={anuncioCardProps.anuncio.titulo}
                    className="w-full h-full object-contain"
                />
            </div>
        </a>
    );
}
