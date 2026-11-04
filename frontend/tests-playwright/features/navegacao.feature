# language: pt

@navegacao
Funcionalidade: Navegação pelo sistema

  Como usuário autenticado
  Quero navegar pelas funcionalidades disponíveis
  Para acessar os recursos permitidos ao meu perfil


  Regra: O usuário deve conseguir navegar pelo menu disponível ao seu perfil

    Cenário: Administrador navega para o Dashboard
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Dashboard"
      Então devo ser direcionado para o Dashboard

    Cenário: Administrador navega para Campus
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Campus"
      Então devo ser direcionado para a administração de "Campus"

    Cenário: Administrador navega para Cursos
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Cursos"
      Então devo ser direcionado para a administração de "Cursos"

    Cenário: Administrador navega para Alunos
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Alunos"
      Então devo ser direcionado para a administração de "Alunos"

    Cenário: Administrador navega para Solicitações
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Solicitações"
      Então devo ser direcionado para as Solicitações

    Cenário: Administrador navega para Tipos de Hora
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Tipos de Hora"
      Então devo ser direcionado para a administração de "Tipos de Hora"

    Cenário: Administrador navega para Usuários
      Dado que estou autenticado como "Administrador"
      Quando seleciono a opção "Usuários"
      Então devo ser direcionado para a administração de "Usuários"


  Regra: O Administrador de Campus deve navegar pelas funcionalidades permitidas

    Cenário: Administrador de Campus navega para Campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando seleciono a opção "Campus"
      Então devo ser direcionado para a administração de "Campus"

    Cenário: Administrador de Campus navega para Cursos
      Dado que estou autenticado como "Administrador de Campus"
      Quando seleciono a opção "Cursos"
      Então devo ser direcionado para a administração de "Cursos"

    Cenário: Administrador de Campus navega para Tipos de Hora
      Dado que estou autenticado como "Administrador de Campus"
      Quando seleciono a opção "Tipos de Hora"
      Então devo ser direcionado para a administração de "Tipos de Hora"

    Cenário: Administrador de Campus navega para Solicitações
      Dado que estou autenticado como "Administrador de Campus"
      Quando seleciono a opção "Solicitações"
      Então devo ser direcionado para as Solicitações


  Regra: O Coordenador deve navegar pelas funcionalidades permitidas

    Cenário: Coordenador navega para Cursos
      Dado que estou autenticado como "Coordenador"
      Quando seleciono a opção "Cursos"
      Então devo ser direcionado para a administração de "Cursos"

    Cenário: Coordenador navega para Solicitações
      Dado que estou autenticado como "Coordenador"
      Quando seleciono a opção "Solicitações"
      Então devo ser direcionado para as Solicitações


  Regra: O Aluno deve navegar pelas funcionalidades permitidas

    Cenário: Aluno navega para o Dashboard
      Dado que estou autenticado como "Aluno"
      Quando seleciono a opção "Dashboard"
      Então devo ser direcionado para o Dashboard

    Cenário: Aluno navega para Solicitações
      Dado que estou autenticado como "Aluno"
      Quando seleciono a opção "Solicitações"
      Então devo ser direcionado para as Solicitações


  Regra: O usuário deve conseguir retornar ao Dashboard

    Cenário: Usuário retorna ao Dashboard pelo menu
      Dado que estou autenticado no sistema
      E estou em uma funcionalidade diferente do Dashboard
      Quando seleciono a opção "Dashboard"
      Então devo ser direcionado para o Dashboard


  Regra: O encerramento da sessão deve estar disponível para usuários autenticados

    Cenário: Usuário encerra a sessão pelo menu
      Dado que estou autenticado no sistema
      Quando seleciono a opção de encerramento da sessão
      Então devo ser direcionado para a página de login
      E não devo mais estar autenticado
