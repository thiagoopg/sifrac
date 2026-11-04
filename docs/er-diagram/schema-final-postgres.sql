-- =====================================================
-- SCHEMA FINAL PostgreSQL — Atividades Complementares IFRS
-- Baseado em: docs/reunioes/teste.md (11/09/2026)
-- Banco: PostgreSQL 15+
-- =====================================================

-- Enums
CREATE TYPE user_profile AS ENUM ('ADMINISTRADOR', 'COORDENADOR', 'ALUNO');
CREATE TYPE request_status AS ENUM ('PENDENTE', 'DEFERIDO', 'INDEFERIDO', 'CANCELADO');

-- Tabelas
CREATE TABLE campus (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    sigla VARCHAR(10) NOT NULL UNIQUE,
    cidade VARCHAR(80) NOT NULL,
    uf CHAR(2) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grau_curso (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuario (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    login_ldap VARCHAR(100) NOT NULL UNIQUE,
    perfil user_profile NOT NULL DEFAULT 'ALUNO',
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE curso (
    id BIGSERIAL PRIMARY KEY,
    campus_id BIGINT NOT NULL REFERENCES campus(id) ON DELETE RESTRICT,
    grau_id BIGINT NOT NULL REFERENCES grau_curso(id),
    nome VARCHAR(150) NOT NULL,
    carga_horaria_ac_exigida INTEGER NOT NULL DEFAULT 0,
    email_coordenacao VARCHAR(150) NOT NULL UNIQUE,
    coordenador_id BIGINT NULL REFERENCES usuario(id) ON DELETE SET NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campus_id, nome)
);

CREATE TABLE tipo_hora_complementar (
    id BIGSERIAL PRIMARY KEY,
    curso_id BIGINT NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    carga_horaria_maxima INTEGER NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(curso_id, nome)
);

CREATE TABLE aluno (
    usuario_id BIGINT PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
    curso_id BIGINT NOT NULL REFERENCES curso(id) ON DELETE RESTRICT,
    matricula VARCHAR(30) NOT NULL UNIQUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE solicitacao_hora_complementar (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL REFERENCES aluno(usuario_id) ON DELETE CASCADE,
    tipo_hora_id BIGINT NOT NULL REFERENCES tipo_hora_complementar(id) ON DELETE RESTRICT,
    horas_solicitadas INTEGER NOT NULL DEFAULT 0,
    horas_deferidas INTEGER NULL,
    status request_status NOT NULL DEFAULT 'PENDENTE',
    justificativa_coordenador TEXT NULL,
    coordenador_id BIGINT NULL REFERENCES usuario(id) ON DELETE SET NULL,
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_avaliacao TIMESTAMP NULL
);

CREATE TABLE anexo_solicitacao (
    id BIGSERIAL PRIMARY KEY,
    solicitacao_id BIGINT NOT NULL REFERENCES solicitacao_hora_complementar(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    url_arquivo TEXT NOT NULL,
    tamanho_bytes BIGINT NULL,
    enviado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notificacao (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    solicitacao_id BIGINT NULL REFERENCES solicitacao_hora_complementar(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT NOT NULL,
    lida BOOLEAN NOT NULL DEFAULT false,
    enviada_por_email BOOLEAN NOT NULL DEFAULT false,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_usuario_login_ldap ON usuario(login_ldap);
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_perfil ON usuario(perfil);
CREATE INDEX idx_curso_campus ON curso(campus_id);
CREATE INDEX idx_curso_grau ON curso(grau_id);
CREATE INDEX idx_curso_coordenador ON curso(coordenador_id);
CREATE INDEX idx_tipo_hora_curso ON tipo_hora_complementar(curso_id);
CREATE INDEX idx_aluno_curso ON aluno(curso_id);
CREATE INDEX idx_aluno_matricula ON aluno(matricula);
CREATE INDEX idx_solicitacao_aluno ON solicitacao_hora_complementar(aluno_id);
CREATE INDEX idx_solicitacao_status ON solicitacao_hora_complementar(status);
CREATE INDEX idx_solicitacao_tipo ON solicitacao_hora_complementar(tipo_hora_id);
CREATE INDEX idx_anexo_solicitacao ON anexo_solicitacao(solicitacao_id);
CREATE INDEX idx_notificacao_usuario ON notificacao(usuario_id);
CREATE INDEX idx_notificacao_lida ON notificacao(usuario_id, lida);

-- =====================================================
-- DADOS INICIAIS (SEED) PARA TESTES
-- =====================================================

-- Campi
INSERT INTO campus (nome, sigla, cidade, uf) VALUES
('Porto Alegre', 'POA', 'Porto Alegre', 'RS'),
('Nova Porto Alegre', 'NPOA', 'Porto Alegre', 'RS'),
('Canoas', 'CAN', 'Canoas', 'RS');

-- Graus de curso
INSERT INTO grau_curso (nome, descricao) VALUES
('Tecnológico', 'Curso de tecnologia (licenciatura ou bacharelado tecnológico)'),
('Licenciatura', 'Curso de formação pedagógica para docência'),
('Bacharelado', 'Curso de bacharelado pleno');

-- Usuários
INSERT INTO usuario (nome, email, login_ldap, perfil) VALUES
('Administrador do Sistema', 'admin@ifrs.edu.br', 'admin', 'ADMINISTRADOR'),
('Marcelo Augusto Rauh Schmitt', 'marcelo.schmitt@ifrs.edu.br', 'marceloschmitt', 'COORDENADOR'),
('Thiago Adriel Oliveira de Lima', 'thiago.a.o.lima@gmail.com', 'thiagolima', 'ALUNO'),
('Maria Silva Santos', 'maria.silva@ifrs.edu.br', 'mariasilva', 'ALUNO'),
('João Pedro Costa', 'joao.costa@ifrs.edu.br', 'joaopedro', 'ALUNO');

-- Cursos
INSERT INTO curso (nome, campus_id, grau_id, carga_horaria_ac_exigida, email_coordenacao) VALUES
('Tecnologia em Sistemas para Internet', 1, 1, 180, 'tsi.coordenacao@ifrs.edu.br'),
('Tecnologia em Análise e Desenvolvimento de Sistemas', 1, 1, 180, 'tads.coordenacao@ifrs.edu.br'),
('Tecnologia em Gestão de Tecnologia da Informação', 1, 1, 120, 'tgti.coordenacao@ifrs.edu.br'),
('Tecnologia em Redes de Computadores', 2, 1, 140, 'trc.coordenacao@ifrs.edu.br');

-- Vincular coordenador ao curso 1
UPDATE curso SET coordenador_id = 2 WHERE id = 1;

-- Alunos
INSERT INTO aluno (usuario_id, curso_id, matricula) VALUES
(3, 1, '2024101001'),
(4, 1, '2024101002'),
(5, 2, '2024102001');

-- Tipos de Hora Complementar para o Curso 1 (TSI)
INSERT INTO tipo_hora_complementar (curso_id, nome, descricao, carga_horaria_maxima) VALUES
(1, 'Curso de Extensão', 'Cursos de extensão e livres oferecidos pelo IFRS ou instituições parceiras', 40),
(1, 'Participação em Eventos', 'Participação em eventos, congressos, seminários e workshops', 30),
(1, 'Projeto de Pesquisa', 'Projetos de pesquisa científicos desenvolvidos junto a grupos de pesquisa', 40),
(1, 'Monitoria', 'Exercício de monitoria acadêmica em disciplinas do curso', 60),
(1, 'Publicação Científica', 'Publicações científicas e artigos em eventos ou periódicos', 20),
(1, 'Extensão Comunitária', 'Atividades de extensão comunitária e projetos sociais', 20),
(1, 'Experiência Profissional', 'Estágio, residência ou outra experiência profissional na área', 40);

-- Tipos de Hora Complementar para o Curso 2 (TADS)
INSERT INTO tipo_hora_complementar (curso_id, nome, descricao, carga_horaria_maxima) VALUES
(2, 'Curso de Extensão', 'Cursos de extensão e livres oferecidos pelo IFRS ou instituições parceiras', 40),
(2, 'Participação em Eventos', 'Participação em eventos, congressos, seminários e workshops', 30),
(2, 'Projeto de Pesquisa', 'Projetos de pesquisa científicos desenvolvidos junto a grupos de pesquisa', 40),
(2, 'Monitoria', 'Exercício de monitoria acadêmica em disciplinas do curso', 60),
(2, 'Publicação Científica', 'Publicações científicas e artigos em eventos ou periódicos', 20),
(2, 'Extensão Comunitária', 'Atividades de extensão comunitária e projetos sociais', 20),
(2, 'Experiência Profissional', 'Estágio, residência ou outra experiência profissional na área', 40);

-- Solicitações de teste
INSERT INTO solicitacao_hora_complementar (aluno_id, tipo_hora_id, horas_solicitadas, status, justificativa_coordenador, coordenador_id, data_solicitacao, data_avaliacao) VALUES
-- Solicitação do aluno 1 (Thiago) - Curso de Extensão - APROVADA
(1, 1, 40, 'DEFERIDO', 'Curso de extensão em Java EE aprovado. Carga horária compatível com o relatório apresentado.', 2, '2026-08-15 10:00:00', '2026-08-20 14:30:00'),
-- Solicitação do aluno 1 - Participação em Evento - PENDENTE
(1, 2, 20, 'PENDENTE', NULL, NULL, '2026-09-01 09:00:00', NULL),
-- Solicitação do aluno 2 (Maria) - Projeto de Pesquisa - REJEITADA
(2, 3, 30, 'INDEFERIDO', 'Documento comprobatório insuficiente. Não foi possível verificar a participação no projeto de pesquisa.', 2, '2026-08-10 11:00:00', '2026-08-15 16:00:00'),
-- Solicitação do aluno 3 (João) - Monitoria - DEFERIDO parcialmente
(3, 4, 60, 'DEFERIDO', 'Monitoria aprovada por 40 horas (metade do período solicitado). Justificativa: carga horária máxima permitida pelo edital.', NULL, '2026-07-20 08:00:00', '2026-07-25 10:00:00');

-- Anexos de teste
INSERT INTO anexo_solicitacao (solicitacao_id, nome_arquivo, url_arquivo, tamanho_bytes) VALUES
(1, 'certificado_java_ee.pdf', '/uploads/1/certificado_java_ee.pdf', 245760),
(1, 'relatorio_curso.pdf', '/uploads/1/relatorio_curso.pdf', 189440),
(2, 'comprovante_evento.pdf', '/uploads/2/comprovante_evento.pdf', 156672),
(3, 'declaracao_incompleta.pdf', '/uploads/3/declaracao_incompleto.pdf', 98304),
(4, 'declaracao_monitoria.pdf', '/uploads/4/declaracao_monitoria.pdf', 204800);

-- Notificações de teste
INSERT INTO notificacao (usuario_id, solicitacao_id, titulo, mensagem, enviada_por_email, criado_em) VALUES
-- Notificação para o coordenador (Marcelo) sobre nova solicitação
(2, 2, 'Nova solicitação de horas complementares', 'O aluno Thiago Adriel Oliveira de Lima abriu uma solicitação de 20 horas para Participação em Eventos. Verifique na tela de avaliações.', true, '2026-09-01 09:05:00'),
-- Notificação para o aluno (Thiago) sobre aprovação
(3, 1, 'Solicitação aprovada', 'Sua solicitação de Curso de Extensão foi aprovada com 40 horas deferidas.', true, '2026-08-20 14:35:00'),
-- Notificação para o aluno (Maria) sobre rejeição
(4, 3, 'Solicitação indeferida', 'Sua solicitação de Projeto de Pesquisa foi indeferida. Verifique as observações do coordenador.', true, '2026-08-15 16:05:00');
