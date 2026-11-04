# language: pt

@usuarios
Funcionalidade: Gerenciamento de usuários

  Como Administrador
  Quero gerenciar os usuários do sistema
  Para controlar os acessos e perfis cadastrados

  #o Administrador consegue editar todos os perfis, o coordenador de campus consegue colocar coordenadores,
  Regra: Apenas o Administrador pode gerenciar usuários

    Cenário: Administrador acessa o gerenciamento de usuários
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "Usuários"
      Então devo visualizar os usuários cadastrados

    Cenário: Administrador de Campus não pode acessar o gerenciamento de usuários
      Dado que estou autenticado como "Administrador de Campus"
      Quando tento acessar a administração de "Usuários"
      Então o acesso deve ser negado

    Cenário: Coordenador não pode acessar o gerenciamento de usuários
      Dado que estou autenticado como "Coordenador"
      Quando tento acessar a administração de "Usuários"
      Então o acesso deve ser negado

    Cenário: Aluno não pode acessar o gerenciamento de usuários
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a administração de "Usuários"
      Então o acesso deve ser negado


  Regra: O Administrador pode consultar usuários

    Cenário: Administrador visualiza os dados de um usuário
      Dado que estou autenticado como "Administrador"
      E existe um usuário cadastrado
      Quando acesso os dados do usuário
      Então devo visualizar as informações do usuário

    Cenário: Administrador pesquisa um usuário
      Dado que estou autenticado como "Administrador"
      E existem usuários cadastrados
      Quando pesquiso por um usuário
      Então devo visualizar o usuário correspondente à pesquisa


  Regra: O Administrador pode gerenciar administradores de campus

    Cenário: Administrador visualiza os administradores de campus
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "campus"
      Então devo visualizar os administradores vinculados aos campus

    Cenário: Administrador remove um administrador de campus
      Dado que estou autenticado como "Administrador"
      E existe um administrador vinculado a um campus
      Quando removo o vínculo do administrador com o campus
      Então o administrador não deve mais estar vinculado ao campus
