import {  NoticiaCardProps } from "@/types/noticias";
import NoticiaCard from "./noticiaCard";

export default function NoticiaGrid({ noticiaCardProps }: { noticiaCardProps: NoticiaCardProps[] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {noticiaCardProps.map((noticia) => (
                <NoticiaCard key={noticia.noticia.id} noticiaCardProps={noticia} />
            ))}
        </div>
    );
}
