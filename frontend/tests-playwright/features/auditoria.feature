# language: pt
##Verificar tudo posteriormente na questão de auditoria, é o último dos últimos.
@auditoria
Funcionalidade: Auditoria de solicitações

  Como usuário autorizado
  Quero consultar o histórico das solicitações
  Para acompanhar as alterações realizadas durante seu processamento


  Regra: O histórico da solicitação deve registrar suas alterações

    Cenário: Solicitação registra seu cadastro no histórico
      Dado que estou autenticado como "Aluno"
      Quando cadastro uma solicitação de horas complementares
      Então o cadastro da solicitação deve ser registrado no histórico

    Cenário: Solicitação registra sua avaliação no histórico
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação pendente
      Quando avalio a solicitação
      Então a avaliação deve ser registrada no histórico

    #Cancelamento removido: nenhum perfil pode excluir/cancelar uma solicitação.
#    Cenário: Solicitação registra seu cancelamento no histórico
#      Dado que estou autenticado como Aluno
#      E existe uma solicitação que pode ser cancelada
#      Quando cancelo a solicitação
#      Então o cancelamento deve ser registrado no histórico


  Regra: O Aluno pode consultar o histórico das suas solicitações

    Cenário: Aluno consulta o histórico da sua solicitação
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação cadastrada pelo aluno
      Quando acesso o histórico da solicitação
      Então devo visualizar o histórico da solicitação

    Cenário: Aluno não pode consultar o histórico de outro aluno
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação pertencente a outro aluno
      Quando tento acessar o histórico da solicitação
      Então o acesso deve ser negado


  Regra: O Coordenador pode consultar o histórico das solicitações

    Cenário: Coordenador consulta o histórico de uma solicitação
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação cadastrada
      Quando acesso o histórico da solicitação
      Então devo visualizar o histórico da solicitação


  Regra: O histórico deve apresentar as informações das alterações

    Cenário: Histórico apresenta o status anterior e o novo status
      Dado que estou autenticado como "Administrador"
      E uma solicitação teve seu status alterado
      Quando consulto o histórico da solicitação
      Então devo visualizar o status anterior
      E devo visualizar o novo status

    Cenário: Histórico apresenta a data da alteração
      Dado que estou autenticado como "Administrador"
      E uma solicitação possui alterações registradas
      Quando consulto o histórico da solicitação
      Então devo visualizar a data de cada alteração

    Cenário: Histórico apresenta o usuário responsável pela alteração
      Dado que estou autenticado como "Administrador"
      E uma solicitação possui alterações registradas
      Quando consulto o histórico da solicitação
      Então devo visualizar o usuário responsável por cada alteração
