// Generated from: tests-playwright/features/autenticacao.feature
import { test } from "playwright-bdd";

test.describe('Autenticação de usuários', () => {

  test.describe('Usuários devem ser autenticados para acessar o sistema', () => {

    test('Administrador realiza login com credenciais válidas', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou na página de login', null, { page }); 
      await When('informo o usuário "admin"', null, { page }); 
      await And('informo a senha válida do "Administrador"', null, { page }); 
      await And('confirmo o login', null, { page }); 
      await Then('devo ser autenticado com sucesso', null, { page }); 
      await And('devo ser direcionado para o Dashboard', null, { page }); 
    });

    test('Administrador de Campus realiza login com credenciais válidas', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou na página de login', null, { page }); 
      await When('informo o usuário "coordpoa"', null, { page }); 
      await And('informo a senha válida do "Administrador de Campus"', null, { page }); 
      await And('confirmo o login', null, { page }); 
      await Then('devo ser autenticado com sucesso', null, { page }); 
      await And('devo ser direcionado para o Dashboard', null, { page }); 
    });

    test('Coordenador realiza login com credenciais válidas', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou na página de login', null, { page }); 
      await When('informo o usuário "marceloschmitt"', null, { page }); 
      await And('informo a senha válida do "Coordenador"', null, { page }); 
      await And('confirmo o login', null, { page }); 
      await Then('devo ser autenticado com sucesso', null, { page }); 
      await And('devo ser direcionado para o Dashboard', null, { page }); 
    });

    test('Aluno realiza login com credenciais válidas', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou na página de login', null, { page }); 
      await When('informo o usuário "thiagolima"', null, { page }); 
      await And('informo a senha válida do "Aluno"', null, { page }); 
      await And('confirmo o login', null, { page }); 
      await Then('devo ser autenticado com sucesso', null, { page }); 
      await And('devo ser direcionado para o Dashboard', null, { page }); 
    });

  });

  test.describe('Credenciais inválidas não devem autenticar o usuário', () => {

    test('Usuário informa credenciais inválidas', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou na página de login', null, { page }); 
      await When('informo credenciais inválidas', null, { page }); 
      await And('confirmo o login', null, { page }); 
      await Then('não devo ser autenticado', null, { page }); 
      await And('devo permanecer na página de login', null, { page }); 
      await And('devo visualizar uma mensagem informando que as credenciais são inválidas', null, { page }); 
    });

  });

  test.describe('O encerramento da sessão deve impedir o acesso autenticado', () => {

    test('Usuário encerra a sessão', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado no sistema', null, { page }); 
      await When('encerro a sessão', null, { page }); 
      await Then('devo ser direcionado para a página de login', null, { page }); 
      await And('não devo mais estar autenticado', null, { page }); 
    });

    test('Usuário tenta acessar uma página protegida após sair', { tag: ['@autenticacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado no sistema', null, { page }); 
      await And('encerro a sessão', null, { page }); 
      await When('tento acessar uma página protegida', null, { page }); 
      await Then('devo ser direcionado para a página de login', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/autenticacao.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@autenticacao"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou na página de login","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando informo o usuário \"admin\"","stepMatchArguments":[{"group":{"start":18,"value":"\"admin\"","children":[{"start":19,"value":"admin","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"E informo a senha válida do \"Administrador\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Administrador\"","children":[{"start":27,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":17,"keywordType":"Action","textWithKeyword":"E confirmo o login","stepMatchArguments":[]},{"pwStepLine":13,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"Então devo ser autenticado com sucesso","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":17,"pickleLine":21,"tags":["@autenticacao"],"steps":[{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"Dado que estou na página de login","stepMatchArguments":[]},{"pwStepLine":19,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"Quando informo o usuário \"coordpoa\"","stepMatchArguments":[{"group":{"start":18,"value":"\"coordpoa\"","children":[{"start":19,"value":"coordpoa","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":20,"gherkinStepLine":24,"keywordType":"Action","textWithKeyword":"E informo a senha válida do \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Administrador de Campus\"","children":[{"start":27,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":21,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"E confirmo o login","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Então devo ser autenticado com sucesso","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":29,"tags":["@autenticacao"],"steps":[{"pwStepLine":27,"gherkinStepLine":30,"keywordType":"Context","textWithKeyword":"Dado que estou na página de login","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":31,"keywordType":"Action","textWithKeyword":"Quando informo o usuário \"marceloschmitt\"","stepMatchArguments":[{"group":{"start":18,"value":"\"marceloschmitt\"","children":[{"start":19,"value":"marceloschmitt","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":32,"keywordType":"Action","textWithKeyword":"E informo a senha válida do \"Coordenador\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Coordenador\"","children":[{"start":27,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"E confirmo o login","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Então devo ser autenticado com sucesso","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":35,"pickleLine":37,"tags":["@autenticacao"],"steps":[{"pwStepLine":36,"gherkinStepLine":38,"keywordType":"Context","textWithKeyword":"Dado que estou na página de login","stepMatchArguments":[]},{"pwStepLine":37,"gherkinStepLine":39,"keywordType":"Action","textWithKeyword":"Quando informo o usuário \"thiagolima\"","stepMatchArguments":[{"group":{"start":18,"value":"\"thiagolima\"","children":[{"start":19,"value":"thiagolima","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"E informo a senha válida do \"Aluno\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Aluno\"","children":[{"start":27,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"E confirmo o login","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Então devo ser autenticado com sucesso","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":48,"pickleLine":48,"tags":["@autenticacao"],"steps":[{"pwStepLine":49,"gherkinStepLine":49,"keywordType":"Context","textWithKeyword":"Dado que estou na página de login","stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":50,"keywordType":"Action","textWithKeyword":"Quando informo credenciais inválidas","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":51,"keywordType":"Action","textWithKeyword":"E confirmo o login","stepMatchArguments":[]},{"pwStepLine":52,"gherkinStepLine":52,"keywordType":"Outcome","textWithKeyword":"Então não devo ser autenticado","stepMatchArguments":[]},{"pwStepLine":53,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"E devo permanecer na página de login","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"E devo visualizar uma mensagem informando que as credenciais são inválidas","stepMatchArguments":[]}]},
  {"pwTestLine":61,"pickleLine":59,"tags":["@autenticacao"],"steps":[{"pwStepLine":62,"gherkinStepLine":60,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado no sistema","stepMatchArguments":[]},{"pwStepLine":63,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"Quando encerro a sessão","stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":62,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a página de login","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":63,"keywordType":"Outcome","textWithKeyword":"E não devo mais estar autenticado","stepMatchArguments":[]}]},
  {"pwTestLine":68,"pickleLine":66,"tags":["@autenticacao"],"steps":[{"pwStepLine":69,"gherkinStepLine":67,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado no sistema","stepMatchArguments":[]},{"pwStepLine":70,"gherkinStepLine":68,"keywordType":"Context","textWithKeyword":"E encerro a sessão","stepMatchArguments":[]},{"pwStepLine":71,"gherkinStepLine":69,"keywordType":"Action","textWithKeyword":"Quando tento acessar uma página protegida","stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":70,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a página de login","stepMatchArguments":[]}]},
]; // bdd-data-end