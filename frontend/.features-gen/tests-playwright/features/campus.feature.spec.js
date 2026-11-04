// Generated from: tests-playwright/features/campus.feature
import { test } from "playwright-bdd";

test.describe('Gerenciamento de Campus', () => {

  test.describe('O Administrador pode gerenciar qualquer campus', () => {

    test('Administrador visualiza os campus cadastrados', { tag: ['@campus'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "Campus"', null, { page }); 
      await Then('devo visualizar os campus cadastrados', null, { page }); 
    });

    test('Administrador cadastra um novo campus', { tag: ['@campus'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('cadastro um novo campus', null, { page }); 
      await Then('o campus deve ser cadastrado com sucesso', null, { page }); 
      await And('devo visualizar o campus cadastrado', null, { page }); 
    });

    test('Administrador edita um campus', { tag: ['@campus'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um campus cadastrado'); 
      await When('edito o campus', null, { page }); 
      await Then('as alterações do campus devem ser salvas', null, { page }); 
    });

    test('Administrador exclui um campus', { tag: ['@campus'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um campus cadastrado'); 
      await When('excluo o campus', null, { page }); 
      await Then('o campus não deve mais ser exibido na listagem', null, { page }); 
    });

  });

  test.describe('O Administrador de Campus pode gerenciar somente seu próprio campus', () => {

    test('Administrador de Campus visualiza seu campus', { tag: ['@campus'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso a administração de "Campus"', null, { page }); 
      await Then('devo visualizar meu campus', null, { page }); 
    });

    test('Administrador de Campus edita seu próprio campus', { tag: ['@campus'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('edito meu campus', null, { page }); 
      await Then('as alterações do campus devem ser salvas', null, { page }); 
    });

    test('Administrador de Campus não pode acessar página de outro campus', { tag: ['@campus'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso a página de outro campus', null, { page }); 
      await Then('a operação deve ser impedida', null, { page }); 
    });

  });

  test.describe('Usuários sem permissão não podem gerenciar campus', () => {

    test('Coordenador não pode acessar a administração de Campus', { tag: ['@campus'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('tento acessar a administração de "Campus"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

    test('Aluno não pode acessar a administração de Campus', { tag: ['@campus'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a administração de "Campus"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

  });

  test.describe('O cadastro de campus deve validar os dados obrigatórios', () => {

    test('Usuário tenta cadastrar campus sem informar os dados obrigatórios', { tag: ['@campus'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('tento cadastrar um campus sem informar os dados obrigatórios', null, { page }); 
      await Then('o cadastro não deve ser realizado', null, { page }); 
      await And('devo visualizar as mensagens de validação', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/campus.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@campus"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Campus\"","children":[{"start":27,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os campus cadastrados","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@campus"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando cadastro um novo campus","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então o campus deve ser cadastrado com sucesso","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"E devo visualizar o campus cadastrado","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":24,"tags":["@campus"],"steps":[{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"E existe um campus cadastrado","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"Quando edito o campus","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Então as alterações do campus devem ser salvas","stepMatchArguments":[]}]},
  {"pwTestLine":28,"pickleLine":30,"tags":["@campus"],"steps":[{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"E existe um campus cadastrado","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"Quando excluo o campus","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Então o campus não deve mais ser exibido na listagem","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":39,"tags":["@campus"],"steps":[{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Campus\"","children":[{"start":27,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar meu campus","stepMatchArguments":[]}]},
  {"pwTestLine":45,"pickleLine":44,"tags":["@campus"],"steps":[{"pwStepLine":46,"gherkinStepLine":45,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":46,"keywordType":"Action","textWithKeyword":"Quando edito meu campus","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":47,"keywordType":"Outcome","textWithKeyword":"Então as alterações do campus devem ser salvas","stepMatchArguments":[]}]},
  {"pwTestLine":51,"pickleLine":56,"tags":["@campus"],"steps":[{"pwStepLine":52,"gherkinStepLine":57,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":53,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"Quando acesso a página de outro campus","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Então a operação deve ser impedida","stepMatchArguments":[]}]},
  {"pwTestLine":61,"pickleLine":72,"tags":["@campus"],"steps":[{"pwStepLine":62,"gherkinStepLine":73,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":63,"gherkinStepLine":74,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Campus\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Campus\"","children":[{"start":34,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":64,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":67,"pickleLine":77,"tags":["@campus"],"steps":[{"pwStepLine":68,"gherkinStepLine":78,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":69,"gherkinStepLine":79,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Campus\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Campus\"","children":[{"start":34,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":70,"gherkinStepLine":80,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":77,"pickleLine":85,"tags":["@campus"],"steps":[{"pwStepLine":78,"gherkinStepLine":86,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":79,"gherkinStepLine":87,"keywordType":"Action","textWithKeyword":"Quando tento cadastrar um campus sem informar os dados obrigatórios","stepMatchArguments":[]},{"pwStepLine":80,"gherkinStepLine":88,"keywordType":"Outcome","textWithKeyword":"Então o cadastro não deve ser realizado","stepMatchArguments":[]},{"pwStepLine":81,"gherkinStepLine":89,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as mensagens de validação","stepMatchArguments":[]}]},
]; // bdd-data-end