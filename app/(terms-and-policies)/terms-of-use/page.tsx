import Header from "@/app/subscriber-plans/components/header";
import { Separator } from "@/components/ui/separator";
import { CheckCheckIcon, CheckIcon, MailCheck } from "lucide-react";

const TermsOfUse = () => {
    return ( 
        <>
            {/* Header igual ao app/page.tsx */}
            <Header
                title="Termos de Uso"
                description="Leia atentamento nossos termos de uso."
                path="/subscriber-plans"
            />

            {/* Centralizar os cards */}
            <div className="p-4 sm:p-10 mt-8">
                <h1><b>TERMO DE USO – QUEMINDICAR.COM.BR</b></h1>
                <h2><strong>Última atualização:</strong> [01/08/2025]</h2>
                <p className="py-6">Este Termo de Uso regula as condições de acesso e utilização da plataforma QUEMINDICAR.COM.BR, de titularidade de [SSIT CONSULTING - ME], inscrita no CNPJ/CPF sob o nº [36.624.293-0001-25], doravante denominada “Plataforma”.</p>
                <p>Ao acessar ou utilizar a Plataforma, o usuário declara ter lido, compreendido e aceito integralmente este Termo de Uso, inclusive sua Política de Privacidade.</p>
                    <Separator className="mt-8 mb-8"/>
                    <b>1. OBJETIVO DA PLATAFORMA</b>
                    <p>A Plataforma QUEMINDICAR.COM.BR tem como finalidade a divulgação de prestadores de serviços, lojas, profissionais autônomos, empresas e comerciantes em geral, facilitando a recomendação e o contato direto entre os visitantes do site e os anunciantes cadastrados.</p>
                    <Separator className="mt-8 mb-8"/>
                    <b>2. CADASTRO E INFORMAÇÕES FORNECIDAS</b>
                    <p>2.1. Para utilização da Plataforma, os usuários que desejarem divulgar seus serviços ou negócios deverão realizar um cadastro, fornecendo informações como:</p>
                    <ul className="mt-4 mb-4">
                        <li className="flex"><CheckIcon /> Nome completo ou nome empresarial;</li>
                        <li className="flex"><CheckIcon /> Nome fantasia;</li>
                        <li className="flex"><CheckIcon /> CPF ou CNPJ;</li>
                        <li className="flex"><CheckIcon /> Endereço comercial (quando aplicável);</li>
                        <li className="flex"><CheckIcon /> Telefones para contato;</li>
                        <li className="flex"><CheckIcon /> Endereço de e-mail;</li>
                        <li className="flex"><CheckIcon /> Redes sociais (Instagram, Facebook, etc.);</li>
                        <li className="flex"><CheckIcon /> Link de site institucional, se houver;</li>
                        <li className="flex"><CheckIcon /> Descrição dos serviços ou produtos oferecidos.</li>
                    </ul>
                    <p>2.2. Todas as informações fornecidas no formulário de cadastro serão públicas e visíveis para qualquer visitante da Plataforma, com o objetivo de facilitar o contato direto entre os visitantes e os anunciantes.</p>
                    <p>2.3. Ao contratar um plano de divulgação, o usuário, denominado "Prestador de Serviço", declara ser o titular das informações prestadas e responsabiliza-se integralmente pela veracidade e atualização dos dados informados.</p>
                    
                    <Separator className="mt-8 mb-8"/>
                    
                    <b>3. OBRIGAÇÕES DOS USUÁRIOS</b>
                    <p>3.1. É vedado aos usuários:</p>
                    <ul className="mt-4 mb-4">
                        <li className="flex"><CheckIcon /> Publicar conteúdo ofensivo, difamatório, discriminatório, ilícito ou que viole direitos de terceiros;</li>
                        <li className="flex"><CheckIcon /> Cadastrar informações falsas ou de terceiros sem autorização;</li>
                        <li className="flex"><CheckIcon /> Utilizar a Plataforma para fins ilegais ou contrários às finalidades aqui estabelecidas.</li>
                    </ul>

                    <p>3.2. O uso da Plataforma deverá observar os princípios da boa-fé, ética e transparência comercial.</p>
                    
                    <Separator className="mt-8 mb-8"/>
                    
                    <b>4. EXIBIÇÃO PÚBLICA DAS INFORMAÇÕES</b>
                    <p>4.1. Os dados de contato informados no momento do cadastro (incluindo nome, telefone, e-mail, redes sociais e site) serão publicados de forma pública na página do respectivo anunciante.</p>
                    <p>4.2. Ao realizar o cadastro, o usuário autoriza expressamente a exposição dessas informações para fins de divulgação e marketing de seus produtos ou serviços.</p>

                    <Separator className="mt-8 mb-8"/>

                    <b>5. PROPRIEDADE INTELECTUAL</b>
                    <p>5.1. Todo o conteúdo do site QUEMINDICAR.COM.BR (marca, layout, textos, imagens, estrutura) é protegido por direitos de propriedade intelectual, sendo vedada sua reprodução total ou parcial sem autorização expressa.</p>
                    
                    <Separator className="mt-8 mb-8"/>
                    
                    <b>6. LIMITAÇÃO DE RESPONSABILIDADE</b>
                    <p>6.1. A Plataforma atua exclusivamente como intermediária na divulgação de prestadores de serviços, não garantindo qualidade, entrega, atendimento ou resultados dos serviços prestados pelos anunciantes.</p>
                    <p>6.2. O QUEMINDICAR.COM.BR não realiza intermediação de pagamento, contratação ou garantia das relações comerciais entre visitantes e anunciantes.</p>
                    
                    <Separator className="mt-8 mb-8"/>
                    
                    <b>7. PROTEÇÃO DE DADOS – LGPD</b>
                    <p>7.1. A Plataforma está comprometida com a privacidade e proteção dos dados pessoais, conforme previsto na Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD).</p>
                    <p>7.2. Ao preencher o formulário de cadastro, o usuário consente de forma livre, informada e inequívoca com o tratamento e exposição pública dos dados fornecidos, com a finalidade de promoção, recomendação e visibilidade de seus serviços e contatos profissionais.</p>
                    <p>7.3. Os dados serão tratados com medidas de segurança adequadas, e o titular poderá solicitar a edição, atualização ou remoção de suas informações a qualquer momento, mediante contato com a administração da Plataforma.</p>
                    <p>7.4. Os dados coletados não serão compartilhados com terceiros para fins comerciais, exceto nos casos em que houver obrigação legal ou solicitação judicial.</p>
                    
                    <Separator className="mt-8 mb-8"/>
                    
                    <b>8. ALTERAÇÕES NO TERMO DE USO</b>
                    <p>8.1. Este Termo poderá ser alterado a qualquer momento, mediante publicação da nova versão no site. É responsabilidade do usuário consultar periodicamente o documento.</p>
                    
                    <Separator className="mt-8 mb-8"/>
                    
                    <b>9. DISPOSIÇÕES GERAIS</b>
                    <p>9.1. O uso da Plataforma é gratuito, salvo se futuramente houver inclusão de planos ou serviços adicionais pagos, mediante aviso prévio.</p>
                    <p>9.2. O presente Termo será regido pela legislação brasileira. Fica eleito o foro da comarca de [EMBU DAS ARTES/SP], para dirimir eventuais controvérsias.</p>

                    <Separator className="mt-8 mb-8"/>

                    <b>10. CONTATO</b>
                    <p>Dúvidas ou solicitações poderão ser encaminhadas para:</p>
                    <p className="flex items-center gap-4"><MailCheck />E-mail: [contato@quemindicar.com.br]</p>
            </div>
        </>
    );
}
 
export default TermsOfUse;