// Generated from: tests-playwright/features/usuarios.feature
import { test } from "playwright-bdd";

test.describe('Gerenciamento de usuários', () => {

  test.describe('Apenas o Administrador pode gerenciar usuários', () => {

    test('Administrador acessa o gerenciamento de usuários', { tag: ['@usuarios'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "Usuários"', null, { page }); 
      await Then('devo visualizar os usuários cadastrados', null, { page }); 
    });

    test('Administrador de Campus não pode acessar o gerenciamento de usuários', { tag: ['@usuarios'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('tento acessar a administração de "Usuários"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

    test('Coordenador não pode acessar o gerenciamento de usuários', { tag: ['@usuarios'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('tento acessar a administração de "Usuários"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

    test('Aluno não pode acessar o gerenciamento de usuários', { tag: ['@usuarios'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a administração de "Usuários"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
    });

  });

  test.describe('O Administrador pode consultar usuários', () => {

    test('Administrador visualiza os dados de um usuário', { tag: ['@usuarios'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um usuário cadastrado'); 
      await When('acesso os dados do usuário', null, { page }); 
      await Then('devo visualizar as informações do usuário', null, { page }); 
    });

    test('Administrador pesquisa um usuário', { tag: ['@usuarios'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existem usuários cadastrados'); 
      await When('pesquiso por um usuário', null, { page }); 
      await Then('devo visualizar o usuário correspondente à pesquisa', null, { page }); 
    });

  });

  test.describe('O Administrador pode gerenciar administradores de campus', () => {

    test('Administrador visualiza os administradores de campus', { tag: ['@usuarios'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "campus"', null, { page }); 
      await Then('devo visualizar os administradores vinculados aos campus', null, { page }); 
    });

    test('Administrador remove um administrador de campus', { tag: ['@usuarios'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe um administrador vinculado a um campus', null, { page }); 
      await When('removo o vínculo do administrador com o campus', null, { page }); 
      await Then('o administrador não deve mais estar vinculado ao campus', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/usuarios.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@usuarios"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"Usuários\"","stepMatchArguments":[{"group":{"start":26,"value":"\"Usuários\"","children":[{"start":27,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os usuários cadastrados","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@usuarios"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Usuários\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Usuários\"","children":[{"start":34,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":23,"tags":["@usuarios"],"steps":[{"pwStepLine":21,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Usuários\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Usuários\"","children":[{"start":34,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":28,"tags":["@usuarios"],"steps":[{"pwStepLine":27,"gherkinStepLine":29,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"Usuários\"","stepMatchArguments":[{"group":{"start":33,"value":"\"Usuários\"","children":[{"start":34,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]}]},
  {"pwTestLine":36,"pickleLine":36,"tags":["@usuarios"],"steps":[{"pwStepLine":37,"gherkinStepLine":37,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Context","textWithKeyword":"E existe um usuário cadastrado","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Action","textWithKeyword":"Quando acesso os dados do usuário","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as informações do usuário","stepMatchArguments":[]}]},
  {"pwTestLine":43,"pickleLine":42,"tags":["@usuarios"],"steps":[{"pwStepLine":44,"gherkinStepLine":43,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":44,"keywordType":"Context","textWithKeyword":"E existem usuários cadastrados","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":45,"keywordType":"Action","textWithKeyword":"Quando pesquiso por um usuário","stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o usuário correspondente à pesquisa","stepMatchArguments":[]}]},
  {"pwTestLine":54,"pickleLine":51,"tags":["@usuarios"],"steps":[{"pwStepLine":55,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":56,"gherkinStepLine":53,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"campus\"","children":[{"start":27,"value":"campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":57,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os administradores vinculados aos campus","stepMatchArguments":[]}]},
  {"pwTestLine":60,"pickleLine":56,"tags":["@usuarios"],"steps":[{"pwStepLine":61,"gherkinStepLine":57,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":62,"gherkinStepLine":58,"keywordType":"Context","textWithKeyword":"E existe um administrador vinculado a um campus","stepMatchArguments":[]},{"pwStepLine":63,"gherkinStepLine":59,"keywordType":"Action","textWithKeyword":"Quando removo o vínculo do administrador com o campus","stepMatchArguments":[]},{"pwStepLine":64,"gherkinStepLine":60,"keywordType":"Outcome","textWithKeyword":"Então o administrador não deve mais estar vinculado ao campus","stepMatchArguments":[]}]},
]; // bdd-data-end