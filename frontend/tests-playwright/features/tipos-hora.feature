# language: pt

@tipos-hora
Funcionalidade: Gerenciamento de tipos de hora

  Como usuário autorizado
  Quero gerenciar os tipos de hora
  Para disponibilizar as opções de horas complementares


  Regra: O Administrador pode gerenciar os tipos de hora

    Cenário: Administrador visualiza os tipos de hora cadastrados
      Dado que estou autenticado como "Administrador"
      Quando acesso a administração de "Tipos de Hora"
      Então devo visualizar os tipos de hora cadastrados

    Cenário: Administrador cadastra um novo tipo de hora
      Dado que estou autenticado como "Administrador"
      Quando cadastro um novo tipo de hora
      Então o tipo de hora deve ser cadastrado com sucesso
      E devo visualizar o tipo de hora cadastrado

    Cenário: Administrador edita um tipo de hora
      Dado que estou autenticado como "Administrador"
      E existe um tipo de hora cadastrado
      Quando edito o tipo de hora
      Então as alterações do tipo de hora devem ser salvas

    Cenário: Administrador exclui um tipo de hora
      Dado que estou autenticado como "Administrador"
      E existe um tipo de hora cadastrado
      Quando excluo o tipo de hora
      Então o tipo de hora não deve mais ser exibido na listagem

#O Coordenador deve conseguir editar seus tipos-hora também
  Regra: O Administrador de Campus pode gerenciar os tipos de hora do seu campus

    Cenário: Administrador de Campus visualiza os tipos de hora do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      Quando acesso a administração de "Tipos de Hora"
      Então devo visualizar os tipos de hora do meu campus

    Cenário: Administrador de Campus cadastra um tipo de hora
      Dado que estou autenticado como "Administrador de Campus"
      Quando cadastro um tipo de hora para o meu campus
      Então o tipo de hora deve ser cadastrado com sucesso

    Cenário: Administrador de Campus edita um tipo de hora do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      E existe um tipo de hora vinculado ao meu campus
      Quando edito o tipo de hora
      Então as alterações do tipo de hora devem ser salvas

    Cenário: Administrador de Campus exclui um tipo de hora do seu campus
      Dado que estou autenticado como "Administrador de Campus"
      E existe um tipo de hora vinculado ao meu campus
      Quando excluo o tipo de hora
      Então o tipo de hora não deve mais ser exibido na listagem

  #Cenário verificando se aparece tipos de horas de outro campus né, ao invés de ter que verifica ro botão.
#    Cenário: Administrador de Campus não pode editar tipo de hora de outro campus
#      Dado que estou autenticado como Administrador de Campus
#      E existe um tipo de hora vinculado a outro campus
#      Quando tento editar esse tipo de hora
#      Então a operação deve ser impedida
#
#    Cenário: Administrador de Campus não pode excluir tipo de hora de outro campus
#      Dado que estou autenticado como Administrador de Campus
#      E existe um tipo de hora vinculado a outro campus
#      Quando tento excluir esse tipo de hora
#      Então a operação deve ser impedida


  Regra: Usuários sem permissão não podem gerenciar tipos de hora

    #Coordenador DEVE conseguir cadastrar e editar tipo de horas
#    Cenário: Coordenador não pode acessar a administração de tipos de hora
#      Dado que estou autenticado como Coordenador
#      Quando tento acessar a administração de Tipos de Hora
#      Então o acesso deve ser negado

    Cenário: Aluno não pode acessar a administração de tipos de hora
      Dado que estou autenticado como "Aluno"
      Quando tento acessar a administração de "Tipos de Hora"
      Então o acesso deve ser negado


  Regra: O cadastro de tipo de hora deve validar os dados obrigatórios

    Cenário: Usuário tenta cadastrar tipo de hora sem informar os dados obrigatórios
      Dado que estou autenticado como "Administrador"
      Quando tento cadastrar um tipo de hora sem informar os dados obrigatórios
      Então o cadastro não deve ser realizado
      E devo visualizar as mensagens de validação
