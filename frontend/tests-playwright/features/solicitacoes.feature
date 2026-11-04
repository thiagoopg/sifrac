# language: pt

@solicitacoes
Funcionalidade: Gerenciamento de solicitações de horas complementares

  Como usuário do sistema
  Quero consultar e gerenciar solicitações
  Para acompanhar o processo de validação das horas complementares


  Regra: Usuários autorizados podem consultar solicitações

    Cenário: Administrador visualiza as solicitações
      Dado que estou autenticado como "Administrador"
      Quando acesso as Solicitações
      Então devo visualizar as solicitações cadastradas

    Cenário: Administrador de Campus visualiza as solicitações
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso as Solicitações
      Então devo visualizar as solicitações disponíveis

    Cenário: Coordenador visualiza as solicitações
      Dado que estou autenticado como "Coordenador"
      Quando acesso as Solicitações
      Então devo visualizar as solicitações disponíveis

    Cenário: Aluno visualiza somente suas solicitações
      Dado que estou autenticado como "Aluno"
      E existem solicitações de diferentes alunos
      Quando acesso as Solicitações
      Então devo visualizar somente minhas solicitações


  Regra: O usuário pode filtrar solicitações

    Cenário: Usuário filtra solicitações por status
      Dado que estou autenticado no sistema
      E existem solicitações com diferentes status
      Quando filtro as solicitações por status
      Então devo visualizar somente as solicitações correspondentes ao status selecionado

      #Acho que não precisa, são poucos pedidos pro aluno implementar
    Cenário: Usuário filtra solicitações por período
      Dado que estou autenticado no sistema
      E existem solicitações cadastradas em diferentes períodos
      Quando filtro as solicitações por período
      Então devo visualizar somente as solicitações correspondentes ao período selecionado


  Regra: O Aluno pode cadastrar uma solicitação

    Cenário: Aluno cadastra uma solicitação
      Dado que estou autenticado como "Aluno"
      Quando cadastro uma solicitação de horas complementares
      Então a solicitação deve ser cadastrada com sucesso
      E a solicitação deve ficar com status Pendente

    Cenário: Aluno deve informar os dados obrigatórios da solicitação
      Dado que estou autenticado como "Aluno"
      Quando tento cadastrar uma solicitação sem informar os dados obrigatórios
      Então a solicitação não deve ser cadastrada
      E devo visualizar as mensagens de validação


  Regra: O Aluno pode consultar os dados da sua solicitação

    Cenário: Aluno visualiza os detalhes de uma solicitação
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação cadastrada pelo aluno
      Quando acesso os detalhes da solicitação
      Então devo visualizar os dados da solicitação

    Cenário: Aluno visualiza o status da solicitação
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação cadastrada pelo aluno
      Quando acesso os detalhes da solicitação
      Então devo visualizar o status da solicitação


  Regra: Apenas o Coordenador pode avaliar solicitações

    Cenário: Coordenador avalia uma solicitação pendente
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação pendente
      Quando avalio a solicitação
      Então a solicitação deve ter seu status atualizado

    Cenário: Coordenador pode deferir uma solicitação
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação pendente
      Quando defiro a solicitação
      Então a solicitação deve ficar com status Deferido

    Cenário: Coordenador pode indeferir uma solicitação
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação pendente
      Quando indefiro a solicitação
      Então a solicitação deve ficar com status Indeferido


  Regra: Usuários que não são Coordenadores não podem avaliar solicitações

    Cenário: Administrador não pode avaliar uma solicitação
      Dado que estou autenticado como "Administrador"
      E existe uma solicitação pendente
      Quando acesso os detalhes da solicitação
      Então não devo visualizar a opção de avaliação

    Cenário: Aluno não pode avaliar uma solicitação
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação pendente
      Quando acesso os detalhes da solicitação
      Então não devo visualizar a opção de avaliação


  #Cancelamento removido: nenhum perfil pode excluir/cancelar uma solicitação.
#  Regra: O Aluno pode cancelar suas solicitações
#
#    Cenário: Aluno cancela uma solicitação pendente
#      Dado que estou autenticado como Aluno
#      E existe uma solicitação pendente do aluno
#      Quando cancelo a solicitação
#      Então a solicitação deve ser cancelada


  Regra: O usuário pode consultar o histórico da solicitação

    Cenário: Aluno consulta o histórico de uma solicitação
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação cadastrada pelo aluno
      Quando acesso o histórico da solicitação
      Então devo visualizar o histórico de alterações da solicitação

    Cenário: Coordenador consulta o histórico de uma solicitação
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação cadastrada
      Quando acesso o histórico da solicitação
      Então devo visualizar o histórico de alterações da solicitação

      #Regra: visualização do PDF tem que ser validado se contém a visualização correta.