// Generated from: tests-playwright/features/dashboard.feature
import { test } from "playwright-bdd";

test.describe('Dashboard', () => {

  test.describe('Usuários autenticados devem conseguir acessar o Dashboard', () => {

    test('Administrador acessa o Dashboard', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar o Dashboard', null, { page }); 
    });

    test('Administrador de Campus acessa o Dashboard', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar o Dashboard', null, { page }); 
    });

    test('Coordenador acessa o Dashboard', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar o Dashboard', null, { page }); 
    });

    test('Aluno acessa o Dashboard', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar o Dashboard', null, { page }); 
    });

  });

  test.describe('O Dashboard deve apresentar informações de acordo com o perfil', () => {

    test('Administrador visualiza as informações administrativas', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar as informações disponíveis para o "Administrador"', null, { page }); 
    });

    test('Administrador de Campus visualiza as informações do seu campus', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar as informações disponíveis para o "Administrador de Campus"', null, { page }); 
    });

    test('Coordenador visualiza as informações de coordenação', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar as informações disponíveis para o "Coordenador"', null, { page }); 
    });

    test('Aluno visualiza suas informações acadêmicas', { tag: ['@dashboard'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar as informações disponíveis para o "Aluno"', null, { page }); 
    });

  });

  test.describe('O Dashboard do aluno deve apresentar o acompanhamento das solicitações', () => {

    test('Aluno visualiza o acompanhamento das suas solicitações', { tag: ['@dashboard'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existem solicitações cadastradas para o aluno'); 
      await When('acesso o Dashboard', null, { page }); 
      await Then('devo visualizar o acompanhamento das minhas solicitações', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/dashboard.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@dashboard"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@dashboard"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":23,"tags":["@dashboard"],"steps":[{"pwStepLine":21,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":28,"tags":["@dashboard"],"steps":[{"pwStepLine":27,"gherkinStepLine":29,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":36,"pickleLine":36,"tags":["@dashboard"],"steps":[{"pwStepLine":37,"gherkinStepLine":37,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as informações disponíveis para o \"Administrador\"","stepMatchArguments":[{"group":{"start":50,"value":"\"Administrador\"","children":[{"start":51,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":42,"pickleLine":41,"tags":["@dashboard"],"steps":[{"pwStepLine":43,"gherkinStepLine":42,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":44,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":45,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as informações disponíveis para o \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":50,"value":"\"Administrador de Campus\"","children":[{"start":51,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":48,"pickleLine":46,"tags":["@dashboard"],"steps":[{"pwStepLine":49,"gherkinStepLine":47,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":50,"gherkinStepLine":48,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":49,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as informações disponíveis para o \"Coordenador\"","stepMatchArguments":[{"group":{"start":50,"value":"\"Coordenador\"","children":[{"start":51,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":54,"pickleLine":51,"tags":["@dashboard"],"steps":[{"pwStepLine":55,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":56,"gherkinStepLine":53,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":57,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as informações disponíveis para o \"Aluno\"","stepMatchArguments":[{"group":{"start":50,"value":"\"Aluno\"","children":[{"start":51,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":64,"pickleLine":59,"tags":["@dashboard"],"steps":[{"pwStepLine":65,"gherkinStepLine":60,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":66,"gherkinStepLine":61,"keywordType":"Context","textWithKeyword":"E existem solicitações cadastradas para o aluno","stepMatchArguments":[]},{"pwStepLine":67,"gherkinStepLine":62,"keywordType":"Action","textWithKeyword":"Quando acesso o Dashboard","stepMatchArguments":[]},{"pwStepLine":68,"gherkinStepLine":63,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o acompanhamento das minhas solicitações","stepMatchArguments":[]}]},
]; // bdd-data-end