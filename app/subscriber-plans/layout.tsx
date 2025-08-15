import { AuthProvider } from "@/contexts/auth-context";
import { ReactNode } from "react";

const SubscribersLayout = ({children}: {children: ReactNode}) => {
    return ( 
        <AuthProvider>
            {children}
        </AuthProvider>
     );
}
 
export default SubscribersLayout;