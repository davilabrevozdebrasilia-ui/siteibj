import { notFound } from "next/navigation";

const artigos = {
  "importancia-da-inclusao-social": {
    titulo: "A Importância da Inclusão Social",
    conteudo: `
      Aqui vai TODO o texto real do artigo.
     <p><strong>Inclusão que Transforma: o Compromisso do IBJ com a Dignidade Humana</strong></p>

    <p>A inclusão é mais do que uma diretriz social; é uma necessidade humana e um compromisso ético com o desenvolvimento integral de cada pessoa. No Instituto Brazil Just (IBJ), entendemos que incluir não significa apenas permitir que alguém esteja presente, mas garantir que essa pessoa tenha condições reais de aprender, participar, conviver e se fortalecer. Inclusão é pertencimento. É reconhecimento. É a oportunidade de existir com dignidade, ser visto em sua singularidade e ter acesso a ambientes estruturados, afetivos e preparados para atender às diversidades humanas. Em nossas ações, buscamos enxergar o indivíduo muito além de diagnósticos, limitações aparentes ou vulnerabilidades sociais. </p>

    <p>As Neurociências reforçam que o ambiente ao qual uma pessoa é exposta cria impactos diretos no cérebro, na aprendizagem, na autonomia e nas funções emocionais. Quando oferecemos ambientes acolhedores, seguros e acessíveis, abrimos portas para novas conexões neurais e fortalecemos habilidades que muitas vezes não emergem em contextos de exclusão. Por isso, os projetos do IBJ são estruturados com atenção especial à sensibilidade, ao afeto e ao respeito. Sabemos que crianças, adolescentes, adultos e idosos só se desenvolvem plenamente quando encontram espaço para expressar suas necessidades, seus talentos e suas formas únicas de estar no mundo. A inclusão que praticamos começa no olhar, passa pelo acolhimento e se concretiza em ações práticas, respeitosas e transformadoras.</p>

    <p>Dentro do IBJ, iniciativas como os projetos para crianças e jovens em vulnerabilidade, programas voltados à comunidade TEA, atividades para mulheres, famílias e idosos, além de projetos culturais e ambientais, têm como eixo central a construção de oportunidades. Valorizar a diversidade é um dos pilares que mantém o Instituto vivo, atuante e conectado às demandas reais da sociedade. E não podemos falar de inclusão sem falar da família. Acolher famílias é parte indispensável do processo, pois são elas que sustentam, acompanham e lutam diariamente pelos direitos e pelo desenvolvimento de seus filhos e entes queridos. Fortalecer famílias significa fortalecer a inclusão. Por isso, o IBJ trabalha de forma integrada, garantindo suporte, orientação e escuta. </p>

    <p>Defender a inclusão é defender a vida. É transformar destinos, reduzir desigualdades e abrir caminhos para um futuro mais justo. O Instituto Brazil Just reafirma diariamente seu compromisso em promover dignidade, respeito e oportunidades, acreditando que cada pessoa — com sua história, sua diferença e sua essência — merece florescer. É por meio desse compromisso que seguimos avançando, transformando vidas e construindo um Brasil verdadeiramente inclusivo.</p>

    <p>Por Dra. Deijanete Fayad<br/>
    Psicanalista Clínica • Neurocientista • Pesquisadora em Psicoembriologia • Presidente do Instituto Brazil Just</p>
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
