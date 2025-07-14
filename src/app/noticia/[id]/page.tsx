import AdSliderFull from "@/components/anuncios/adSliderFull";
import AdCard400 from "@/components/anuncios/adCard400";

interface Params {
    params: { id: string };
}

export default async function NoticiaPage({ params }: Params) {
    const id = params.id;

    const noticiaRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/noticias/${id}`, {
        cache: "no-store",
    });

    if (!noticiaRes.ok) {
        return <div className="p-6 text-center">Notícia não encontrada.</div>;
    }

    const noticia = await noticiaRes.json();

    const anunciosRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/anuncios`, {
        cache: "no-store",
    });

    const anuncios = anunciosRes.ok ? await anunciosRes.json() : [];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <AdSliderFull anuncioCardProps={anuncios.map((a: any) => ({ anuncio: a }))} />
            </div>

            <div className="flex gap-6">
                <div className="hidden lg:block w-48 sticky top-20">
                    {anuncios.slice(0, 2).map((a: any) => (
                        <AdCard400 key={a.id} anuncioCardProps={{ anuncio: a }} />
                    ))}
                </div>

                <main className="flex-1">
                    <h1 className="text-4xl font-bold mb-4 text-green-800">{noticia.titulo}</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        {new Date(noticia.data).toLocaleDateString("pt-BR")}
                    </p>

                    <img
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />

                    <article className="prose max-w-none">
                        <p>{noticia.resumo}</p>
                    </article>
                </main>

                <div className="hidden lg:block w-48 sticky top-20">
                    {anuncios.slice(2, 5).map((a: any) => (
                        <AdCard400 key={a.id} anuncioCardProps={{ anuncio: a }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
