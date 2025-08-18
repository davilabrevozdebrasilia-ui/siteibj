export interface Anuncio {
  id: number;
  titulo: string;
  href: string;
  imagem: string;
}
export interface AnuncioCardProps{
    anuncio: Anuncio;
}