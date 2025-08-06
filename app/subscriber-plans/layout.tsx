import { ReactNode } from "react";
import { AuthProvider } from "../AuthProvider";

const SubscribersLayout = ({children}: {children: ReactNode}) => {
    return ( 
        <AuthProvider>
            {children}
        </AuthProvider>
     );
}
 
export default SubscribersLayout;