-- =====================================================
-- FLYWAY MIGRATION V1__initial_schema.sql
-- Atividades Complementares IFRS
-- Descrição: Criação do schema inicial do banco de dados
-- =====================================================

-- Enums
CREATE TYPE user_role AS ENUM ('ADMIN', 'COORDINATOR', 'STUDENT');
CREATE TYPE activity_type AS ENUM ('COURSE', 'EVENT', 'RESEARCH', 'MONITORING', 'PUBLICATION', 'EXTENSION', 'PROFESSIONAL');
CREATE TYPE request_status AS ENUM ('PENDING', 'UNDER_ANALYSIS', 'APPROVED', 'REJECTED', 'COMPLEMENTATION_REQUESTED');

-- Tabelas
CREATE TABLE campus (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    endereco TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE curso (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    campus_id BIGINT NOT NULL REFERENCES campus(id) ON DELETE RESTRICT,
    carga_horaria_total_requerida INTEGER NOT NULL DEFAULT 0,
    coordenador_id BIGINT REFERENCES usuario(id) ON DELETE SET NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(nome, campus_id)
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(255),
    role user_role NOT NULL DEFAULT 'STUDENT',
    campus_id BIGINT REFERENCES campus(id) ON DELETE SET NULL,
    curso_id BIGINT REFERENCES curso(id) ON DELETE SET NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_cpf_format CHECK (cpf ~* '^\d{11}$')
);

CREATE TABLE preferencia_atividade (
    id BIGSERIAL PRIMARY KEY,
    curso_id BIGINT NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    tipo_atividade activity_type NOT NULL,
    horas_maximas INTEGER NOT NULL DEFAULT 0,
    descricao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(curso_id, tipo_atividade)
);

CREATE TABLE solicitacao_atividade (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tipo_atividade activity_type NOT NULL,
    status request_status NOT NULL DEFAULT 'PENDING',
    horas_solicitadas INTEGER NOT NULL DEFAULT 0,
    horas_aprovadas INTEGER DEFAULT 0,
    justificativa TEXT NOT NULL,
    coordenador_notas TEXT,
    analisado_por BIGINT REFERENCES usuario(id) ON DELETE SET NULL,
    analisado_em TIMESTAMP,
    solicitacao_anterior_id BIGINT REFERENCES solicitacao_atividade(id) ON DELETE SET NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_solicitacao (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL REFERENCES solicitacao_atividade(id) ON DELETE CASCADE,
    old_status request_status,
    new_status request_status,
    old_horas INTEGER,
    new_horas INTEGER,
    alterado_por BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT,
    observacao TEXT,
    enviado_email BOOLEAN NOT NULL DEFAULT false,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documento (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL REFERENCES solicitacao_atividade(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    nome_original VARCHAR(255) NOT NULL,
    caminho_servidor TEXT NOT NULL,
    tamanho_bytes BIGINT NOT NULL DEFAULT 0,
    tipo_mime VARCHAR(100),
    uploadado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploadado_por BIGINT NOT NULL REFERENCES usuario(id) ON DELETE RESTRICT
);

CREATE TABLE notificacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    lido BOOLEAN NOT NULL DEFAULT false,
    tipo VARCHAR(50) NOT NULL DEFAULT 'INFO',
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_usuario_username ON usuario(username);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_cpf ON usuario(cpf);
CREATE INDEX idx_usuario_role ON usuario(role);
CREATE INDEX idx_usuario_campus ON usuario(campus_id);
CREATE INDEX idx_usuario_curso ON usuario(curso_id);
CREATE INDEX idx_solicitacao_usuario ON solicitacao_atividade(usuario_id);
CREATE INDEX idx_solicitacao_status ON solicitacao_atividade(status);
CREATE INDEX idx_solicitacao_tipo ON solicitacao_atividade(tipo_atividade);
CREATE INDEX idx_audit_solicitacao ON audit_solicitacao(solicitacao_id);
CREATE INDEX idx_documento_solicitacao ON documento(solicitacao_id);
CREATE INDEX idx_notificacao_usuario ON notificacao(usuario_id);
CREATE INDEX idx_notificacao_lido ON notificacao(usuario_id, lido);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_campus_updated BEFORE UPDATE ON campus
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_curso_updated BEFORE UPDATE ON curso
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_usuario_updated BEFORE UPDATE ON usuario
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_preferencia_updated BEFORE UPDATE ON preferencia_atividade
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_solicitacao_updated BEFORE UPDATE ON solicitacao_atividade
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
