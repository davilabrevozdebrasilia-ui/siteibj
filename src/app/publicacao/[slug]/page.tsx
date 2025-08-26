import NoticiaPageClient from "@/components/noticias/noticiaPageClient";


interface PageProps {
    params: { slug: string };
}

export default function Page({ params }: PageProps) {
    return <NoticiaPageClient slug={params.slug} />;
}