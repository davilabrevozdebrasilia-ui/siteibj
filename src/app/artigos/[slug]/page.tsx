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
      <p><strong>Esporte e Cidadania: Caminhos que Transformam Vidas</strong></p>

      <p>O esporte é uma das ferramentas sociais mais poderosas para transformar realidades e construir cidadania. Muito além do desempenho físico...</p>

      <p>O ambiente esportivo cria pertencimento, reduz a evasão escolar, afasta jovens da violência e promove habilidades socioemocionais...</p>

      <p>O IBJ tem atuação direta em comunidades onde muitas vezes faltam oportunidades, mas sobra talento...</p>

      <p>Promover esporte é promover futuro...</p>

      <p>Por Dra. Deijanete Fayad<br/>
      Psicanalista Clínica • Neurocientista • Presidente do Instituto Brazil Just • Defensora da Inclusão e do Desenvolvimento Humano</p>
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
        className="text-lg leading-relaxed text-justify space-y-4"
        dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
      />
    </div>
  );
}
