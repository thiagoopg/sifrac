-- =====================================================
-- V1 — CREATE SCHEMA — Atividades Complementares SIFRAC
-- Banco: PostgreSQL 16+ (Produção/Desenvolvimento)
-- Migrado de H2 → PostgreSQL
-- =====================================================

-- Enum para status das solicitações
CREATE TYPE REQUEST_STATUS AS ENUM ('PENDENTE', 'DEFERIDO', 'INDEFERIDO', 'CANCELADO');

-- Tabelas
CREATE TABLE campus (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    cidade VARCHAR(80) NOT NULL,
    uf VARCHAR(2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grau_curso (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(500) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    login_ldap VARCHAR(100) NOT NULL UNIQUE,
    perfil VARCHAR(50) NOT NULL DEFAULT 'ALUNO',
    campus_id BIGINT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_campus FOREIGN KEY (campus_id) REFERENCES campus(id)
);

CREATE TABLE curso (
    id BIGSERIAL PRIMARY KEY,
    campus_id BIGINT NOT NULL,
    grau_id BIGINT NOT NULL,
    nome VARCHAR(150) NOT NULL,
    carga_horaria_ac_exigida INTEGER NOT NULL DEFAULT 0,
    email_coordenacao VARCHAR(150) NOT NULL UNIQUE,
    coordenador_id BIGINT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_curso_campus FOREIGN KEY (campus_id) REFERENCES campus(id),
    CONSTRAINT fk_curso_grau FOREIGN KEY (grau_id) REFERENCES grau_curso(id),
    CONSTRAINT fk_curso_coordenador FOREIGN KEY (coordenador_id) REFERENCES usuario(id)
);

CREATE TABLE tipo_hora_complementar (
    id BIGSERIAL PRIMARY KEY,
    curso_id BIGINT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NULL,
    carga_horaria_maxima DECIMAL(5,2) NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tipohora_curso FOREIGN KEY (curso_id) REFERENCES curso(id)
);

CREATE TABLE aluno (
    id BIGINT NOT NULL,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    curso_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aluno_curso FOREIGN KEY (curso_id) REFERENCES curso(id),
    CONSTRAINT fk_aluno_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT pk_aluno PRIMARY KEY (id)
);

CREATE TABLE solicitacao_hora_complementar (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    tipo_id BIGINT NOT NULL,
    descricao_atividades TEXT NOT NULL,
    data_atividade DATE NOT NULL,
    horas_solicitadas DECIMAL(5,2) NOT NULL,
    status REQUEST_STATUS NOT NULL DEFAULT 'PENDENTE',
    observacao_coordenacao TEXT NULL,
    deferido_por_id BIGINT NULL,
    deferido_em TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_solicitacao_aluno FOREIGN KEY (aluno_id) REFERENCES aluno(id),
    CONSTRAINT fk_solicitacao_tipo FOREIGN KEY (tipo_id) REFERENCES tipo_hora_complementar(id),
    CONSTRAINT fk_solicitacao_deferido FOREIGN KEY (deferido_por_id) REFERENCES usuario(id)
);

CREATE TABLE anexo (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho_arquivo VARCHAR(500) NOT NULL,
    tipo_conteudo VARCHAR(100) NULL,
    tamanho_bytes BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_anexo_solicitacao FOREIGN KEY (solicitacao_id) REFERENCES solicitacao_hora_complementar(id)
);

CREATE TABLE notificacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT FALSE,
    tipo VARCHAR(50) NOT NULL DEFAULT 'INFO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacao_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE request_audit (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NULL,
    acao VARCHAR(50) NOT NULL,
    entidade VARCHAR(100) NOT NULL,
    entidade_id BIGINT NULL,
    detalhes TEXT NULL,
    ip_cliente VARCHAR(50) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

-- Índices para performance
CREATE INDEX idx_solicitacao_aluno ON solicitacao_hora_complementar(aluno_id);
CREATE INDEX idx_solicitacao_status ON solicitacao_hora_complementar(status);
CREATE INDEX idx_anexo_solicitacao ON anexo(solicitacao_id);
CREATE INDEX idx_notificacao_usuario ON notificacao(usuario_id);
CREATE INDEX idx_usuario_campus ON usuario(campus_id);
CREATE INDEX idx_usuario_login_ldap ON usuario(login_ldap);
CREATE INDEX idx_aluno_matricula ON aluno(matricula);
CREATE INDEX idx_aluno_curso ON aluno(curso_id);