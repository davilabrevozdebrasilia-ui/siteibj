import { NoticiaCardProps } from "@/types/noticias";
import { Link } from "lucide-react";

export default function NoticiaLista({ noticiaCardProps }: { noticiaCardProps: NoticiaCardProps[] }) {
    return (
        <ul className="space-y-4">
            {noticiaCardProps.map((noticia) => (
                <li
                    key={noticia.noticia.id}
                >
                    <a
                        href={noticia.noticia.href}>
                        <div className="flex gap-4 items-start border-2 rounded-sm" >
                            <img
                                src={noticia.noticia.imagem}
                                alt={noticia.noticia.titulo}
                                className="w-20 h-20 object-fill rounded"
                            />

                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold text-blue-800">
                                    {noticia.noticia.titulo}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {noticia.noticia.data}
                                </p>
                                <p className="text-gray-700">
                                    {noticia.noticia.resumo}
                                </p>
                            </div>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    );
}
