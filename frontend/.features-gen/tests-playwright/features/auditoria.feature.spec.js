// Generated from: tests-playwright/features/auditoria.feature
import { test } from "playwright-bdd";

test.describe('Auditoria de solicitações', () => {

  test.describe('O histórico da solicitação deve registrar suas alterações', () => {

    test('Solicitação registra seu cadastro no histórico', { tag: ['@auditoria'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('cadastro uma solicitação de horas complementares', null, { page }); 
      await Then('o cadastro da solicitação deve ser registrado no histórico', null, { page }); 
    });

    test('Solicitação registra sua avaliação no histórico', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('avalio a solicitação', null, { page }); 
      await Then('a avaliação deve ser registrada no histórico', null, { page }); 
    });

  });

  test.describe('O Aluno pode consultar o histórico das suas solicitações', () => {

    test('Aluno consulta o histórico da sua solicitação', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação cadastrada pelo aluno'); 
      await When('acesso o histórico da solicitação', null, { page }); 
      await Then('devo visualizar o histórico da solicitação', null, { page }); 
    });

    test('Aluno não pode consultar o histórico de outro aluno', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação pertencente a outro aluno'); 
      await When('tento acessar o histórico da solicitação', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

  });

  test.describe('O Coordenador pode consultar o histórico das solicitações', () => {

    test('Coordenador consulta o histórico de uma solicitação', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação cadastrada'); 
      await When('acesso o histórico da solicitação', null, { page }); 
      await Then('devo visualizar o histórico da solicitação', null, { page }); 
    });

  });

  test.describe('O histórico deve apresentar as informações das alterações', () => {

    test('Histórico apresenta o status anterior e o novo status', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('uma solicitação teve seu status alterado'); 
      await When('consulto o histórico da solicitação', null, { page }); 
      await Then('devo visualizar o status anterior', null, { page }); 
      await And('devo visualizar o novo status', null, { page }); 
    });

    test('Histórico apresenta a data da alteração', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('uma solicitação possui alterações registradas'); 
      await When('consulto o histórico da solicitação', null, { page }); 
      await Then('devo visualizar a data de cada alteração', null, { page }); 
    });

    test('Histórico apresenta o usuário responsável pela alteração', { tag: ['@auditoria'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('uma solicitação possui alterações registradas'); 
      await When('consulto o histórico da solicitação', null, { page }); 
      await Then('devo visualizar o usuário responsável por cada alteração', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/auditoria.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@auditoria"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando cadastro uma solicitação de horas complementares","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então o cadastro da solicitação deve ser registrado no histórico","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@auditoria"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"Quando avalio a solicitação","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Então a avaliação deve ser registrada no histórico","stepMatchArguments":[]}]},
  {"pwTestLine":25,"pickleLine":34,"tags":["@auditoria"],"steps":[{"pwStepLine":26,"gherkinStepLine":35,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":36,"keywordType":"Context","textWithKeyword":"E existe uma solicitação cadastrada pelo aluno","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":37,"keywordType":"Action","textWithKeyword":"Quando acesso o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":38,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o histórico da solicitação","stepMatchArguments":[]}]},
  {"pwTestLine":32,"pickleLine":40,"tags":["@auditoria"],"steps":[{"pwStepLine":33,"gherkinStepLine":41,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":42,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pertencente a outro aluno","stepMatchArguments":[]},{"pwStepLine":35,"gherkinStepLine":43,"keywordType":"Action","textWithKeyword":"Quando tento acessar o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":36,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":43,"pickleLine":49,"tags":["@auditoria"],"steps":[{"pwStepLine":44,"gherkinStepLine":50,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":51,"keywordType":"Context","textWithKeyword":"E existe uma solicitação cadastrada","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"Quando acesso o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o histórico da solicitação","stepMatchArguments":[]}]},
  {"pwTestLine":54,"pickleLine":58,"tags":["@auditoria"],"steps":[{"pwStepLine":55,"gherkinStepLine":59,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":56,"gherkinStepLine":60,"keywordType":"Context","textWithKeyword":"E uma solicitação teve seu status alterado","stepMatchArguments":[]},{"pwStepLine":57,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"Quando consulto o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":62,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o status anterior","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":63,"keywordType":"Outcome","textWithKeyword":"E devo visualizar o novo status","stepMatchArguments":[]}]},
  {"pwTestLine":62,"pickleLine":65,"tags":["@auditoria"],"steps":[{"pwStepLine":63,"gherkinStepLine":66,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":64,"gherkinStepLine":67,"keywordType":"Context","textWithKeyword":"E uma solicitação possui alterações registradas","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":68,"keywordType":"Action","textWithKeyword":"Quando consulto o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":66,"gherkinStepLine":69,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar a data de cada alteração","stepMatchArguments":[]}]},
  {"pwTestLine":69,"pickleLine":71,"tags":["@auditoria"],"steps":[{"pwStepLine":70,"gherkinStepLine":72,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":71,"gherkinStepLine":73,"keywordType":"Context","textWithKeyword":"E uma solicitação possui alterações registradas","stepMatchArguments":[]},{"pwStepLine":72,"gherkinStepLine":74,"keywordType":"Action","textWithKeyword":"Quando consulto o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":73,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o usuário responsável por cada alteração","stepMatchArguments":[]}]},
]; // bdd-data-end