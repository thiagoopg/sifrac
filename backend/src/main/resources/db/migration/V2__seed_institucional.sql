-- =====================================================
-- SEED: DADOS INSTITUCIONAIS
-- Campus, Grau de Curso e Cursos
-- =====================================================

-- =====================================================
-- CAMPUS
-- =====================================================
INSERT INTO campus (nome, sigla, cidade, uf) VALUES
('Campus Porto Alegre', 'POA', 'Porto Alegre', 'RS'),
('Campus Caxias do Sul', 'CAX', 'Caxias do Sul', 'RS'),
('Campus Bento Gonçalves', 'BGT', 'Bento Gonçalves', 'RS');

-- =====================================================
-- GRAUS DE CURSO
-- =====================================================
INSERT INTO grau_curso (nome, descricao) VALUES
('Tecnológico', 'Curso de tecnologia (licenciatura ou bacharelado tecnológico)'),
('Licenciatura', 'Curso de formação pedagógica para docência'),
('Bacharelado', 'Curso de bacharelado pleno');

-- =====================================================
-- CURSOS
-- =====================================================
INSERT INTO curso (
    nome,
    campus_id,
    grau_id,
    carga_horaria_ac_exigida,
    email_coordenacao
) VALUES
(
    'Tecnologia em Sistemas para Internet',
    1,
    1,
    180,
    'tsi.coordenacao@ifrs.edu.br'
),
(
    'Tecnologia em Análise e Desenvolvimento de Sistemas',
    1,
    1,
    180,
    'tads.coordenacao@ifrs.edu.br'
),
(
    'Tecnologia em Gestão de Tecnologia da Informação',
    1,
    1,
    120,
    'tgti.coordenacao@ifrs.edu.br'
),
(
    'Tecnologia em Redes de Computadores',
    2,
    1,
    140,
    'trc.coordenacao@ifrs.edu.br'
);
