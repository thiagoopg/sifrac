-- =====================================================
-- SEED: TIPOS DE HORA COMPLEMENTAR
-- Separado por curso
-- =====================================================

-- =====================================================
-- CURSO 1 - TECNOLOGIA EM SISTEMAS PARA INTERNET (CAMPUS PORTO ALEGRE)
-- Conforme Tabela 3: Atividades Complementares
-- =====================================================
INSERT INTO tipo_hora_complementar (
    curso_id,
    nome,
    descricao,
    carga_horaria_maxima
) VALUES
(
    1,
    'Participação em Eventos',
    'Participação em evento (congresso, seminário, simpósio, workshop, palestra, conferência, feira) e similar, de natureza acadêmica ou profissional. 1 hora de participação equivale a 1 hora de AC. Comprobatório: Atestado ou certificado expedido pela instituição promotora do evento.',
    30
),
(
    1,
    'Curso de Extensão',
    'Participação em curso (oficina, minicurso, extensão, capacitação, treinamento) e similar, de natureza acadêmica ou profissional. 1 hora de participação equivale a 1 hora de AC. Comprobatório: Atestado ou certificado expedido pela instituição responsável pelo curso.',
    30
),
(
    1,
    'Curso de Língua Estrangeira',
    'Participação em curso de língua estrangeira. 1 hora de participação equivale a 1 hora de AC. Comprobatório: Atestado ou diploma expedido pela instituição responsável pelo curso.',
    30
),
(
    1,
    'Componente Curricular não Aproveitado',
    'Componente Curricular não aproveitado de curso afim. 1 hora/aula equivale a 1 hora de AC. Comprobatório: Histórico escolar acompanhado da ementa do componente.',
    60
),
(
    1,
    'Estágio Extracurricular',
    'Estágio extra-curricular. 1 hora de participação equivale a 1 hora de AC. Comprobatório: Atestado de frequência emitido pelo supervisor de estágio.',
    30
),
(
    1,
    'Monitoria',
    'Atividade de monitoria de componentes curriculares relacionados à área do curso. 16 semanas de participação equivalem a 30 horas de AC. Comprobatório: Atestado de frequência emitido pelo professor responsável pelo componente curricular.',
    30
),
(
    1,
    'Iniciação Científica',
    'Atividade como pesquisador de iniciação científica. 16 semanas de participação equivalem a 30 horas de AC. Comprobatório: Atestado de frequência emitido pelo professor responsável pelo projeto de pesquisa.',
    30
),
(
    1,
    'Projetos de Voluntariado',
    'Participação em projetos de voluntariado. 1 hora de participação equivale a 1 hora de AC. Comprobatório: Atestado de frequência emitido pelo professor responsável pelo projeto.',
    30
),
(
    1,
    'Comissão Organizadora de Evento',
    'Participação em comissão organizadora de evento e similar. 1 hora de participação equivale a 1 hora de AC. Comprobatório: Atestado de frequência emitido pelo professor responsável pelo evento.',
    30
),
(
    1,
    'Apresentação de Trabalho Científico',
    'Apresentação de trabalho científico (inclusive pôster) em evento de âmbito regional, nacional ou internacional, como autor ou co-autor. 1 apresentação equivale a 10 horas de AC. Comprobatório: Certificado de participação emitido pela instituição promotora do evento.',
    30
),
(
    1,
    'Publicação em Anais de Evento Científico',
    'Publicação de artigo científico ou resumo em anais de evento científico como autor ou coautor. 1 publicação equivale a 15 horas de AC. Comprobatório: Cópia da publicação ou certificado de participação emitido pela instituição promotora do evento.',
    30
),
(
    1,
    'Publicação em Periódico Especializado',
    'Publicação de artigo científico completo (artigo efetivamente publicado ou com aceite final de publicação) em periódico especializado, com comissão editorial, como autor ou coautor. 1 publicação equivale a 30 horas de AC. Comprobatório: Cópia da publicação ou certificado de participação emitido pela instituição promotora do evento.',
    30
),
(
    1,
    'Prêmios e Distinções',
    'Obtenção de prêmios e distinções na área do curso. 1 prêmio equivale a 10 horas de AC. Comprobatório: Cópia do certificado de premiação.',
    30
),
(
    1,
    'Ouvinte em Banca',
    'Ouvinte em banca de TCC, mestrado e doutorado. Cada banca equivale a 1 hora de AC. Comprobatório: Atestado de participação emitido pelo coordenador de TCC ou do programa de pós-graduação.',
    30
),
(
    1,
    'Grupos de Estudos',
    'Participação em grupos de estudos. 16 semanas de participação equivalem a 30 horas de AC. Comprobatório: Atestado de frequência emitido pelo professor responsável pelo grupo.',
    30
),
(
    1,
    'Certificação Profissional',
    'Certificação profissional na área do curso. 1 certificação equivale a 10 horas de AC. Comprobatório: Cópia do certificado emitido pela instituição certificadora.',
    30
),
(
    1,
    'Registro de Software',
    'Registro de software. Cada registro equivale a 30 horas de AC. Comprobatório: Cópia do certificado de registro junto ao INPI.',
    30
),
(
    1,
    'Patente',
    'Patente (marca, desenho, topografia). Cada patente equivale a 30 horas de AC. Comprobatório: Cópia do certificado de registro junto ao INPI.',
    30
);

-- =====================================================
-- CURSO 2 - TADS (PARA NÃO QUEBRAR TESTES)
-- =====================================================
INSERT INTO tipo_hora_complementar (
    curso_id,
    nome,
    descricao,
    carga_horaria_maxima
) VALUES
(2, 'Curso de Extensão', 'Cursos de extensão e livres oferecidos pelo IFRS ou instituições parceiras', 40),
(2, 'Participação em Eventos', 'Participação em eventos, congressos, seminários e workshops', 30),
(2, 'Projeto de Pesquisa', 'Projetos de pesquisa científicos desenvolvidos junto a grupos de pesquisa', 40),
(2, 'Monitoria', 'Exercício de monitoria acadêmica em disciplinas do curso', 60),
(2, 'Publicação Científica', 'Publicações científicas e artigos en eventos ou periódicos', 20),
(2, 'Extensão Comunitária', 'Atividades de extension comunitária e projetos sociais', 20),
(2, 'Experiência Profissional', 'Estágio, residência ou outra experiência profissional na área', 40);

-- =====================================================
-- CURSO 3 - TGTI
-- =====================================================
INSERT INTO tipo_hora_complementar (
    curso_id,
    nome,
    descricao,
    carga_horaria_maxima
) VALUES
(3, 'Curso de Extensão', 'Cursos de extensão e livres oferecidos pelo IFRS ou instituições parceiras', 40),
(3, 'Participação em Eventos', 'Participação em eventos, congressos, seminários e workshops', 30),
(3, 'Projeto de Pesquisa', 'Projetos de pesquisa científicos desenvolvidos junto a grupos de pesquisa', 40),
(3, 'Monitoria', 'Exercício de monitoria acadêmica em disciplinas do curso', 60),
(3, 'Publicação Científica', 'Publicações científicas e artigos en eventos ou periódicos', 20),
(3, 'Extensão Comunitária', 'Atividades de extension comunitária e projetos sociais', 20),
(3, 'Experiência Profissional', 'Estágio, residência ou outra experiência profissional na área', 40);

-- =====================================================
-- CURSO 4 - TRC
-- =====================================================
INSERT INTO tipo_hora_complementar (
    curso_id,
    nome,
    descricao,
    carga_horaria_maxima
) VALUES
(4, 'Curso de Extensão', 'Cursos de extensão e livres oferecidos pelo IFRS ou instituições parceiras', 40),
(4, 'Participação em Eventos', 'Participação em eventos, congressos, seminários e workshops', 30),
(4, 'Projeto de Pesquisa', 'Projetos de pesquisa científicos desenvolvidos junto a grupos de pesquisa', 40),
(4, 'Monitoria', 'Exercício de monitoria acadêmica em disciplinas do curso', 60),
(4, 'Publicação Científica', 'Publicações científicas e artigos en eventos ou periódicos', 20),
(4, 'Extensão Comunitária', 'Atividades de extension comunitária e projetos sociais', 20),
(4, 'Experiência Profissional', 'Estágio, residência ou outra experiência profissional na área', 40);
