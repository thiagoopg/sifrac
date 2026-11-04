# language: pt

@dashboard
Funcionalidade: Dashboard

  Como usuário autenticado
  Quero visualizar o Dashboard
  Para consultar as informações relevantes ao meu perfil


  Regra: Usuários autenticados devem conseguir acessar o Dashboard

    Cenário: Administrador acessa o Dashboard
      Dado que estou autenticado como "Administrador"
      Quando acesso o Dashboard
      Então devo visualizar o Dashboard

    Cenário: Administrador de Campus acessa o Dashboard
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso o Dashboard
      Então devo visualizar o Dashboard

    Cenário: Coordenador acessa o Dashboard
      Dado que estou autenticado como "Coordenador"
      Quando acesso o Dashboard
      Então devo visualizar o Dashboard

    Cenário: Aluno acessa o Dashboard
      Dado que estou autenticado como "Aluno"
      Quando acesso o Dashboard
      Então devo visualizar o Dashboard


  Regra: O Dashboard deve apresentar informações de acordo com o perfil

    Cenário: Administrador visualiza as informações administrativas
      Dado que estou autenticado como "Administrador"
      Quando acesso o Dashboard
      Então devo visualizar as informações disponíveis para o "Administrador"

    Cenário: Administrador de Campus visualiza as informações do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso o Dashboard
      Então devo visualizar as informações disponíveis para o "Administrador de Campus"

    Cenário: Coordenador visualiza as informações de coordenação
      Dado que estou autenticado como "Coordenador"
      Quando acesso o Dashboard
      Então devo visualizar as informações disponíveis para o "Coordenador"

    Cenário: Aluno visualiza suas informações acadêmicas
      Dado que estou autenticado como "Aluno"
      Quando acesso o Dashboard
      Então devo visualizar as informações disponíveis para o "Aluno"


  Regra: O Dashboard do aluno deve apresentar o acompanhamento das solicitações

    Cenário: Aluno visualiza o acompanhamento das suas solicitações
      Dado que estou autenticado como "Aluno"
      E existem solicitações cadastradas para o aluno
      Quando acesso o Dashboard
      Então devo visualizar o acompanhamento das minhas solicitações
