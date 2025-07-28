import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server"
import { HandCoinsIcon } from "lucide-react";

const ContractButton = async () => {
    return ( 
        <div>
            <LoginLink>
                <div className="flex items-center justify-center bg-[#7e168b] hover:bg-[#c637c4] text-white font-semibold px-4 py-2 rounded transition-colors duration-300">
                    <HandCoinsIcon className="w-6 h-6 mr-2 inline-block" />
                    Contratar
                </div>
            </LoginLink>            
        </div>
     );
}
 
export default ContractButton;