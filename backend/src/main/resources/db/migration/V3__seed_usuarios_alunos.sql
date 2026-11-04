-- =====================================================
-- SEED: USUÁRIOS E ALUNOS
-- =====================================================

-- =====================================================
-- USUÁRIOS
-- =====================================================
INSERT INTO usuario (nome, email, login_ldap, perfil) VALUES
('Administrador do Sistema', 'admin@ifrs.edu.br', 'admin', 'ADMINISTRADOR'),
('Coordenador de Campus POA', 'coord.poa@ifrs.edu.br', 'coordpoa', 'ADMIN_CAMPUS'),
('Marcelo Augusto Rauh Schmitt', 'marcelo.schmitt@ifrs.edu.br', 'marceloschmitt', 'COORDENADOR'),
('Thiago Adriel Oliveira de Lima', 'thiago.a.o.lima@gmail.com', 'thiagolima', 'ALUNO'),
('Maria Silva Santos', 'maria.santos@ifrs.edu.br', 'mariasantos', 'ALUNO'),
('João Pedro Oliveira', 'joao.oliveira@ifrs.edu.br', 'joaooliveira', 'ALUNO'),
('Ana Paula Ferreira', 'ana.ferreira@ifrs.edu.br', 'anaferreira', 'COORDENADOR'),
('Carlos Eduardo Mendes', 'carlos.mendes@ifrs.edu.br', 'carlosmendes', 'COORDENADOR'),
('Juliana Costa Ribeiro', 'juliana.ribeiro@ifrs.edu.br', 'julianaribeiro', 'COORDENADOR');

-- =====================================================
-- VÍNCULO DO ADMIN DE CAMPUS
-- =====================================================
UPDATE usuario SET campus_id = 1 WHERE login_ldap = 'coordpoa';

-- =====================================================
-- VÍNCULO DE COORDENADORES COM CURSOS
-- =====================================================
UPDATE curso SET coordenador_id = 3 WHERE id = 1;
UPDATE curso SET coordenador_id = 7 WHERE id = 2;
UPDATE curso SET coordenador_id = 8 WHERE id = 3;
UPDATE curso SET coordenador_id = 9 WHERE id = 4;

-- =====================================================
-- ALUNOS
-- =====================================================
INSERT INTO aluno (usuario_id, curso_id, matricula) VALUES
(4, 1, '2024101001'),
(5, 2, '2024102001'),
(6, 1, '2024101002');
