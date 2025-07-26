-- View para estatísticas do dashboard
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM prestadores WHERE ativo = true) as total_prestadores,
    (SELECT COUNT(*) FROM categorias) as total_categorias,
    (SELECT ROUND(AVG(rating::DECIMAL), 2) FROM avaliacoes) as media_avaliacoes,
    (SELECT COUNT(*) FROM avaliacoes) as total_avaliacoes;

-- View para prestadores por categoria
CREATE OR REPLACE VIEW prestadores_por_categoria AS
SELECT 
    c.id,
    c.nome as categoria,
    COUNT(p.id) as total_prestadores,
    ROUND((COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM prestadores WHERE ativo = true)), 2) as percentual
FROM categorias c
LEFT JOIN prestadores p ON c.id = p.categoria_id AND p.ativo = true
GROUP BY c.id, c.nome
ORDER BY total_prestadores DESC;

-- View para ranking de prestadores mais acessados (simulado)
CREATE OR REPLACE VIEW ranking_mais_acessados AS
SELECT 
    p.id,
    p.titulo,
    p.subtitulo,
    c.nome as categoria,
    p.foto_url,
    -- Simulando acessos baseado em avaliações e outros fatores
    (COALESCE(av.total_avaliacoes, 0) * 10 + RANDOM() * 500)::INTEGER as acessos,
    (RANDOM() * 20 - 5)::DECIMAL(4,1) as crescimento_percentual
FROM prestadores p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN (
    SELECT prestador_id, COUNT(*) as total_avaliacoes
    FROM avaliacoes 
    GROUP BY prestador_id
) av ON p.id = av.prestador_id
WHERE p.ativo = true
ORDER BY acessos DESC
LIMIT 10;

-- View para ranking de melhor avaliados
CREATE OR REPLACE VIEW ranking_melhor_avaliados AS
SELECT 
    p.id,
    p.titulo,
    p.subtitulo,
    c.nome as categoria,
    p.foto_url,
    COALESCE(ROUND(AVG(av.rating::DECIMAL), 2), 0) as rating_medio,
    COALESCE(COUNT(av.id), 0) as total_avaliacoes,
    COALESCE(MAX(av.created_at), p.created_at) as ultima_avaliacao
FROM prestadores p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN avaliacoes av ON p.id = av.prestador_id
WHERE p.ativo = true
GROUP BY p.id, p.titulo, p.subtitulo, c.nome, p.foto_url, p.created_at
HAVING COUNT(av.id) > 0
ORDER BY rating_medio DESC, total_avaliacoes DESC
LIMIT 10;

-- Função para obter estatísticas mensais
CREATE OR REPLACE FUNCTION get_monthly_stats(mes INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE))
RETURNS TABLE(
    novos_prestadores INTEGER,
    novas_avaliacoes INTEGER,
    crescimento_prestadores DECIMAL(5,2),
    crescimento_avaliacoes DECIMAL(5,2)
) AS $$
DECLARE
    mes_atual INTEGER := mes;
    mes_anterior INTEGER := CASE WHEN mes = 1 THEN 12 ELSE mes - 1 END;
    ano_atual INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    ano_anterior INTEGER := CASE WHEN mes = 1 THEN ano_atual - 1 ELSE ano_atual END;
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM prestadores 
         WHERE EXTRACT(MONTH FROM created_at) = mes_atual 
         AND EXTRACT(YEAR FROM created_at) = ano_atual) as novos_prestadores,
        
        (SELECT COUNT(*)::INTEGER FROM avaliacoes 
         WHERE EXTRACT(MONTH FROM created_at) = mes_atual 
         AND EXTRACT(YEAR FROM created_at) = ano_atual) as novas_avaliacoes,
        
        -- Crescimento de prestadores
        CASE 
            WHEN (SELECT COUNT(*) FROM prestadores 
                  WHERE EXTRACT(MONTH FROM created_at) = mes_anterior 
                  AND EXTRACT(YEAR FROM created_at) = ano_anterior) > 0
            THEN ROUND(
                ((SELECT COUNT(*) FROM prestadores 
                  WHERE EXTRACT(MONTH FROM created_at) = mes_atual 
                  AND EXTRACT(YEAR FROM created_at) = ano_atual)::DECIMAL - 
                 (SELECT COUNT(*) FROM prestadores 
                  WHERE EXTRACT(MONTH FROM created_at) = mes_anterior 
                  AND EXTRACT(YEAR FROM created_at) = ano_anterior)::DECIMAL) * 100.0 / 
                (SELECT COUNT(*) FROM prestadores 
                 WHERE EXTRACT(MONTH FROM created_at) = mes_anterior 
                 AND EXTRACT(YEAR FROM created_at) = ano_anterior)::DECIMAL, 2)
            ELSE 0
        END as crescimento_prestadores,
        
        -- Crescimento de avaliações
        CASE 
            WHEN (SELECT COUNT(*) FROM avaliacoes 
                  WHERE EXTRACT(MONTH FROM created_at) = mes_anterior 
                  AND EXTRACT(YEAR FROM created_at) = ano_anterior) > 0
            THEN ROUND(
                ((SELECT COUNT(*) FROM avaliacoes 
                  WHERE EXTRACT(MONTH FROM created_at) = mes_atual 
                  AND EXTRACT(YEAR FROM created_at) = ano_atual)::DECIMAL - 
                 (SELECT COUNT(*) FROM avaliacoes 
                  WHERE EXTRACT(MONTH FROM created_at) = mes_anterior 
                  AND EXTRACT(YEAR FROM created_at) = ano_anterior)::DECIMAL) * 100.0 / 
                (SELECT COUNT(*) FROM avaliacoes 
                 WHERE EXTRACT(MONTH FROM created_at) = mes_anterior 
                 AND EXTRACT(YEAR FROM created_at) = ano_anterior)::DECIMAL, 2)
            ELSE 0
        END as crescimento_avaliacoes;
END;
$$ LANGUAGE plpgsql;
