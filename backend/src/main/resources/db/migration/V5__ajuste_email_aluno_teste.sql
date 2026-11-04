-- =====================================================
-- Ajuste do e-mail do aluno de teste
-- =====================================================
-- Utilizado para validar o envio de e-mail de retorno da avaliacao.
-- O e-mail pode ser alterado novamente pela tela de usuarios.
UPDATE usuario
SET email = '2024009471@aluno.poa.ifrs.edu.br'
WHERE login_ldap = 'thiagolima';
