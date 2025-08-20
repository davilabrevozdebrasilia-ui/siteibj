const Footer = () => {
  return (
    <footer className="bottom-0  w-full bg-blue-500 text-white py-6 px-4 text-center space-y-2 h-80 sm:h-56">
      <p className="font-semibold">&copy; {new Date().getFullYear()} Instituto Brazil Just (IBJ). Todos os direitos reservados.</p>
      <p>
        <strong>CNPJ:</strong> 13.838.187/0001‑49
      </p>
      <p>
        <strong>Endereço:</strong> Setor SGCV Lote 15 (St Garagens e Conceções de Veículos), Bloco C, S/N,
        Sala 402 e 403, Edifício Hotel Jade Home Office, Zona Industrial (Guará), Brasília‑DF, CEP 71215‑650
      </p>
    </footer>
  );
};

export default Footer;
