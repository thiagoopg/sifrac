// Generated from: tests-playwright/features/navegacao.feature
import { test } from "playwright-bdd";

test.describe('Navegação pelo sistema', () => {

  test.describe('O usuário deve conseguir navegar pelo menu disponível ao seu perfil', () => {

    test('Administrador navega para o Dashboard', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Dashboard"', null, { page }); 
      await Then('devo ser direcionado para o Dashboard', null, { page }); 
    });

    test('Administrador navega para Campus', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Campus"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Campus"', null, { page }); 
    });

    test('Administrador navega para Cursos', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Cursos"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Cursos"', null, { page }); 
    });

    test('Administrador navega para Alunos', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Alunos"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Alunos"', null, { page }); 
    });

    test('Administrador navega para Solicitações', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Solicitações"', null, { page }); 
      await Then('devo ser direcionado para as Solicitações', null, { page }); 
    });

    test('Administrador navega para Tipos de Hora', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Tipos de Hora"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Tipos de Hora"', null, { page }); 
    });

    test('Administrador navega para Usuários', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('seleciono a opção "Usuários"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Usuários"', null, { page }); 
    });

  });

  test.describe('O Administrador de Campus deve navegar pelas funcionalidades permitidas', () => {

    test('Administrador de Campus navega para Campus', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('seleciono a opção "Campus"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Campus"', null, { page }); 
    });

    test('Administrador de Campus navega para Cursos', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('seleciono a opção "Cursos"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Cursos"', null, { page }); 
    });

    test('Administrador de Campus navega para Tipos de Hora', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('seleciono a opção "Tipos de Hora"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Tipos de Hora"', null, { page }); 
    });

    test('Administrador de Campus navega para Solicitações', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('seleciono a opção "Solicitações"', null, { page }); 
      await Then('devo ser direcionado para as Solicitações', null, { page }); 
    });

  });

  test.describe('O Coordenador deve navegar pelas funcionalidades permitidas', () => {

    test('Coordenador navega para Cursos', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('seleciono a opção "Cursos"', null, { page }); 
      await Then('devo ser direcionado para a administração de "Cursos"', null, { page }); 
    });

    test('Coordenador navega para Solicitações', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('seleciono a opção "Solicitações"', null, { page }); 
      await Then('devo ser direcionado para as Solicitações', null, { page }); 
    });

  });

  test.describe('O Aluno deve navegar pelas funcionalidades permitidas', () => {

    test('Aluno navega para o Dashboard', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('seleciono a opção "Dashboard"', null, { page }); 
      await Then('devo ser direcionado para o Dashboard', null, { page }); 
    });

    test('Aluno navega para Solicitações', { tag: ['@navegacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('seleciono a opção "Solicitações"', null, { page }); 
      await Then('devo ser direcionado para as Solicitações', null, { page }); 
    });

  });

  test.describe('O usuário deve conseguir retornar ao Dashboard', () => {

    test('Usuário retorna ao Dashboard pelo menu', { tag: ['@navegacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado no sistema', null, { page }); 
      await And('estou em uma funcionalidade diferente do Dashboard', null, { page }); 
      await When('seleciono a opção "Dashboard"', null, { page }); 
      await Then('devo ser direcionado para o Dashboard', null, { page }); 
    });

  });

  test.describe('O encerramento da sessão deve estar disponível para usuários autenticados', () => {

    test('Usuário encerra a sessão pelo menu', { tag: ['@navegacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado no sistema', null, { page }); 
      await When('seleciono a opção de encerramento da sessão', null, { page }); 
      await Then('devo ser direcionado para a página de login', null, { page }); 
      await And('não devo mais estar autenticado', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/navegacao.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@navegacao"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Dashboard\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Dashboard\"","children":[{"start":19,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@navegacao"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Campus\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Campus\"","children":[{"start":19,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Campus\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Campus\"","children":[{"start":46,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":20,"pickleLine":23,"tags":["@navegacao"],"steps":[{"pwStepLine":21,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Cursos\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Cursos\"","children":[{"start":19,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Cursos\"","children":[{"start":46,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":26,"pickleLine":28,"tags":["@navegacao"],"steps":[{"pwStepLine":27,"gherkinStepLine":29,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":30,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Alunos\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Alunos\"","children":[{"start":19,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Alunos\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Alunos\"","children":[{"start":46,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":32,"pickleLine":33,"tags":["@navegacao"],"steps":[{"pwStepLine":33,"gherkinStepLine":34,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":34,"gherkinStepLine":35,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Solicitações\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Solicitações\"","children":[{"start":19,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":35,"gherkinStepLine":36,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para as Solicitações","stepMatchArguments":[]}]},
  {"pwTestLine":38,"pickleLine":38,"tags":["@navegacao"],"steps":[{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Tipos de Hora\"","children":[{"start":19,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Tipos de Hora\"","children":[{"start":46,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":44,"pickleLine":43,"tags":["@navegacao"],"steps":[{"pwStepLine":45,"gherkinStepLine":44,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":46,"gherkinStepLine":45,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Usuários\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Usuários\"","children":[{"start":19,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":47,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Usuários\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Usuários\"","children":[{"start":46,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":54,"pickleLine":51,"tags":["@navegacao"],"steps":[{"pwStepLine":55,"gherkinStepLine":52,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":56,"gherkinStepLine":53,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Campus\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Campus\"","children":[{"start":19,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":57,"gherkinStepLine":54,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Campus\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Campus\"","children":[{"start":46,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":60,"pickleLine":56,"tags":["@navegacao"],"steps":[{"pwStepLine":61,"gherkinStepLine":57,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":62,"gherkinStepLine":58,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Cursos\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Cursos\"","children":[{"start":19,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":63,"gherkinStepLine":59,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Cursos\"","children":[{"start":46,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":66,"pickleLine":61,"tags":["@navegacao"],"steps":[{"pwStepLine":67,"gherkinStepLine":62,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":68,"gherkinStepLine":63,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Tipos de Hora\"","children":[{"start":19,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":69,"gherkinStepLine":64,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Tipos de Hora\"","children":[{"start":46,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":72,"pickleLine":66,"tags":["@navegacao"],"steps":[{"pwStepLine":73,"gherkinStepLine":67,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":74,"gherkinStepLine":68,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Solicitações\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Solicitações\"","children":[{"start":19,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":75,"gherkinStepLine":69,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para as Solicitações","stepMatchArguments":[]}]},
  {"pwTestLine":82,"pickleLine":74,"tags":["@navegacao"],"steps":[{"pwStepLine":83,"gherkinStepLine":75,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":84,"gherkinStepLine":76,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Cursos\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Cursos\"","children":[{"start":19,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":85,"gherkinStepLine":77,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a administração de \"Cursos\"","stepMatchArguments":[{"group":{"start":45,"value":"\"Cursos\"","children":[{"start":46,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":88,"pickleLine":79,"tags":["@navegacao"],"steps":[{"pwStepLine":89,"gherkinStepLine":80,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":90,"gherkinStepLine":81,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Solicitações\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Solicitações\"","children":[{"start":19,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":91,"gherkinStepLine":82,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para as Solicitações","stepMatchArguments":[]}]},
  {"pwTestLine":98,"pickleLine":87,"tags":["@navegacao"],"steps":[{"pwStepLine":99,"gherkinStepLine":88,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":100,"gherkinStepLine":89,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Dashboard\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Dashboard\"","children":[{"start":19,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":101,"gherkinStepLine":90,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":104,"pickleLine":92,"tags":["@navegacao"],"steps":[{"pwStepLine":105,"gherkinStepLine":93,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":106,"gherkinStepLine":94,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Solicitações\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Solicitações\"","children":[{"start":19,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":107,"gherkinStepLine":95,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para as Solicitações","stepMatchArguments":[]}]},
  {"pwTestLine":114,"pickleLine":100,"tags":["@navegacao"],"steps":[{"pwStepLine":115,"gherkinStepLine":101,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado no sistema","stepMatchArguments":[]},{"pwStepLine":116,"gherkinStepLine":102,"keywordType":"Context","textWithKeyword":"E estou em uma funcionalidade diferente do Dashboard","stepMatchArguments":[]},{"pwStepLine":117,"gherkinStepLine":103,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção \"Dashboard\"","stepMatchArguments":[{"group":{"start":18,"value":"\"Dashboard\"","children":[{"start":19,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":118,"gherkinStepLine":104,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para o Dashboard","stepMatchArguments":[]}]},
  {"pwTestLine":125,"pickleLine":109,"tags":["@navegacao"],"steps":[{"pwStepLine":126,"gherkinStepLine":110,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado no sistema","stepMatchArguments":[]},{"pwStepLine":127,"gherkinStepLine":111,"keywordType":"Action","textWithKeyword":"Quando seleciono a opção de encerramento da sessão","stepMatchArguments":[]},{"pwStepLine":128,"gherkinStepLine":112,"keywordType":"Outcome","textWithKeyword":"Então devo ser direcionado para a página de login","stepMatchArguments":[]},{"pwStepLine":129,"gherkinStepLine":113,"keywordType":"Outcome","textWithKeyword":"E não devo mais estar autenticado","stepMatchArguments":[]}]},
]; // bdd-data-end