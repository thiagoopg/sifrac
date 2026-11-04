// Generated from: tests-playwright/features/tipos-hora.feature
import { test } from "playwright-bdd";

test.describe('Gerenciamento de tipos de hora', () => {

  test.describe('O Administrador pode gerenciar os tipos de hora', () => {

    test('Administrador visualiza os tipos de hora cadastrados', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "Tipos de Hora"', null, { page }); 
      await Then('devo visualizar os tipos de hora cadastrados', null, { page }); 
    });

    test('Administrador cadastra um novo tipo de hora', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('cadastro um novo tipo de hora', null, { page }); 
      await Then('o tipo de hora deve ser cadastrado com sucesso', null, { page }); 
      await And('devo visualizar o tipo de hora cadastrado', null, { page }); 
    });

    test('Administrador edita um tipo de hora', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um tipo de hora cadastrado'); 
      await When('edito o tipo de hora', null, { page }); 
      await Then('as alterações do tipo de hora devem ser salvas', null, { page }); 
    });

    test('Administrador exclui um tipo de hora', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um tipo de hora cadastrado'); 
      await When('excluo o tipo de hora', null, { page }); 
      await Then('o tipo de hora não deve mais ser exibido na listagem', null, { page }); 
    });

  });

  test.describe('O Administrador de Campus pode gerenciar os tipos de hora do seu campus', () => {

    test('Administrador de Campus visualiza os tipos de hora do seu campus', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso a administração de "Tipos de Hora"', null, { page }); 
      await Then('devo visualizar os tipos de hora do meu campus', null, { page }); 
    });

    test('Administrador de Campus cadastra um tipo de hora', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('cadastro um tipo de hora para o meu campus', null, { page }); 
      await Then('o tipo de hora deve ser cadastrado com sucesso', null, { page }); 
    });

    test('Administrador de Campus edita um tipo de hora do seu campus', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await And('existe um tipo de hora vinculado ao meu campus'); 
      await When('edito o tipo de hora', null, { page }); 
      await Then('as alterações do tipo de hora devem ser salvas', null, { page }); 
    });

    test('Administrador de Campus exclui um tipo de hora do seu campus', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await And('existe um tipo de hora vinculado ao meu campus'); 
      await When('excluo o tipo de hora', null, { page }); 
      await Then('o tipo de hora não deve mais ser exibido na listagem', null, { page }); 
    });

  });

  test.describe('Usuários sem permissão não podem gerenciar tipos de hora', () => {

    test('Aluno não pode acessar a administração de tipos de hora', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a administração de "Tipos de Hora"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

  });

  test.describe('O cadastro de tipo de hora deve validar os dados obrigatórios', () => {

    test('Usuário tenta cadastrar tipo de hora sem informar os dados obrigatórios', { tag: ['@tipos-hora'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('tento cadastrar um tipo de hora sem informar os dados obrigatórios', null, { page }); 
      await Then('o cadastro não deve ser realizado', null, { page }); 
      await And('devo visualizar as mensagens de validação', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/tipos-hora.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@tipos-hora"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Tipos de Hora\"","children":[{"start":27,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os tipos de hora cadastrados","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@tipos-hora"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando cadastro um novo tipo de hora","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então o tipo de hora deve ser cadastrado com sucesso","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"E devo visualizar o tipo de hora cadastrado","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":24,"tags":["@tipos-hora"],"steps":[{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"E existe um tipo de hora cadastrado","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"Quando edito o tipo de hora","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Então as alterações do tipo de hora devem ser salvas","stepMatchArguments":[]}]},
  {"pwTestLine":28,"pickleLine":30,"tags":["@tipos-hora"],"steps":[{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"E existe um tipo de hora cadastrado","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"Quando excluo o tipo de hora","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Então o tipo de hora não deve mais ser exibido na listagem","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":39,"tags":["@tipos-hora"],"steps":[{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Tipos de Hora\"","children":[{"start":27,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os tipos de hora do meu campus","stepMatchArguments":[]}]},
  {"pwTestLine":45,"pickleLine":44,"tags":["@tipos-hora"],"steps":[{"pwStepLine":46,"gherkinStepLine":45,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":46,"keywordType":"Action","textWithKeyword":"Quando cadastro um tipo de hora para o meu campus","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":47,"keywordType":"Outcome","textWithKeyword":"Então o tipo de hora deve ser cadastrado com sucesso","stepMatchArguments":[]}]},
  {"pwTestLine":51,"pickleLine":49,"tags":["@tipos-hora"],"steps":[{"pwStepLine":52,"gherkinStepLine":50,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":53,"gherkinStepLine":51,"keywordType":"Context","textWithKeyword":"E existe um tipo de hora vinculado ao meu campus","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"Quando edito o tipo de hora","stepMatchArguments":[]},{"pwStepLine":55,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Então as alterações do tipo de hora devem ser salvas","stepMatchArguments":[]}]},
  {"pwTestLine":58,"pickleLine":55,"tags":["@tipos-hora"],"steps":[{"pwStepLine":59,"gherkinStepLine":56,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":60,"gherkinStepLine":57,"keywordType":"Context","textWithKeyword":"E existe um tipo de hora vinculado ao meu campus","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"Quando excluo o tipo de hora","stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Então o tipo de hora não deve mais ser exibido na listagem","stepMatchArguments":[]}]},
  {"pwTestLine":69,"pickleLine":83,"tags":["@tipos-hora"],"steps":[{"pwStepLine":70,"gherkinStepLine":84,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":71,"gherkinStepLine":85,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Tipos de Hora\"","children":[{"start":34,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":72,"gherkinStepLine":86,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":79,"pickleLine":91,"tags":["@tipos-hora"],"steps":[{"pwStepLine":80,"gherkinStepLine":92,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":81,"gherkinStepLine":93,"keywordType":"Action","textWithKeyword":"Quando tento cadastrar um tipo de hora sem informar os dados obrigatórios","stepMatchArguments":[]},{"pwStepLine":82,"gherkinStepLine":94,"keywordType":"Outcome","textWithKeyword":"Então o cadastro não deve ser realizado","stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":95,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as mensagens de validação","stepMatchArguments":[]}]},
]; // bdd-data-end