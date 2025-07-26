-- Inserir categorias iniciais
INSERT INTO categorias (nome) VALUES 
    ('Beleza e Estética'),
    ('Saúde e Bem-estar'),
    ('Educação'),
    ('Tecnologia'),
    ('Consultoria'),
    ('Design'),
    ('Fotografia'),
    ('Eventos')
ON CONFLICT (nome) DO NOTHING;

-- Inserir alguns prestadores de exemplo
INSERT INTO prestadores (
    titulo, subtitulo, categoria_id, descricao, telefone, email, endereco, 
    site, instagram, facebook, youtube
) VALUES 
    (
        'Maria Silva',
        'Esteticista Especializada',
        1,
        'Especialista em tratamentos faciais, limpeza de pele e procedimentos estéticos. Mais de 10 anos de experiência no mercado.',
        '(11) 99999-1234',
        'maria@exemplo.com',
        'Rua das Flores, 123 - São Paulo, SP',
        'https://mariasilva.com.br',
        '@mariasilva_estetica',
        'Maria Silva Estética',
        'Maria Silva Beauty'
    ),
    (
        'João Santos',
        'Personal Trainer',
        2,
        'Personal trainer certificado, especialista em musculação e condicionamento físico. Atendimento personalizado e resultados garantidos.',
        '(11) 98888-5678',
        'joao@exemplo.com',
        'Av. Paulista, 456 - São Paulo, SP',
        'https://joaopersonal.com',
        '@joao_personal',
        'João Santos Personal',
        ''
    ),
    (
        'Ana Costa',
        'Professora de Inglês',
        3,
        'Professora de inglês com certificação internacional. Aulas particulares e em grupo, presencial e online.',
        '(11) 97777-9012',
        'ana@exemplo.com',
        'Rua da Educação, 789 - São Paulo, SP',
        '',
        '@ana_english',
        'Ana Costa English',
        'Ana English Classes'
    ),
    (
        'Carlos Tech',
        'Desenvolvedor Web',
        4,
        'Desenvolvedor full-stack especializado em React, Node.js e aplicações web modernas. Criação de sites e sistemas personalizados.',
        '(11) 96666-3456',
        'carlos@exemplo.com',
        'Rua da Tecnologia, 321 - São Paulo, SP',
        'https://carlostech.dev',
        '@carlos_dev',
        '',
        'Carlos Tech Channel'
    );
