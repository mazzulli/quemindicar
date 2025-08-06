import Header from "@/app/subscriber-plans/components/header";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, MailCheck } from "lucide-react";

const PrivacyPolicy = () => {
    return ( 
        <>
            {/* Header igual ao app/page.tsx */}
            <Header
                title="Política de Privacidade"
                description="Leia atentamento nossa política."
                path="/subscriber-plans"
            />

            {/* Centralizar os cards */}
            <div className="p-4 sm:p-10 mt-8">
                <h1><b>POLÍTICA DE PRIVACIDADE – QUEMINDICAR.COM.BR</b></h1>
                <h2><strong>Última atualização:</strong> [01/08/2025]</h2>
                <p className="py-6">A presente Política de Privacidade tem por finalidade demonstrar o 
                    compromisso do site <strong>QUEMINDICAR.COM.BR</strong>, 
                    de titularidade de <strong>[SSIT CONSULTING - ME]</strong>, 
                    inscrita no CNPJ/CPF sob o nº [36.624.293-0001-25], 
                    com a <strong>privacidade e a proteção dos dados pessoais </strong>
                    dos usuários e visitantes da Plataforma.</p>
                <p>Ao acessar ou utilizar a Plataforma, o usuário declara ter lido, compreendido e aceito integralmente esta Política de Privacidade.</p>
                
                <Separator className="mt-8 mb-8"/>
                
                <h1><b>1. QUAIS DADOS COLETAMOS</b></h1>
                <p>A Plataforma poderá coletar as seguintes informações pessoais e profissionais, fornecidas diretamente pelo usuário no momento do cadastro:</p>
                <ul className="mt-4 mb-4">
                    <li className="flex"><CheckIcon /> Nome completo ou razão social</li>
                    <li className="flex"><CheckIcon /> Nome fantasia</li>
                    <li className="flex"><CheckIcon /> CPF ou CNPJ</li>
                    <li className="flex"><CheckIcon /> E-mail</li>
                    <li className="flex"><CheckIcon /> Telefone</li>
                    <li className="flex"><CheckIcon /> Endereço comercial</li>
                    <li className="flex"><CheckIcon /> Redes sociais</li>
                    <li className="flex"><CheckIcon /> Site institucional</li>
                    <li className="flex"><CheckIcon /> Descrição dos serviços ou produtos</li>
                    <li className="flex"><CheckIcon /> Outras informações fornecidas voluntariamente no formulário de cadastro</li>
                </ul>
                <p></p>Também poderão ser coletadas automaticamente informações técnicas de navegação, como:
                <ul className="mt-4 mb-4">
                    <li className="flex"><CheckIcon /> Endereço IP</li>
                    <li className="flex"><CheckIcon /> Tipo de navegador</li>
                    <li className="flex"><CheckIcon /> Data e hora de acesso</li>
                    <li className="flex"><CheckIcon /> Cookies (ver item 6)</li>
                </ul>
                
                <Separator className="mt-8 mb-8"/>

                <b>2. FINALIDADE DO TRATAMENTO DOS DADOS</b>
                <p>Os dados pessoais e profissionais fornecidos são utilizados para as seguintes finalidades:</p>
                <ul className="mt-4 mb-4">                    
                    <li className="flex"><CheckIcon /> Publicar e divulgar os dados de contato e serviços oferecidos pelo usuário, de forma pública, no site QUEMINDICAR.COM.BR, para facilitar a recomendação e o contato por visitantes;</li>
                    <li className="flex"><CheckIcon /> Permitir que visitantes encontrem e entrem em contato diretamente com os anunciantes;</li>
                    <li className="flex"><CheckIcon /> Aperfeiçoar a experiência de navegação na Plataforma;</li>
                    <li className="flex"><CheckIcon /> Cumprir obrigações legais e regulatórias;</li>
                    <li className="flex"><CheckIcon /> Atender solicitações, dúvidas ou suporte técnico.</li>
                </ul>

                <Separator className="mt-8 mb-8"/>

                <b>3. COMPARTILHAMENTO DE DADOS</b>
                <p>3.1. As informações dos prestadores de serviço serão disponibilizadas publicamente para fins de consulta e contato por visitantes da Plataforma.</p>
                <p>3.2. Não comercializamos, alugamos ou compartilhamos dados pessoais com terceiros para fins de marketing sem o consentimento do titular.</p>
                <p>3.3. O compartilhamento de dados poderá ocorrer nas seguintes hipóteses:</p>
                <ul className="mt-4 mb-4">                    
                    <li className="flex"><CheckIcon /> Para cumprimento de obrigação legal ou regulatória;</li>
                    <li className="flex"><CheckIcon /> Para cumprimento de ordem judicial;</li>
                    <li className="flex"><CheckIcon /> Para proteção da Plataforma em caso de infrações.</li>
                </ul>

                <Separator className="mt-8 mb-8"/>
                
                <b>4. CONSENTIMENTO DO USUÁRIO</b>
                <p>Ao se cadastrar e fornecer seus dados no site <strong>QUEMINDICAR.COM.BR</strong>, o usuário declara que 
                concorda expressamente com esta Política de Privacidade e autoriza a publicação das informações fornecidas 
                para os fins aqui descritos.</p>
                
                <Separator className="mt-8 mb-8"/>

                <b>5. DIREITOS DO TITULAR DOS DADOS (ART. 18 – LGPD)</b>
                <p>Nos termos da LGPD, o titular dos dados pessoais tem direito a:</p>
                <ul className="mt-4 mb-4">                    
                    <li className="flex"><CheckIcon /> Confirmar a existência de tratamento de dados;</li>
                    <li className="flex"><CheckIcon /> Acessar os dados;</li>
                    <li className="flex"><CheckIcon /> Corrigir dados incompletos, inexatos ou desatualizados;</li>
                    <li className="flex"><CheckIcon /> Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
                    <li className="flex"><CheckIcon /> Revogar o consentimento;</li>
                    <li className="flex"><CheckIcon /> Solicitar a exclusão total do cadastro e das informações pessoais da Plataforma.</li>
                </ul>
                
                <p>Para exercer qualquer um desses direitos, o titular poderá entrar em contato através 
                    do e-mail: <strong>[contato@quemindicar.com.br]</strong></p>
                
                <Separator className="mt-8 mb-8"/>
                
                <b>6. USO DE COOKIES E TECNOLOGIAS SIMILARES</b>
                <p>6.1. O site poderá utilizar cookies e ferramentas de rastreamento com a finalidade de melhorar a experiência de navegação, gerar métricas de acesso e personalizar conteúdos.</p>
                <p>6.2. O usuário pode configurar seu navegador para recusar ou excluir cookies, embora isso possa afetar a funcionalidade da Plataforma.</p>
                
                <Separator className="mt-8 mb-8"/>

                <b>7. SEGURANÇA DA INFORMAÇÃO</b>
                <p>Adotamos medidas técnicas e administrativas de segurança para proteger os dados pessoais contra acessos não autorizados, perdas, alterações ou qualquer forma de tratamento inadequado ou ilícito.</p>
                
                <Separator className="mt-8 mb-8"/>
                
                <b>8. RETENÇÃO E EXCLUSÃO DOS DADOS</b>
                <p>Os dados pessoais serão armazenados pelo tempo necessário para:</p>
                <ul className="mt-4 mb-4">                    
                    <li className="flex"><CheckIcon /> Cumprir com as finalidades descritas nesta Política;</li>
                    <li className="flex"><CheckIcon /> Cumprir exigências legais e regulatórias;</li>
                    <li className="flex"><CheckIcon /> Preservar direitos em processos judiciais ou administrativos.</li>
                </ul>
                <p>Após esse período, os dados poderão ser anonimizados ou excluídos, mediante solicitação do titular.</p>
                
                <Separator className="mt-8 mb-8"/>

                <b>9. ALTERAÇÕES NESTA POLÍTICA</b>
                <p>Esta Política poderá ser atualizada a qualquer momento para atender a eventuais alterações legislativas ou melhorias na Plataforma. A nova versão entrará em vigor na data de sua publicação.</p>

                <Separator className="mt-8 mb-8"/>

                <b>10. CONTATO</b>
                <p>Dúvidas ou solicitações poderão ser encaminhadas para:</p>
                <p className="flex items-center gap-4"><MailCheck /><strong>E-mail: [contato@quemindicar.com.br]</strong></p>
            </div>
        </>
    );
}
 
export default PrivacyPolicy;