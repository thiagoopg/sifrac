-- =====================================================
-- SEED: SOLICITACOES DE EXEMPLO
-- Aluno Thiago (id 1, curso 1) para testes de carga horaria
-- =====================================================
-- Tipo 1 = Participacao em Eventos (20h pendentes)
-- Tipo 2 = Curso de Extensao (40h deferidas)

INSERT INTO solicitacao_hora_complementar (
    aluno_id,
    tipo_id,
    horas_solicitadas,
    titulo,
    horas_deferidas,
    status,
    justificativa_coordenador,
    coordenador_id,
    data_solicitacao,
    data_avaliacao
) VALUES (
    1,
    2,
    40,
    'Curso de Extensao em Desenvolvimento Web',
    40,
    'DEFERIDO',
    'Atividade compativel com o projeto pedagogico do curso.',
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

INSERT INTO solicitacao_hora_complementar (
    aluno_id,
    tipo_id,
    horas_solicitadas,
    titulo,
    horas_deferidas,
    status,
    justificativa_coordenador,
    coordenador_id,
    data_solicitacao,
    data_avaliacao
) VALUES (
    1,
    1,
    20,
    'Participacao no Workshop de Tecnologia',
    NULL,
    'PENDENTE',
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    NULL
);
