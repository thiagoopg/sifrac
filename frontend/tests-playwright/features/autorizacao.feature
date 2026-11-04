# language: pt

@autorizacao
Funcionalidade: Autorização de acesso às funcionalidades

  Como sistema HComplementares
  Quero controlar o acesso às funcionalidades de acordo com o perfil do usuário
  Para garantir que cada usuário tenha acesso somente às operações permitidas


  Regra: O Administrador possui acesso às funcionalidades administrativas

    Cenário: Administrador visualiza as opções administrativas disponíveis
      Dado que estou autenticado como "Administrador"
      Quando acesso o sistema
      Então devo visualizar as opções de "Dashboard"
      E devo visualizar as opções de "Campus"
      E devo visualizar as opções de "Cursos"
      E devo visualizar as opções de "Alunos"
      E devo visualizar as opções de "Solicitações"
      E devo visualizar as opções de "Tipos de Hora"
      E devo visualizar as opções de "Usuários"


    Cenário: Administrador pode acessar a administração de campus
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "campus"
      Então devo ter acesso à funcionalidade


    Cenário: Administrador pode gerenciar qualquer campus
      Dado que estou autenticado como "Administrador"
      E existem diferentes campus cadastrados
      Quando acesso o gerenciamento de "campus"
      Então devo poder editar um campus diferente do meu


  Regra: O Administrador de Campus possui acesso limitado ao seu campus

    Cenário: Administrador de Campus visualiza somente as funcionalidades permitidas
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso o sistema
      Então devo visualizar as opções de "Dashboard"
      E devo visualizar as opções de "Campus"
      E devo visualizar as opções de "Cursos"
      E devo visualizar as opções de "Tipos de Hora"
      E devo visualizar as opções de "Solicitações"
      Mas não devo visualizar a opção de "Usuários"
      E não devo visualizar a opção de "Alunos"


    Cenário: Administrador de Campus pode gerenciar seu próprio campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso o gerenciamento de "campus"
      Então devo poder editar o meu campus


    Cenário: Administrador de Campus não pode editar outro campus
      Dado que estou autenticado como "Administrador de Campus"
      E existe um campus ao qual não estou vinculado
      Quando tento editar esse campus
      Então a operação deve ser impedida


  Regra: O Coordenador possui acesso às funcionalidades de coordenação

    Cenário: Coordenador visualiza somente as funcionalidades permitidas
      Dado que estou autenticado como "Coordenador"
      Quando acesso o sistema
      Então devo visualizar as opções de "Dashboard"
      E devo visualizar as opções de "Cursos"
      E devo visualizar as opções de "Solicitações"
      Mas não devo visualizar a opção de "Campus"
      E não devo visualizar a opção de "Alunos"
      E não devo visualizar a opção de "Usuários"
      E não devo visualizar a opção de "Tipos de Hora"


  Regra: O Aluno possui acesso somente às suas funcionalidades

    Cenário: Aluno visualiza somente suas funcionalidades
      Dado que estou autenticado como "Aluno"
      Quando acesso o sistema
      Então devo visualizar as opções de "Dashboard"
      E devo visualizar as opções de "Solicitações"
      Mas não devo visualizar a opção de "Campus"
      E não devo visualizar a opção de "Cursos"
      E não devo visualizar a opção de "Tipos de Hora"
      E não devo visualizar a opção de "Usuários"
      E não devo visualizar a opção de "Alunos"
      E não devo visualizar a opção de Administração de Campus


  Regra: Rotas restritas devem impedir acesso não autorizado

    Cenário: Aluno tenta acessar uma funcionalidade administrativa
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a funcionalidade de "Campus"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Aluno tenta acessar a administração de cursos
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a funcionalidade de "Cursos"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Aluno tenta acessar a administração de tipos de hora
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a funcionalidade de "Tipos de Hora"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Aluno tenta acessar o gerenciamento de usuários
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a funcionalidade de "Usuários"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Aluno tenta acessar o gerenciamento de alunos
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a funcionalidade de "Alunos"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Aluno tenta acessar a administração de campus
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a administração de "campus"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Coordenador tenta acessar a administração de campus
      Dado que estou autenticado como "Coordenador"
      Quando tento acessar a administração de "campus"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


    Cenário: Coordenador tenta acessar o gerenciamento de usuários
      Dado que estou autenticado como "Coordenador"
      Quando tento acessar o gerenciamento de "usuários"
      Então o acesso deve ser negado
      E devo ser direcionado para uma página permitida ao meu perfil


  Regra: Apenas o Coordenador pode avaliar solicitações

    Cenário: Coordenador pode avaliar uma solicitação
      Dado que estou autenticado como "Coordenador"
      E existe uma solicitação pendente
      Quando acesso a solicitação
      Então devo visualizar a opção de avaliação


    Cenário: Administrador não pode avaliar uma solicitação
      Dado que estou autenticado como "Administrador"
      E existe uma solicitação pendente
      Quando acesso a solicitação
      Então não devo visualizar a opção de avaliação


    Cenário: Aluno não pode avaliar uma solicitação
      Dado que estou autenticado como "Aluno"
      E existe uma solicitação pendente
      Quando acesso a solicitação
      Então não devo visualizar a opção de avaliação
