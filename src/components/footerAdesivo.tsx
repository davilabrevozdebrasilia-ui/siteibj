import { AnuncioCardProps } from "@/types/anuncios";
import AdBarCarousel from "./anuncios/adSliderFull";

const AdFooter = ({ anuncioCardProps }: {anuncioCardProps: AnuncioCardProps[]}) => {
  return (
    <div className="bg-transparent text-white text-center fixed bottom-0 w-full px-10 py-2">
      <AdBarCarousel anuncioCardProps={anuncioCardProps}/>
    </div>
  );
};

export default AdFooter;
