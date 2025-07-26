-- Criação da tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id SERIAL PRIMARY KEY,
    prestador_id INTEGER REFERENCES prestadores(id) ON DELETE CASCADE,
    nome_avaliador VARCHAR(200) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comentario TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_prestador ON avaliacoes(prestador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_rating ON avaliacoes(rating);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_created_at ON avaliacoes(created_at);

-- Função para calcular a média de avaliações
CREATE OR REPLACE FUNCTION calcular_media_avaliacoes(prestador_id_param INTEGER)
RETURNS DECIMAL(3,2) AS $$
DECLARE
    media DECIMAL(3,2);
BEGIN
    SELECT ROUND(AVG(rating::DECIMAL), 2) INTO media
    FROM avaliacoes 
    WHERE prestador_id = prestador_id_param;
    
    RETURN COALESCE(media, 0);
END;
$$ LANGUAGE plpgsql;

-- Função para contar total de avaliações
CREATE OR REPLACE FUNCTION contar_avaliacoes(prestador_id_param INTEGER)
RETURNS INTEGER AS $$
DECLARE
    total INTEGER;
BEGIN
    SELECT COUNT(*) INTO total
    FROM avaliacoes 
    WHERE prestador_id = prestador_id_param;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_avaliacoes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_avaliacoes_timestamp
    BEFORE UPDATE ON avaliacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_avaliacoes_timestamp();
