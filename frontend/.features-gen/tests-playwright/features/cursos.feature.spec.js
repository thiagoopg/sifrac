// Generated from: tests-playwright/features/cursos.feature
import { test } from "playwright-bdd";

test.describe('Gerenciamento de Cursos', () => {

  test.describe('O Administrador pode gerenciar os cursos', () => {

    test('Administrador visualiza os cursos cadastrados', { tag: ['@cursos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "Cursos"', null, { page }); 
      await Then('devo visualizar os cursos cadastrados', null, { page }); 
    });

    test('Administrador cadastra um novo curso', { tag: ['@cursos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('cadastro um novo curso', null, { page }); 
      await Then('o curso deve ser cadastrado com sucesso', null, { page }); 
      await And('devo visualizar o curso cadastrado', null, { page }); 
    });

    test('Administrador edita um curso', { tag: ['@cursos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um curso cadastrado'); 
      await When('edito o curso', null, { page }); 
      await Then('as alterações do curso devem ser salvas', null, { page }); 
    });

    test('Administrador exclui um curso', { tag: ['@cursos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um curso cadastrado'); 
      await When('excluo o curso', null, { page }); 
      await Then('o curso não deve mais ser exibido na listagem', null, { page }); 
    });

  });

  test.describe('O Administrador de Campus pode gerenciar cursos do seu campus', () => {

    test('Administrador de Campus visualiza os cursos do seu campus', { tag: ['@cursos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso a administração de "Cursos"', null, { page }); 
      await Then('devo visualizar os cursos do meu campus', null, { page }); 
    });

    test('Administrador de Campus cadastra um curso no seu campus', { tag: ['@cursos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('cadastro um curso para o meu campus', null, { page }); 
      await Then('o curso deve ser cadastrado com sucesso', null, { page }); 
    });

    test('Administrador de Campus edita um curso do seu campus', { tag: ['@cursos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await And('existe um curso vinculado ao meu campus'); 
      await When('edito o curso', null, { page }); 
      await Then('as alterações do curso devem ser salvas', null, { page }); 
    });

    test('Administrador de Campus exclui um curso do seu campus', { tag: ['@cursos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await And('existe um curso vinculado ao meu campus'); 
      await When('excluo o curso', null, { page }); 
      await Then('o curso não deve mais ser exibido na listagem', null, { page }); 
    });

  });

  test.describe('O Coordenador pode consultar cursos', () => {

    test('Coordenador visualiza os cursos disponíveis', { tag: ['@cursos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('acesso a administração de "Cursos"', null, { page }); 
      await Then('devo visualizar os cursos disponíveis', null, { page }); 
    });

  });

  test.describe('Usuários sem permissão não podem gerenciar cursos', () => {

    test('Aluno não pode acessar a administração de Cursos', { tag: ['@cursos'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a administração de "Cursos"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

  });

  test.describe('O cadastro de curso deve validar os dados obrigatórios', () => {

    test('Usuário tenta cadastrar curso sem informar os dados obrigatórios', { tag: ['@cursos'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('tento cadastrar um curso sem informar os dados obrigatórios', null, { page }); 
      await Then('o cadastro não deve ser realizado', null, { page }); 
      await And('devo visualizar as mensagens de validação', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/cursos.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@cursos"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Cursos\"","children":[{"start":27,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os cursos cadastrados","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@cursos"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando cadastro um novo curso","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então o curso deve ser cadastrado com sucesso","stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"E devo visualizar o curso cadastrado","stepMatchArguments":[]}]},
  {"pwTestLine":21,"pickleLine":24,"tags":["@cursos"],"steps":[{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"E existe um curso cadastrado","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"Quando edito o curso","stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Então as alterações do curso devem ser salvas","stepMatchArguments":[]}]},
  {"pwTestLine":28,"pickleLine":30,"tags":["@cursos"],"steps":[{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"E existe um curso cadastrado","stepMatchArguments":[]},{"pwStepLine":31,"gherkinStepLine":33,"keywordType":"Action","textWithKeyword":"Quando excluo o curso","stepMatchArguments":[]},{"pwStepLine":32,"gherkinStepLine":34,"keywordType":"Outcome","textWithKeyword":"Então o curso não deve mais ser exibido na listagem","stepMatchArguments":[]}]},
  {"pwTestLine":39,"pickleLine":39,"tags":["@cursos"],"steps":[{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Cursos\"","children":[{"start":27,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":42,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os cursos do meu campus","stepMatchArguments":[]}]},
  {"pwTestLine":45,"pickleLine":44,"tags":["@cursos"],"steps":[{"pwStepLine":46,"gherkinStepLine":45,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":46,"keywordType":"Action","textWithKeyword":"Quando cadastro um curso para o meu campus","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":47,"keywordType":"Outcome","textWithKeyword":"Então o curso deve ser cadastrado com sucesso","stepMatchArguments":[]}]},
  {"pwTestLine":51,"pickleLine":49,"tags":["@cursos"],"steps":[{"pwStepLine":52,"gherkinStepLine":50,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":53,"gherkinStepLine":51,"keywordType":"Context","textWithKeyword":"E existe um curso vinculado ao meu campus","stepMatchArguments":[]},{"pwStepLine":54,"gherkinStepLine":52,"keywordType":"Action","textWithKeyword":"Quando edito o curso","stepMatchArguments":[]},{"pwStepLine":55,"gherkinStepLine":53,"keywordType":"Outcome","textWithKeyword":"Então as alterações do curso devem ser salvas","stepMatchArguments":[]}]},
  {"pwTestLine":58,"pickleLine":55,"tags":["@cursos"],"steps":[{"pwStepLine":59,"gherkinStepLine":56,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":60,"gherkinStepLine":57,"keywordType":"Context","textWithKeyword":"E existe um curso vinculado ao meu campus","stepMatchArguments":[]},{"pwStepLine":61,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"Quando excluo o curso","stepMatchArguments":[]},{"pwStepLine":62,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Então o curso não deve mais ser exibido na listagem","stepMatchArguments":[]}]},
  {"pwTestLine":69,"pickleLine":78,"tags":["@cursos"],"steps":[{"pwStepLine":70,"gherkinStepLine":79,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":71,"gherkinStepLine":80,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Cursos\"","children":[{"start":27,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":72,"gherkinStepLine":81,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os cursos disponíveis","stepMatchArguments":[]}]},
  {"pwTestLine":79,"pickleLine":86,"tags":["@cursos"],"steps":[{"pwStepLine":80,"gherkinStepLine":87,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":81,"gherkinStepLine":88,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Cursos\"","children":[{"start":34,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":82,"gherkinStepLine":89,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":89,"pickleLine":94,"tags":["@cursos"],"steps":[{"pwStepLine":90,"gherkinStepLine":95,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":91,"gherkinStepLine":96,"keywordType":"Action","textWithKeyword":"Quando tento cadastrar um curso sem informar os dados obrigatórios","stepMatchArguments":[]},{"pwStepLine":92,"gherkinStepLine":97,"keywordType":"Outcome","textWithKeyword":"Então o cadastro não deve ser realizado","stepMatchArguments":[]},{"pwStepLine":93,"gherkinStepLine":98,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as mensagens de validação","stepMatchArguments":[]}]},
]; // bdd-data-end