import { getKindeServerSession, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation";


const Contract = async () => {
    const { isAuthenticated } = getKindeServerSession();
    if(!(await isAuthenticated())) {
        redirect('/api/auth/login');        
    }
    return ( 
        <div>
            <h1>Que ótimo que vc decidiu contratar nossos serviços</h1>            
            <LogoutLink>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Sair
                </button>
            </LogoutLink>
        </div>
     );
}
 
export default Contract;