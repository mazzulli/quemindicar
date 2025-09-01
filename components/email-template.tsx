import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
// import logoImg from '@/public/logo-b.png'
// import Image from 'next/image'

interface WelcomeEmailProps {
  userFirstname: string;
  email: string;
  pwd: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? process.env.NEXTAUTH_URL
  : '';

export const WelcomeEmail = ({
  userFirstname,
  email,
  pwd
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Uma novidade que irá impulsionar seu negócio e suas vendas. 
      </Preview>
      <Container style={container}>
        <Img
         src={'https://www.quemindicar.com.br/imageFiles/logo-b.png'}
          width="240"
          height="170"
          alt="Quem Indicar"
          style={logo}
        />
                
        <Text style={paragraph}>Olá {userFirstname},</Text>
        <Text style={paragraph}>
          Bem vindo à Quem Indicar, o site de divulgação que ajuda você a alcançar
          mais clientes e fechar negócio mais rápido.
        </Text>
        <Text>
          Estas são suas credenciais de acesso:
        </Text>
        <div className='flex flex-col gap-4 mb-12'>
          <Text>
            <strong>Usuário: </strong>{email}
          </Text>
          <Text>
            <strong>Senha: </strong>{pwd}
          </Text>
        </div>
        <Text>
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={baseUrl}>
            Vamos começar
          </Button>
        </Section>
        <Text style={paragraph}>
          Att,
          <br />
          Equipe Quem Indicar
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          2025 Copyright - Quem indicar - www.quemindicar.com.br
        </Text>
      </Container>
    </Body>
  </Html>
);

WelcomeEmail.PreviewProps = {
  userFirstname: 'Alan',
} as WelcomeEmailProps;

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
  margintop: '20px',
};

const button = {
  backgroundColor: '#5F51E8',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
