import Link from "next/link";
import logoQuemIndicar  from "../../../public/quemIndicarLogov2.png";
import Image from "next/image"
import { Button } from "@/components/ui/button";
import { ArrowLeft, BackpackIcon } from "lucide-react";

interface HeaderProps {
    title: string;
    description: string;
    path: string;
}

const Header = ( {title, description, path } : HeaderProps) => {
    return ( 
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between sm:flex-row flex-col">
            <div className="flex items-center gap-3">
              <div className="w-340 h-240 flex items-center justify-center backdrop-blur-sm hidden sm:block">
                <Image src={logoQuemIndicar} alt="Logo Quem Indicar" width={340} height={240} className="mr-2" />                
              </div>
            </div>
            <div className="text-white text-center">
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mt-2 text-lg">{description}</p>
            </div>
            <div className="mt-6 sm:mt-0">
              <Link href={path}>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white 
                  border-white/30 backdrop-blur-sm transition-all 
                  duration-300 hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
     );
}
 
export default Header;