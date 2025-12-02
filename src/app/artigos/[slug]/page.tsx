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

    <p>O esporte é uma das ferramentas sociais mais poderosas para transformar realidades e construir cidadania. Muito além do desempenho físico, ele fortalece valores fundamentais como disciplina, respeito, cooperação, coragem e responsabilidade. No Instituto Brazil Just (IBJ), acreditamos que o esporte é uma porta de entrada para o desenvolvimento humano integral, especialmente para crianças e jovens em situação de vulnerabilidade social. Quando uma criança entra em um projeto esportivo, ela não está apenas aprendendo uma modalidade: ela está descobrindo quem é, o que é capaz de realizar e como pode construir seu futuro com dignidade.</p>

    <p>O ambiente esportivo cria pertencimento, reduz a evasão escolar, afasta jovens da violência e promove habilidades socioemocionais essenciais à vida adulta. Além disso, os estudos em Neurociências mostram que a prática regular de esportes melhora as funções executivas, fortalece o controle emocional, aumenta a motivação e contribui para o bem-estar mental. Em nossos projetos, unimos esporte, educação e suporte social, criando um círculo virtuoso que impacta não somente o jovem, mas também sua família e toda a comunidade ao redor.</p>

    <p>O IBJ tem atuação direta em comunidades onde muitas vezes faltam oportunidades, mas sobra talento. Por isso, todos os nossos projetos esportivos são gratuitos, inclusivos e focados na formação cidadã. Nosso objetivo é que cada participante desenvolva não apenas habilidade técnica, mas valores que o acompanharão pela vida inteira. Acreditamos que um país mais forte nasce no campo, na quadra e no olhar de cada criança que descobre seu próprio potencial.</p>

    <p>Promover esporte é promover futuro. É dar ferramentas para que cada jovem escreva sua história com autonomia, coragem e esperança. O IBJ seguirá comprometido com projetos que unem esporte, cidadania e transformação social, construindo diariamente um Brasil mais justo, solidário e humano.</p>

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
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
      />
    </div>
  );
}
