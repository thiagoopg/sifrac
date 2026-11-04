# language: pt

@cursos
Funcionalidade: Gerenciamento de Cursos

  Como usuário autorizado
  Quero gerenciar os cursos
  Para manter os cursos disponíveis no sistema


  Regra: O Administrador pode gerenciar os cursos

    Cenário: Administrador visualiza os cursos cadastrados
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "Cursos"
      Então devo visualizar os cursos cadastrados

    Cenário: Administrador cadastra um novo curso
      Dado que estou autenticado como "Administrador"
      Quando cadastro um novo curso
      Então o curso deve ser cadastrado com sucesso
      E devo visualizar o curso cadastrado

    Cenário: Administrador edita um curso
      Dado que estou autenticado como "Administrador"
      E existe um curso cadastrado
      Quando edito o curso
      Então as alterações do curso devem ser salvas

    Cenário: Administrador exclui um curso
      Dado que estou autenticado como "Administrador"
      E existe um curso cadastrado
      Quando excluo o curso
      Então o curso não deve mais ser exibido na listagem


  Regra: O Administrador de Campus pode gerenciar cursos do seu campus

    Cenário: Administrador de Campus visualiza os cursos do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso a administração de "Cursos"
      Então devo visualizar os cursos do meu campus

    Cenário: Administrador de Campus cadastra um curso no seu campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando cadastro um curso para o meu campus
      Então o curso deve ser cadastrado com sucesso

    Cenário: Administrador de Campus edita um curso do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      E existe um curso vinculado ao meu campus
      Quando edito o curso
      Então as alterações do curso devem ser salvas

    Cenário: Administrador de Campus exclui um curso do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      E existe um curso vinculado ao meu campus
      Quando excluo o curso
      Então o curso não deve mais ser exibido na listagem

#    Cenário: Administrador de Campus não pode editar curso de outro campus
#      Dado que estou autenticado como Administrador de Campus
#      E existe um curso vinculado a outro campus
#      Quando tento editar esse curso
#      Então a operação deve ser impedida
#
#    Cenário: Administrador de Campus não pode excluir curso de outro campus
#      Dado que estou autenticado como Administrador de Campus
#      E existe um curso vinculado a outro campus
#      Quando tento excluir esse curso
#      Então a operação deve ser impedida

  #O admin não deve VISUALIZAR outros cursos de outros campus


  Regra: O Coordenador pode consultar cursos

    Cenário: Coordenador visualiza os cursos disponíveis
      Dado que estou autenticado como "Coordenador"
      Quando acesso a administração de "Cursos"
      Então devo visualizar os cursos disponíveis


  Regra: Usuários sem permissão não podem gerenciar cursos

    Cenário: Aluno não pode acessar a administração de Cursos
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a administração de "Cursos"
      Então o acesso deve ser negado


  Regra: O cadastro de curso deve validar os dados obrigatórios

    Cenário: Usuário tenta cadastrar curso sem informar os dados obrigatórios
      Dado que estou autenticado como "Administrador"
      Quando tento cadastrar um curso sem informar os dados obrigatórios
      Então o cadastro não deve ser realizado
      E devo visualizar as mensagens de validação
