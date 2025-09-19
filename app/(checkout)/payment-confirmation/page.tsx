import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createUser, UserProps } from "@/lib/actions/users";
import { generatePassword, hashPassword } from "@/lib/utils";

import ConfirmationPage from "./components/confirmation";

const CheckoutReturnPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {    
    const sessionId = searchParams.session_id

    if (!sessionId)
        throw new Error('Por favor forneça uma sessão válida (`cs_test_...`)')

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items', 'payment_intent']
    });

    const status = session.status;
    const customerName:string = session.customer_details?.name!;
    const customerEmail:string = session.customer_details?.email!;

    if (status === 'open') {
        return redirect('/')
    }

    if (status === 'complete') {
        const mailIndex = customerEmail.indexOf('@')
        const initialPassword = 'qi@' + customerEmail.substring(0, mailIndex) + generatePassword()

        const hashedPassword = await hashPassword(initialPassword)

        const data: UserProps = {
            name: customerName,
            email: customerEmail,
            passwordHash: hashedPassword,
            role: "Customer",
            active: true,
        } 
        // gravar os dados do novo usuário
        const user = await createUser(data)
        
        return ( 
            <ConfirmationPage
                customerName={customerName}
                customerEmail={customerEmail}
                initialPassword={initialPassword}
                isSuccess={user.success}
            />
        )
    }
}
 
export default CheckoutReturnPage;