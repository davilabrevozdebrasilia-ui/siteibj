"use client";

import { useState } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";

const Footer = () => {
  const [openProjetos, setOpenProjetos] = useState(false);
  const [openDialog, setOpenDialog] = useState<"termos" | "politica" | null>(
    null
  );

  const projetosSubmenu = [
    { label: "Mulheres Belas", href: "/projetos/mulheres-belas" },
    { label: "Visão para Todos", href: "/projetos/visao-para-todos" },
    { label: "Esporte é vida", href: "/projetos/esporte-e-vida" },
    { label: "Laços de Inclusao", href: "/projetos/lacos-de-inclusao" },
    { label: "Meninas Luz", href: "/projetos/meninas-luz" },
    { label: "Ações Comunitárias", href: "/projetos/acoes-comunitarias" },
  ];

  const links = [
    { label: "Início", href: "/" },
    { label: "Quem Somos", href: "/quem-somos" },
    { label: "Visão", href: "/visao" },
    { label: "Projetos", href: "#" },
    { label: "Videos", href: "/videos" },
    { label: "Fotos", href: "/imagens" },
    { label: "Contato", href: "/contato" },
    { label: "Transparência", href: "/transparencia" },
    { label: "Doações", href: "/doacoes" },
    { label: "Seja Voluntário", href: "/voluntario" },
  ];

  return (
    <footer className="w-full bg-blue-950 text-white py-12 px-6">
      <div className="max-w-[90%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Coluna 1 - Logo + Descrição + Redes */}
        <div className="space-y-4">
          <img
            src="/logo7.svg"
            alt="Logo IBJ"
            className="w-36 bg-white rounded-lg p-2 object-contain"
          />
          <p className="text-sm leading-relaxed">
            O Instituto Brazil Just (IBJ) promove projetos sociais e culturais
            para transformar vidas por meio da inclusão, educação e cidadania.
          </p>
          <div className="flex space-x-3">
            <a
              href="https://www.facebook.com/ibraziljust/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 p-2 rounded-lg hover:opacity-80 transition"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/ibraziljust/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-500 p-2 rounded-lg hover:opacity-80 transition"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Coluna 2 - Contato */}
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold text-lg mb-3">Conecte-se</h3>
          <a
            href="https://www.google.com/maps?q=Setor+SGCV+Lote+15,+Bloco+C,+Sala+402/403,+Ed.+Hotel+Jade+Home+Office,+Brasília-DF"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:underline"
          >
            <span className="bg-green-600 p-2 rounded-md">
              <FaMapMarkerAlt />
            </span>
            Setor SGCV Lote 15, Bloco C, Sala 402/403, Ed. Hotel Jade Home
            Office, Brasília-DF
          </a>
          <a
            href="tel:+5561999999999"
            className="flex items-center gap-2 hover:underline"
          >
            <span className="bg-blue-600 p-2 rounded-md">
              <FaPhoneAlt />
            </span>
            (61) 99999-9999
          </a>
          <a
            href="mailto:contato@ibj.org"
            className="flex items-center gap-2 hover:underline"
          >
            <span className="bg-red-600 p-2 rounded-md">
              <FaEnvelope />
            </span>
            contato@ibj.org
          </a>
          <p className="flex items-center gap-2">
            <span className="bg-yellow-600 p-2 rounded-md">
              <FaClock />
            </span>
            Seg a Sex, 9h às 18h
          </p>
        </div>

        {/* Coluna 3 - Menu */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Menu</h3>
          <ul className="space-y-2 text-sm">
            {links.map((link, idx) => (
              <li key={idx}>
                {link.label === "Projetos" ? (
                  <button
                    onClick={() => setOpenProjetos(!openProjetos)}
                    className="flex items-center justify-between w-full hover:underline"
                  >
                    {link.label}
                    <FaChevronDown
                      className={`transition-transform ${
                        openProjetos ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                ) : (
                  <a href={link.href} className="hover:underline">
                    {link.label}
                  </a>
                )}

                {link.label === "Projetos" && openProjetos && (
                  <ul className="ml-4 mt-2 space-y-1 text-xs border-l border-white/30 pl-3">
                    {projetosSubmenu.map((submenu, subIdx) => (
                      <li key={subIdx}>
                        <a href={submenu.href} className="hover:underline">
                          {submenu.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 4 - Políticas */}
        <div className="space-y-2 text-sm">
          <h3 className="font-semibold text-lg mb-3">Legal</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setOpenDialog("termos")}
                className="hover:underline cursor-pointer"
              >
                Termos de Uso
              </button>
            </li>
            <li>
              <button
                onClick={() => setOpenDialog("politica")}
                className="hover:underline cursor-pointer"
              >
                Políticas de Privacidade
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Linha de baixo */}
      <div className="text-center text-sm mt-8 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()} Instituto Brazil Just (IBJ). Todos os
        direitos reservados.
      </div>

      {/* Dialogs */}
      {openDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50  ">
          <div className="bg-white text-black rounded-lg max-w-[80%] w-full max-h-[80vh] overflow-y-auto p-6 relative shadow-xl">
            <button
              onClick={() => setOpenDialog(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
            >
              ✕
            </button>

            {openDialog === "termos" && (
              <>
                <h2 className="text-xl font-bold mb-4">Termos de Uso</h2>
                <p className="text-sm leading-relaxed">
                  Estes Termos de Uso regem a utilização do site do Instituto
                  Brazil Just (IBJ). Ao acessar e utilizar nossos serviços, você
                  concorda em respeitar todas as regras, direitos e deveres aqui
                  estabelecidos. O conteúdo deste site não pode ser copiado ou
                  utilizado sem autorização. Reservamo-nos o direito de alterar
                  ou atualizar estes Termos a qualquer momento.
                </p>
              </>
            )}

            {openDialog === "politica" && (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Políticas de Privacidade
                </h2>
                <p className="text-sm leading-relaxed">
                  O Instituto Brazil Just (IBJ) respeita a sua privacidade e se
                  compromete a proteger os dados pessoais coletados neste site.
                  As informações fornecidas serão utilizadas apenas para fins
                  institucionais e não serão compartilhadas sem consentimento.
                  Ao utilizar este site, você concorda com nossas práticas de
                  coleta e uso de dados descritas nesta política.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
