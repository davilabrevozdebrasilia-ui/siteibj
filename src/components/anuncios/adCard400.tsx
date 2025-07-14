import { AnuncioCardProps } from "@/types/anuncios";

export default function AdCard400({ anuncioCardProps }: { anuncioCardProps: AnuncioCardProps }) {
    return (
        <a
            href={anuncioCardProps.anuncio.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow border border-green-100 overflow-hidden flex h-full w-full flex-col"
        >
            <div className="flex-1 relative " >
                <img
                    src={anuncioCardProps.anuncio.imagem}
                    alt={anuncioCardProps.anuncio.titulo}
                    className="w-full h-full object-fill"
                />
            </div>
        </a>
    );
}
