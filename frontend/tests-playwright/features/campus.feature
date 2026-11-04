# language: pt

@campus
Funcionalidade: Gerenciamento de Campus

  Como usuário autorizado
  Quero gerenciar os campus do sistema
  Para manter os dados dos campus atualizados


  Regra: O Administrador pode gerenciar qualquer campus

    Cenário: Administrador visualiza os campus cadastrados
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "Campus"
      Então devo visualizar os campus cadastrados

    Cenário: Administrador cadastra um novo campus
      Dado que estou autenticado como "Administrador"
      Quando cadastro um novo campus
      Então o campus deve ser cadastrado com sucesso
      E devo visualizar o campus cadastrado

    Cenário: Administrador edita um campus
      Dado que estou autenticado como "Administrador"
      E existe um campus cadastrado
      Quando edito o campus
      Então as alterações do campus devem ser salvas

    Cenário: Administrador exclui um campus
      Dado que estou autenticado como "Administrador"
      E existe um campus cadastrado
      Quando excluo o campus
      Então o campus não deve mais ser exibido na listagem


  Regra: O Administrador de Campus pode gerenciar somente seu próprio campus

    Cenário: Administrador de Campus visualiza seu campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso a administração de "Campus"
      Então devo visualizar meu campus

    Cenário: Administrador de Campus edita seu próprio campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando edito meu campus
      Então as alterações do campus devem ser salvas

    #Não deve ser visualizado NENHUM outro campus, cria página de campus único.
    #Cenário: Administrador de Campus não pode editar outro campus
    #  Dado que estou autenticado como Administrador de Campus
    #  E existe um campus ao qual não estou vinculado
    #  Quando tento editar esse campus
    # Então a operação deve ser impedida

    Cenário: Administrador de Campus não pode acessar página de outro campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso a página de outro campus
      Então a operação deve ser impedida

    #Não deve conseguir criar outro campus, apenas editar o próprio
  #Regra: O Administrador de Campus pode cadastrar e gerenciar campus conforme sua permissão

    #Cenário: Administrador de Campus cadastra um campus
    #  Dado que estou autenticado como Administrador de Campus
    #  Quando cadastro um novo campus
    #  Então o campus deve ser cadastrado com sucesso


  Regra: Usuários sem permissão não podem gerenciar campus

    Cenário: Coordenador não pode acessar a administração de Campus
      Dado que estou autenticado como "Coordenador"
      Quando tento acessar a administração de "Campus"
      Então o acesso deve ser negado

    Cenário: Aluno não pode acessar a administração de Campus
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a administração de "Campus"
      Então o acesso deve ser negado


  Regra: O cadastro de campus deve validar os dados obrigatórios

    Cenário: Usuário tenta cadastrar campus sem informar os dados obrigatórios
      Dado que estou autenticado como "Administrador"
      Quando tento cadastrar um campus sem informar os dados obrigatórios
      Então o cadastro não deve ser realizado
      E devo visualizar as mensagens de validação
