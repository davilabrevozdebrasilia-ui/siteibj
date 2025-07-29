export interface Anuncio {
  id: number;
  titulo: string;
  href: string;
  imagem: string;
  tipo?: string;
}
export interface AnuncioCardProps{
    anuncio: Anuncio;
}