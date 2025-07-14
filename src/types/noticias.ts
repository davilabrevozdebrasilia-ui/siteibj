// components/noticias/types.ts
export interface Noticia {
  id: number;
  titulo: string;
  data: string;
  resumo: string;
  imagem: string;
  tags:Array<string>
  href: string
}
export interface NoticiaCardProps{
    noticia: Noticia;
}

