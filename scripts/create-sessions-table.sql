-- Tabela para gerenciar sessões de usuários
CREATE TABLE IF NOT EXISTS sessoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_sessoes_token ON sessoes(token);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario ON sessoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_expires ON sessoes(expires_at);

-- Função para limpar sessões expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sessoes WHERE expires_at < CURRENT_TIMESTAMP;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Função para criar nova sessão
CREATE OR REPLACE FUNCTION create_session(
    p_usuario_id INTEGER,
    p_token VARCHAR(255),
    p_expires_at TIMESTAMP,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    session_id INTEGER;
BEGIN
    -- Limpar sessões antigas do usuário (opcional - manter apenas uma sessão ativa)
    DELETE FROM sessoes WHERE usuario_id = p_usuario_id;
    
    -- Criar nova sessão
    INSERT INTO sessoes (usuario_id, token, expires_at, ip_address, user_agent)
    VALUES (p_usuario_id, p_token, p_expires_at, p_ip_address, p_user_agent)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql;

-- Função para validar sessão
CREATE OR REPLACE FUNCTION validate_session(p_token VARCHAR(255))
RETURNS TABLE(
    usuario_id INTEGER,
    nome VARCHAR(200),
    email VARCHAR(200),
    role VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.nome, u.email, u.role
    FROM sessoes s
    JOIN usuarios u ON s.usuario_id = u.id
    WHERE s.token = p_token 
    AND s.expires_at > CURRENT_TIMESTAMP
    AND u.ativo = true;
END;
$$ LANGUAGE plpgsql;
