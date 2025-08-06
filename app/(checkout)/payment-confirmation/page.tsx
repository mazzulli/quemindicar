import Link from "next/link";


const CheckoutReturnPage = () => {
    return ( 
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-4 text-center">
            <h1 className="font-bold text-gray-700 mb-5">Pagamento realizado com sucesso!</h1>
            <p>Obrigado por sua compra! Seu pagamento foi processado com sucesso.</p>
            <p>Você receberá um e-mail de confirmação em breve.</p>
            <Link href="/" className="text-blue-500 hover:underline mt-8">
                Voltar para a página inicial
            </Link>
        </div>
     );
}
 
export default CheckoutReturnPage;