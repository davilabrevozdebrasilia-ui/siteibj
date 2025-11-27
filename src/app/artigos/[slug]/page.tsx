import { notFound } from "next/navigation";

const artigos = {
  "importancia-da-inclusao-social": {
    titulo: "A Importância da Inclusão Social",
    conteudo: `
      Aqui vai TODO o texto real do artigo.
      Você pode colocar HTML, <p>, <h2> ou texto normal.
    `,
  },
  "psicoembriologia-e-primeira-infancia": {
    titulo: "Psicoembriologia e Primeira Infância",
    conteudo: `
      Conteúdo do artigo sobre psicoembriologia.
    `,
  },
  "esporte-e-cidadania": {
    titulo: "Esporte e Cidadania",
    conteudo: `
      Conteúdo completo do artigo sobre esporte.
    `,
  },
};

export default function ArtigoPage({ params }) {
  const artigo = artigos[params.slug];

  if (!artigo) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-950">
        {artigo.titulo}
      </h1>

      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
      />
    </div>
  );
}
