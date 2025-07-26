-- Criação da tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de prestadores
CREATE TABLE IF NOT EXISTS prestadores (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    subtitulo VARCHAR(200),
    categoria_id INTEGER REFERENCES categorias(id),
    descricao TEXT,
    foto_url VARCHAR(500),
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(200) NOT NULL,
    endereco TEXT,
    site VARCHAR(300),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    youtube VARCHAR(100),
    linkedin VARCHAR(100),
    tiktok VARCHAR(100),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_prestadores_categoria ON prestadores(categoria_id);
CREATE INDEX IF NOT EXISTS idx_prestadores_ativo ON prestadores(ativo);
CREATE INDEX IF NOT EXISTS idx_prestadores_titulo ON prestadores(titulo);
