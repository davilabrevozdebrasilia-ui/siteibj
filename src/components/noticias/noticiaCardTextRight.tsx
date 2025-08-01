import { NoticiaCardProps } from "@/types/noticias";

export function NoticiaCardTextRight({ noticiaCardProps }: { noticiaCardProps: NoticiaCardProps }) {
    return (
        <a
            href={noticiaCardProps.noticia.href}
            className="flex bg-white rounded-lg shadow border border-slate-100 overflow-hidden hover:shadow-lg transition-transform duration-200 hover:-translate-y-1"
        >
            <div className="w-1/3 min-w-[150px] h-auto">
                <img
                    src={noticiaCardProps.noticia.imagem}
                    alt={noticiaCardProps.noticia.titulo}
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="w-2/3 p-4 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-blue-900 truncate">
                    {noticiaCardProps.noticia.titulo}
                </h3>
                <p className="text-gray-700 line-clamp-3 mt-1">
                    {noticiaCardProps.noticia.resumo}
                </p>
            </div>
        </a>
    );
}
