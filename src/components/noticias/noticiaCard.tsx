import { NoticiaCardProps } from "@/types/noticias";

export default function NoticiaCard({ noticiaCardProps }: { noticiaCardProps: NoticiaCardProps }) {
    return (
        <a
            href={noticiaCardProps.noticia.href}
            className="h-full bg-white rounded-lg shadow border border-slate-100 overflow-hidden transform transition-transform duration-200 hover:-translate-y-2 hover:shadow-lg"
        >
            <div className="flex flex-col h-full">
                <div className="relative flex-grow overflow-hidden min-h-50">
                    <img
                        src={noticiaCardProps.noticia.imagem}
                        alt={noticiaCardProps.noticia.titulo}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>

                <div className="h-[100px] p-4 overflow-hidden bg-white z-10 flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-green-900 truncate">
                        {noticiaCardProps.noticia.titulo}
                    </h3>
                    <p className="text-gray-700 line-clamp-2">
                        {noticiaCardProps.noticia.resumo}
                    </p>
                </div>
            </div>
        </a>
    );
}
