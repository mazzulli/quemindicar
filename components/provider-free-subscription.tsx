import { Button } from "@react-email/components"; // Nota: Se for para Web, use o Button do seu UI Kit ou HTML puro.
import Link from "next/link";
import Photo from "../public/quemindicarbanner-Photoroom.png";
import Image from "next/image";

const ProviderFreeSubscription = () => {
  return (
    <div className="w-full mx-auto bg-yellow-100 rounded-2xl p-6 md:p-0 shadow-lg animate-fade-in md:h-[220px] md:w-full flex items-center">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6 md:gap-12">        
        {/* Container da Imagem - Ajuste de overflow e posicionamento negativo para "sair" do card */}
        <div className="relative shrink-0 hidden md:block">
          <Image 
            src={Photo} 
            alt="Banner de anúncio" 
            width={300} 
            height={300}
            priority
            className="object-contain md:mt-[-80px] drop-shadow-xl"
          />
        </div>

        {/* Conteúdo de Texto */}
        <div className="flex flex-col text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-4xl font-black leading-tight text-[#f01671]  transition-all transform hover:scale-105 active:scale-95">
            Crie seu Anúncio <br className="md:hidden" />
            <span className="text-purple-600">agora mesmo.</span>
          </h1>
          <p className="text-3xl md:text-5xl text-orange-500 font-extrabold mt-2 transition-all transform hover:scale-105 active:scale-95">
            É de graça!
          </p>
        </div>

        {/* Call to Action */}
        <div className="pb-4 md:pb-0 md:pr-12">
          <Link href="/cadastro" passHref>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-md">
              Criar Anúncio
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ProviderFreeSubscription;