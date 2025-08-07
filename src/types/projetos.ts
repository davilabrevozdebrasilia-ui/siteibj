export interface Projeto {
  titulo: string;
  descricao: string
  href: string;
  imagem: string;
}
export interface ProjetoCardProps{
    projeto: Projeto;
}