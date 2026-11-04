-- =====================================================
-- FLYWAY MIGRATION V2__seed_data.sql
-- Atividades Complementares IFRS
-- Descrição: Dados iniciais para desenvolvimento
-- =====================================================

-- Campi iniciais
INSERT INTO campus (nome, codigo, endereco) VALUES
('Porto Alegre', 'POA', 'Av. Cel. Vicente, 281 - Santana, Porto Alegre - RS'),
('Nova Porto Alegre', 'NPOA', 'Rua XX, 123 - Nova Porto Alegre - RS'),
('Canoas', 'CAN', 'Av. Indaleno de Castro, 1000 - Centro, Canoas - RS');

-- Cursos iniciais
INSERT INTO curso (nome, campus_id, carga_horaria_total_requerida) VALUES
('Tecnologia em Sistemas para Internet', 1, 180),
('Tecnologia em Análise e Desenvolvimento de Sistemas', 1, 180),
('Tecnologia em Gestão de Tecnologia da Informação', 1, 120),
('Tecnologia em Redes de Computadores', 2, 140);

-- Usuário admin (senha: demo)
-- Hash BCrypt para 'demo': $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO usuario (username, nome_completo, email, cpf, senha, role) VALUES
('admin', 'Administrador do Sistema', 'admin@ifrs.edu.br', '12345678901', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Coordenador teste (sem senha = LDAP)
INSERT INTO usuario (username, nome_completo, email, cpf, senha, role, campus_id, curso_id) VALUES
('marceloschmitt', 'Marcelo Augusto Rauh Schmitt', 'marcelo.schmitt@ifrs.edu.br', '11122233344', NULL, 'COORDINATOR', 1, 1);

-- Aluno teste (senha: demo)
INSERT INTO usuario (username, nome_completo, email, cpf, senha, role, campus_id, curso_id) VALUES
('thiagolima', 'Thiago Adriel Oliveira de Lima', 'thiago.a.o.lima@gmail.com', '55566677788', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT', 1, 1);

-- Vincular coordenador ao curso
UPDATE curso SET coordenador_id = 2 WHERE id = 1;

-- Preferências de atividade para o curso 1 (TSI)
INSERT INTO preferencia_atividade (curso_id, tipo_atividade, horas_maximas, descricao) VALUES
(1, 'COURSE', 40, 'Cursos de extensão e livres'),
(1, 'EVENT', 30, 'Participação em eventos, congressos, seminários'),
(1, 'RESEARCH', 40, 'Projetos de pesquisa científicos'),
(1, 'MONITORING', 60, 'Exercício de monitoria acadêmica'),
(1, 'PUBLICATION', 20, 'Publicações científicas e artigos'),
(1, 'EXTENSION', 20, 'Atividades de extensão comunitária'),
(1, 'PROFESSIONAL', 40, 'Experiência profissional na área');

-- Preferências de atividade para o curso 2 (TADS)
INSERT INTO preferencia_atividade (curso_id, tipo_atividade, horas_maximas, descricao) VALUES
(2, 'COURSE', 40, 'Cursos de extensão e livres'),
(2, 'EVENT', 30, 'Participação em eventos, congressos, seminários'),
(2, 'RESEARCH', 40, 'Projetos de pesquisa científicos'),
(2, 'MONITORING', 60, 'Exercício de monitoria acadêmica'),
(2, 'PUBLICATION', 20, 'Publicações científicas e artigos'),
(2, 'EXTENSION', 20, 'Atividades de extensão comunitária'),
(2, 'PROFESSIONAL', 40, 'Experiência profissional na área');
