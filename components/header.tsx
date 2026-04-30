import Link from "next/link";
import Image from "next/image"
import { Button } from "./ui/button";
import { LogIn, RocketIcon } from "lucide-react";
import logoQuemIndicar  from "../public/logonew.png"

const Header = () => {
    return (
        // <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <header className="bg-gradient-to-b from-white via-white to-white">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between flex-col sm:flex-row">
                <div className="flex items-center gap-3">
                    <div className="w-340 h-240 flex flex-col sm:flex-row items-center justify-center mb-8">
                    <Image src={logoQuemIndicar} alt="Logo Quem Indicar"
                        width={300} height={60} className="mr-2  transition-all transform hover:scale-105 active:scale-95" />                
                        <div className="flex flex-row items-center  transition-all transform hover:scale-105 active:scale-95">
                        {/* <p className="text-5xl text-black font-bold opacity-80">Q</p>
                        <p className="text-3xl text-pink-600 font-bold">UEM {" "} </p>
                        <p className="text-5xl text-black font-bold opacity-80">{" "}I</p>
                        <p className="text-3xl text-pink-600 font-bold">NDICAR</p>
                        <p className="text-5xl text-black font-bold opacity-80">?</p> */}
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href="/subscriber-plans">
                    <Button
                        variant="secondary"
                        className="md:text-[20px] bg-white/20 hover:bg-white/30 text-pink-600 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                        <RocketIcon className="w-4 h-4 mr-1" />
                        Consulte nossos planos
                    </Button>
                    </Link>
                    <Link href="/login">
                    <Button
                        variant="secondary"
                        className="md:text-[20px] bg-white/20 hover:bg-white/30 text-pink-600 border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                    >
                        <LogIn className="w-4 h-4 mr-1" />
                        Login
                    </Button>
                    </Link>
                </div>
                </div>
            </div>
        </header>
      );
}
 
export default Header
