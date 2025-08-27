import NoticiaPageClient from "@/components/noticias/noticiaPageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <NoticiaPageClient slug={slug} />;
}
