import { NoticiaCardProps } from "@/types/noticias";

export function NoticiaCardOverlay({ noticiaCardProps }: { noticiaCardProps: NoticiaCardProps }) {
    return (
        <a
            href={noticiaCardProps.noticia.href}
            className="relative h-[250px] bg-white rounded-lg drop-shadow-md drop-shadow-slate-200 border-1 border-slate-200 overflow-hidden transform transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
            <img
                src={noticiaCardProps.noticia.imagem}
                alt={noticiaCardProps.noticia.titulo}
                className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 w-full bg-white/70 backdrop-blur-md px-4 py-3 h-20 overflow-clip line-clamp-2">
                <h3 className="text-blue-900 text-lg font-semibold drop-shadow-sm overflow-clip">
                    {noticiaCardProps.noticia.titulo}
                </h3>
            </div>
        </a>
    );
}
