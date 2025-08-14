import Link from "next/link";


const CheckoutReturnPage = () => {
    return ( 
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-4 text-center">
            <h1 className="font-bold text-gray-700 mb-5">Pagamento realizado com sucesso!</h1>
            <p>Obrigado pela sua compra e por confiar em nossos serviços!</p>            
            <p>Você receberá um e-mail de confirmação com instruções para realizar o seu cadastro</p>
            <p>para divulgação do seu serviço ou negócio.</p>
            <Link href="/" className="text-blue-500 hover:underline mt-8">
                Voltar para a página inicial
            </Link>
        </div>
     );
}
 
export default CheckoutReturnPage;