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
      Inclusão que Transforma: o Compromisso do IBJ com a Dignidade Humana

A inclusão é mais do que uma diretriz social; é uma necessidade humana e um compromisso ético...

As Neurociências reforçam que o ambiente ao qual uma pessoa é exposta cria impactos diretos...

Dentro do IBJ, iniciativas como os projetos para crianças e jovens em vulnerabilidade...

Defender a inclusão é defender a vida. É transformar destinos, reduzir desigualdades...

Por Dra. Deijanete Fayad
Psicanalista Clínica • Neurocientista • Pesquisadora em Psicoembriologia • Presidente do Instituto Brazil Just
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
