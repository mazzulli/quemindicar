-- Inserir dados adicionais para simular um dashboard mais realista

-- Adicionar mais prestadores para ter dados suficientes
INSERT INTO prestadores (titulo, subtitulo, categoria_id, descricao, telefone, email, endereco, site, instagram, facebook, youtube) VALUES 
    ('Fernanda Design', 'Designer Gráfica', 6, 'Criação de identidade visual, logos e materiais gráficos para empresas e profissionais liberais.', '(11) 95555-1111', 'fernanda@exemplo.com', 'Rua do Design, 100 - São Paulo, SP', 'https://fernandadesign.com', '@fernanda_design', 'Fernanda Design Studio', ''),
    ('Roberto Foto', 'Fotógrafo Profissional', 7, 'Fotografia de eventos, casamentos, ensaios e produtos. Especialista em fotografia social e comercial.', '(11) 94444-2222', 'roberto@exemplo.com', 'Av. da Fotografia, 200 - São Paulo, SP', 'https://robertofoto.com.br', '@roberto_fotografo', 'Roberto Fotografia', 'Roberto Foto Channel'),
    ('Lucia Eventos', 'Organizadora de Eventos', 8, 'Organização completa de eventos corporativos, casamentos, festas e celebrações especiais.', '(11) 93333-3333', 'lucia@exemplo.com', 'Rua dos Eventos, 300 - São Paulo, SP', '', '@lucia_eventos', 'Lucia Eventos & Festas', ''),
    ('Pedro Consultor', 'Consultor Empresarial', 5, 'Consultoria em gestão empresarial, planejamento estratégico e desenvolvimento organizacional.', '(11) 92222-4444', 'pedro@exemplo.com', 'Av. Empresarial, 400 - São Paulo, SP', 'https://pedroconsultor.com.br', '@pedro_consultor', '', 'Pedro Business Channel'),
    ('Amanda Spa', 'Terapeuta Holística', 2, 'Terapias alternativas, massagens relaxantes, reiki e tratamentos holísticos para bem-estar.', '(11) 91111-5555', 'amanda@exemplo.com', 'Rua da Paz, 500 - São Paulo, SP', 'https://amandaspa.com', '@amanda_spa', 'Amanda Spa & Terapias', ''),
    ('Ricardo Code', 'Programador Mobile', 4, 'Desenvolvimento de aplicativos móveis para iOS e Android. Especialista em React Native e Flutter.', '(11) 90000-6666', 'ricardo@exemplo.com', 'Rua do Código, 600 - São Paulo, SP', 'https://ricardocode.dev', '@ricardo_dev', '', 'Ricardo Mobile Dev');

-- Inserir mais avaliações para enriquecer os dados
INSERT INTO avaliacoes (prestador_id, nome_avaliador, rating, comentario) VALUES 
    -- Fernanda Design (id 5)
    (5, 'Marcos Silva', 5, 'Design incrível! Superou todas as minhas expectativas.'),
    (5, 'Julia Santos', 4, 'Muito criativa e profissional. Recomendo!'),
    (5, 'Rafael Costa', 5, 'Trabalho impecável, entrega no prazo combinado.'),
    
    -- Roberto Foto (id 6)
    (6, 'Camila Oliveira', 4, 'Fotografias lindas do meu casamento. Muito satisfeita!'),
    (6, 'Bruno Lima', 5, 'Profissional excepcional, captou momentos únicos.'),
    (6, 'Patrícia Alves', 4, 'Ótimo trabalho, fotos de qualidade excelente.'),
    
    -- Lucia Eventos (id 7)
    (7, 'Eduardo Mendes', 4, 'Evento organizado perfeitamente, sem nenhum problema.'),
    (7, 'Isabela Costa', 5, 'Superou todas as expectativas! Festa incrível.'),
    
    -- Pedro Consultor (id 8)
    (8, 'Rodrigo Silva', 4, 'Consultoria muito útil para minha empresa.'),
    (8, 'Vanessa Santos', 4, 'Profissional competente e experiente.'),
    
    -- Amanda Spa (id 9)
    (9, 'Leticia Oliveira', 5, 'Massagem relaxante incrível! Me senti renovada.'),
    (9, 'Gabriel Lima', 4, 'Ambiente tranquilo e tratamento excelente.'),
    
    -- Ricardo Code (id 10)
    (10, 'Thiago Alves', 4, 'App desenvolvido conforme solicitado, bom trabalho.'),
    (10, 'Priscila Costa', 4, 'Desenvolvedor competente e pontual nas entregas.');

-- Simular dados de acessos (seria implementado com analytics real)
-- Aqui apenas criamos uma tabela temporária para demonstração
CREATE TEMP TABLE temp_acessos AS
SELECT 
    p.id as prestador_id,
    (RANDOM() * 1000 + 100)::INTEGER as total_acessos,
    (RANDOM() * 30 - 10)::DECIMAL(4,1) as crescimento_mensal
FROM prestadores p;
