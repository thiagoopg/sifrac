# language: pt

@alunos
Funcionalidade: Consulta e gerenciamento de alunos

  Como usuário autorizado
  Quero consultar os alunos do sistema
  Para visualizar suas informações acadêmicas


  Regra: O Administrador pode consultar os alunos

    Cenário: Administrador visualiza os alunos cadastrados
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "Alunos"
      Então devo visualizar os alunos cadastrados

    Cenário: Administrador visualiza os dados de um aluno
      Dado que estou autenticado como "Administrador"
      E existe um aluno cadastrado
      Quando acesso os dados do aluno
      Então devo visualizar as informações do aluno


  Regra: Usuários sem permissão não podem acessar os alunos

    Cenário: Administrador de Campus não pode acessar os alunos
      Dado que estou autenticado como "Administrador de Campus"
      Quando tento acessar a administração de "Alunos"
      Então o acesso deve ser negado

    Cenário: Coordenador não pode acessar os alunos
      Dado que estou autenticado como "Coordenador"
      Quando tento acessar a administração de "Alunos"
      Então o acesso deve ser negado

    Cenário: Aluno não pode acessar a administração de outros alunos
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a administração de "Alunos"
      Então o acesso deve ser negado


  Regra: O Administrador deve conseguir localizar alunos

    Cenário: Administrador pesquisa um aluno
      Dado que estou autenticado como "Administrador"
      E existem alunos cadastrados
      Quando pesquiso por um aluno
      Então devo visualizar o aluno correspondente à pesquisa

      #Criar feature para o admin conseguir visualizar os alunos de um campus específico