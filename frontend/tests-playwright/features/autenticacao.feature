# language: pt

@autenticacao
Funcionalidade: Autenticação de usuários

  Como usuário do sistema HComplementares
  Quero realizar minha autenticação
  Para acessar as funcionalidades disponíveis para o meu perfil


    Regra: Usuários devem ser autenticados para acessar o sistema

        Cenário: Administrador realiza login com credenciais válidas
            Dado que estou na página de login
             Quando informo o usuário "admin"
              E informo a senha válida do "Administrador"
              E confirmo o login
             Então devo ser autenticado com sucesso
              E devo ser direcionado para o Dashboard

        Cenário: Administrador de Campus realiza login com credenciais válidas
            Dado que estou na página de login
             Quando informo o usuário "coordpoa"
              E informo a senha válida do "Administrador de Campus"
              E confirmo o login
             Então devo ser autenticado com sucesso
              E devo ser direcionado para o Dashboard

        Cenário: Coordenador realiza login com credenciais válidas
            Dado que estou na página de login
             Quando informo o usuário "marceloschmitt"
              E informo a senha válida do "Coordenador"
              E confirmo o login
             Então devo ser autenticado com sucesso
              E devo ser direcionado para o Dashboard

        Cenário: Aluno realiza login com credenciais válidas
            Dado que estou na página de login
             Quando informo o usuário "thiagolima"
              E informo a senha válida do "Aluno"
              E confirmo o login
             Então devo ser autenticado com sucesso
              E devo ser direcionado para o Dashboard


    Regra: Credenciais inválidas não devem autenticar o usuário

        Cenário: Usuário informa credenciais inválidas
            Dado que estou na página de login
             Quando informo credenciais inválidas
              E confirmo o login
             Então não devo ser autenticado
              E devo permanecer na página de login
              E devo visualizar uma mensagem informando que as credenciais são inválidas


    Regra: O encerramento da sessão deve impedir o acesso autenticado

        Cenário: Usuário encerra a sessão
            Dado que estou autenticado no sistema
             Quando encerro a sessão
             Então devo ser direcionado para a página de login
              E não devo mais estar autenticado 
              #descobrir como autenticar que o usuário não está mais autenticado

        Cenário: Usuário tenta acessar uma página protegida após sair
            Dado que estou autenticado no sistema
              E encerro a sessão
             Quando tento acessar uma página protegida
             Então devo ser direcionado para a página de login
