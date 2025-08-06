import Link from "next/link";
import logo from "@/public/contratoassinado.png";
import Image from "next/image";

const Layout = ({children}: {children: React.ReactNode}) => {    
    return ( 
        <section className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="flex flex-col items-center justify-center w-full max-w-2xl px-4">
                <Link href="/" className="flex items-center gap-2 mb-4 text-blue-500 hover:text-blue-700">
                    <Image src={logo} alt="Logo" width={700} height={350} />
                </Link>
                {children}
            </div>
        </section>
     );
}
 
export default Layout;