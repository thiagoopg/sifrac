// Generated from: tests-playwright/features/alunos.feature
import { test } from "playwright-bdd";

test.describe('Consulta e gerenciamento de alunos', () => {

  test.describe('O Administrador pode consultar os alunos', () => {

    test('Administrador visualiza os alunos cadastrados', { tag: ['@alunos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "Alunos"', null, { page }); 
      await Then('devo visualizar os alunos cadastrados', null, { page }); 
    });

    test('Administrador visualiza os dados de um aluno', { tag: ['@alunos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um aluno cadastrado'); 
      await When('acesso os dados do aluno', null, { page }); 
      await Then('devo visualizar as informações do aluno', null, { page }); 
    });

  });

  test.describe('Usuários sem permissão não podem acessar os alunos', () => {

    test('Administrador de Campus não pode acessar os alunos', { tag: ['@alunos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('tento acessar a administração de "Alunos"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

    test('Coordenador não pode acessar os alunos', { tag: ['@alunos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('tento acessar a administração de "Alunos"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

    test('Aluno não pode acessar a administração de outros alunos', { tag: ['@alunos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a administração de "Alunos"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

  });

  test.describe('O Administrador deve conseguir localizar alunos', () => {

    test('Administrador pesquisa um aluno', { tag: ['@alunos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existem alunos cadastrados'); 
      await When('pesquiso por um aluno', null, { page }); 
      await Then('devo visualizar o aluno correspondente à pesquisa', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/alunos.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@alunos"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Alunos\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Alunos\"","children":[{"start":27,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os alunos cadastrados","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@alunos"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Context","textWithKeyword":"E existe um aluno cadastrado","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Action","textWithKeyword":"Quando acesso os dados do aluno","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as informações do aluno","stepMatchArguments":[]}]},
  {"pwTestLine":25,"pickleLine":27,"tags":["@alunos"],"steps":[{"pwStepLine":26,"gherkinStepLine":28,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":29,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Alunos\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Alunos\"","children":[{"start":34,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":30,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":31,"pickleLine":32,"tags":["@alunos"],"steps":[{"pwStepLine":32,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":33,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Alunos\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Alunos\"","children":[{"start":34,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":37,"tags":["@alunos"],"steps":[{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Alunos\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Alunos\"","children":[{"start":34,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":47,"pickleLine":45,"tags":["@alunos"],"steps":[{"pwStepLine":48,"gherkinStepLine":46,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":49,"gherkinStepLine":47,"keywordType":"Context","textWithKeyword":"E existem alunos cadastrados","stepMatchArguments":[]},{"pwStepLine":50,"gherkinStepLine":48,"keywordType":"Action","textWithKeyword":"Quando pesquiso por um aluno","stepMatchArguments":[]},{"pwStepLine":51,"gherkinStepLine":49,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o aluno correspondente à pesquisa","stepMatchArguments":[]}]},
]; // bdd-data-end