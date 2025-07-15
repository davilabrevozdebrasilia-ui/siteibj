import { NoticiaCardProps } from "@/types/noticias";

export default function NoticiaDestaque({ noticiaCardProps }: { noticiaCardProps: NoticiaCardProps }) {
    return (
        <div
            className="bg-white rounded-lg shadow border border-slate-100 overflow-hidden flex flex-col"
        >
            <div className="flex-1 relative h-full" >
                <img
                    style={{ height: "calc(100%)" }}
                    src={noticiaCardProps.noticia.imagem}
                    alt={noticiaCardProps.noticia.titulo}
                    className="w-full object-fill"
                />
            </div>

            <div className="h-25 p-4 overflow-hidden bg-white z-10">
                <h3 className="text-xl font-semibold text-blue-900 truncate">
                    {noticiaCardProps.noticia.titulo}
                </h3>
                <p className="text-gray-700 line-clamp-2">
                    {noticiaCardProps.noticia.resumo}
                </p>
            </div>
        </div>
    );
}
