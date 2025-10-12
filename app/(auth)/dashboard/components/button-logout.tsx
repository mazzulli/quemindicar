import { Button } from "@/components/ui/button";
import { sign } from "crypto";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const ButtonLogout = () => {
    return ( 
        <Button
            onClick={async ()=> signOut({ callbackUrl: "/" })}
            variant="secondary"
            className="bg-red-500/20 hover:bg-red-500/30 text-white border-red-300/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
        </Button>
     );
}
 
export default ButtonLogout;