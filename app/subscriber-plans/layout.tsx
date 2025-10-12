import { ReactNode } from "react";
import AuthProvider from "../auth-provider";

const SubscribersLayout = ({children}: {children: ReactNode}) => {
    return ( 
        <AuthProvider>
            {children}
        </AuthProvider>
     );
}
 
export default SubscribersLayout;