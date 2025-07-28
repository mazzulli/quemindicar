import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";

const NotAuthorized = () => {
    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1>Not Authorized</h1>
            <LogoutLink 
            className="flex justify-center items-center bg-red-500 hover:bg-red-500/30 text-white border-white/30 
            backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-sm p-2 pr-4 pl-4 ml-4">
                Logout
            </LogoutLink>
        </div>
     );
}
 
export default NotAuthorized;