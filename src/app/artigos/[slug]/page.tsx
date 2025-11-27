import Link from "next/link";

export default function ArtigosPage() {
  const artigos = [
    {
      slug: "importancia-da-inclusao-social",
      titulo: "A Importância da Inclusão Social",
      descricao: "Como projetos sociais transformam vidas e comunidades inteiras.",
      imagem: "/logoIBJ.png",
    },
    {
      slug: "psicoembriologia-e-primeira-infancia",
      titulo: "Psicoembriologia e Primeira Infância",
      descricao: "Como as experiências maternas moldam o desenvolvimento do bebê.",
      imagem: "/logoIBJ.png",
    },
    {
      slug: "esporte-e-cidadania",
      titulo: "Esporte e Cidadania",
      descricao: "O impacto do esporte na formação de crianças e jovens.",
      imagem: "/logoIBJ.png",
    },
  ];

  return (
    <div className="w-full py-20 bg-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-blue-950 mb-10 text-center">
          Artigos do Instituto Brazil Just
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artigos.map((artigo, index) => (
            <Link
              key={index}
              href={`/artigos/${artigo.slug}`}
              className="bg-white rounded-2xl shadow-lg p-5 hover:scale-105 hover:shadow-xl transition cursor-pointer"
            >
              <img
                src={artigo.imagem}
                alt={artigo.titulo}
                className="w-full h-40 object-contain mb-4"
              />

              <h2 className="text-xl font-bold text-blue-900 mb-2">
                {artigo.titulo}
              </h2>

              <p className="text-gray-700 text-sm">{artigo.descricao}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
