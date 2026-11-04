// Generated from: tests-playwright/features/autorizacao.feature
import { test } from "playwright-bdd";

test.describe('Autorização de acesso às funcionalidades', () => {

  test.describe('O Administrador possui acesso às funcionalidades administrativas', () => {

    test('Administrador visualiza as opções administrativas disponíveis', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso o sistema'); 
      await Then('devo visualizar as opções de "Dashboard"', null, { page }); 
      await And('devo visualizar as opções de "Campus"', null, { page }); 
      await And('devo visualizar as opções de "Cursos"', null, { page }); 
      await And('devo visualizar as opções de "Alunos"', null, { page }); 
      await And('devo visualizar as opções de "Solicitações"', null, { page }); 
      await And('devo visualizar as opções de "Tipos de Hora"', null, { page }); 
      await And('devo visualizar as opções de "Usuários"', null, { page }); 
    });

    test('Administrador pode acessar a administração de campus', { tag: ['@autorizacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso a administração de "campus"', null, { page }); 
      await Then('devo ter acesso à funcionalidade', null, { page }); 
    });

    test('Administrador pode gerenciar qualquer campus', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existem diferentes campus cadastrados'); 
      await When('acesso o gerenciamento de "campus"', null, { page }); 
      await Then('devo poder editar um campus diferente do meu', null, { page }); 
    });

  });

  test.describe('O Administrador de Campus possui acesso limitado ao seu campus', () => {

    test('Administrador de Campus visualiza somente as funcionalidades permitidas', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, But, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso o sistema'); 
      await Then('devo visualizar as opções de "Dashboard"', null, { page }); 
      await And('devo visualizar as opções de "Campus"', null, { page }); 
      await And('devo visualizar as opções de "Cursos"', null, { page }); 
      await And('devo visualizar as opções de "Tipos de Hora"', null, { page }); 
      await And('devo visualizar as opções de "Solicitações"', null, { page }); 
      await But('não devo visualizar a opção de "Usuários"', null, { page }); 
      await And('não devo visualizar a opção de "Alunos"', null, { page }); 
    });

    test('Administrador de Campus pode gerenciar seu próprio campus', { tag: ['@autorizacao'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso o gerenciamento de "campus"', null, { page }); 
      await Then('devo poder editar o meu campus', null, { page }); 
    });

    test('Administrador de Campus não pode editar outro campus', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await And('existe um campus ao qual não estou vinculado'); 
      await When('tento editar esse campus', null, { page }); 
      await Then('a operação deve ser impedida', null, { page }); 
    });

  });

  test.describe('O Coordenador possui acesso às funcionalidades de coordenação', () => {

    test('Coordenador visualiza somente as funcionalidades permitidas', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, But, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('acesso o sistema'); 
      await Then('devo visualizar as opções de "Dashboard"', null, { page }); 
      await And('devo visualizar as opções de "Cursos"', null, { page }); 
      await And('devo visualizar as opções de "Solicitações"', null, { page }); 
      await But('não devo visualizar a opção de "Campus"', null, { page }); 
      await And('não devo visualizar a opção de "Alunos"', null, { page }); 
      await And('não devo visualizar a opção de "Usuários"', null, { page }); 
      await And('não devo visualizar a opção de "Tipos de Hora"', null, { page }); 
    });

  });

  test.describe('O Aluno possui acesso somente às suas funcionalidades', () => {

    test('Aluno visualiza somente suas funcionalidades', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, But, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('acesso o sistema'); 
      await Then('devo visualizar as opções de "Dashboard"', null, { page }); 
      await And('devo visualizar as opções de "Solicitações"', null, { page }); 
      await But('não devo visualizar a opção de "Campus"', null, { page }); 
      await And('não devo visualizar a opção de "Cursos"', null, { page }); 
      await And('não devo visualizar a opção de "Tipos de Hora"', null, { page }); 
      await And('não devo visualizar a opção de "Usuários"', null, { page }); 
      await And('não devo visualizar a opção de "Alunos"', null, { page }); 
      await And('não devo visualizar a opção de Administração de Campus', null, { page }); 
    });

  });

  test.describe('Rotas restritas devem impedir acesso não autorizado', () => {

    test('Aluno tenta acessar uma funcionalidade administrativa', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a funcionalidade de "Campus"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Aluno tenta acessar a administração de cursos', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a funcionalidade de "Cursos"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Aluno tenta acessar a administração de tipos de hora', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a funcionalidade de "Tipos de Hora"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Aluno tenta acessar o gerenciamento de usuários', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a funcionalidade de "Usuários"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Aluno tenta acessar o gerenciamento de alunos', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a funcionalidade de "Alunos"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Aluno tenta acessar a administração de campus', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento acessar a administração de "campus"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Coordenador tenta acessar a administração de campus', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('tento acessar a administração de "campus"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

    test('Coordenador tenta acessar o gerenciamento de usuários', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('tento acessar o gerenciamento de "usuários"', null, { page }); 
      await Then('o acesso deve ser negado', null, { page }); 
      await And('devo ser direcionado para uma página permitida ao meu perfil', null, { page }); 
    });

  });

  test.describe('Apenas o Coordenador pode avaliar solicitações', () => {

    test('Coordenador pode avaliar uma solicitação', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('acesso a solicitação', null, { page }); 
      await Then('devo visualizar a opção de avaliação', null, { page }); 
    });

    test('Administrador não pode avaliar uma solicitação', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('acesso a solicitação', null, { page }); 
      await Then('não devo visualizar a opção de avaliação', null, { page }); 
    });

    test('Aluno não pode avaliar uma solicitação', { tag: ['@autorizacao'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('acesso a solicitação', null, { page }); 
      await Then('não devo visualizar a opção de avaliação', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/autorizacao.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@autorizacao"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso o sistema","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as opções de \"Dashboard\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Dashboard\"","children":[{"start":30,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":12,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Campus\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Campus\"","children":[{"start":30,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Cursos\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Cursos\"","children":[{"start":30,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":14,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Alunos\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Alunos\"","children":[{"start":30,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":15,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Solicitações\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Solicitações\"","children":[{"start":30,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Tipos de Hora\"","children":[{"start":30,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":17,"gherkinStepLine":22,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Usuários\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Usuários\"","children":[{"start":30,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":20,"pickleLine":25,"tags":["@autorizacao"],"steps":[{"pwStepLine":21,"gherkinStepLine":26,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":27,"keywordType":"Action","textWithKeyword":"Quando acesso a administração de \"campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"campus\"","children":[{"start":27,"value":"campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":23,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"Então devo ter acesso à funcionalidade","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":31,"tags":["@autorizacao"],"steps":[{"pwStepLine":27,"gherkinStepLine":32,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":33,"keywordType":"Context","textWithKeyword":"E existem diferentes campus cadastrados","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":34,"keywordType":"Action","textWithKeyword":"Quando acesso o gerenciamento de \"campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"campus\"","children":[{"start":27,"value":"campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":30,"gherkinStepLine":35,"keywordType":"Outcome","textWithKeyword":"Então devo poder editar um campus diferente do meu","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":40,"tags":["@autorizacao"],"steps":[{"pwStepLine":38,"gherkinStepLine":41,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":39,"gherkinStepLine":42,"keywordType":"Action","textWithKeyword":"Quando acesso o sistema","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":43,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as opções de \"Dashboard\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Dashboard\"","children":[{"start":30,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":41,"gherkinStepLine":44,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Campus\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Campus\"","children":[{"start":30,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":42,"gherkinStepLine":45,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Cursos\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Cursos\"","children":[{"start":30,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":43,"gherkinStepLine":46,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Tipos de Hora\"","children":[{"start":30,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":44,"gherkinStepLine":47,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Solicitações\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Solicitações\"","children":[{"start":30,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":45,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Mas não devo visualizar a opção de \"Usuários\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Usuários\"","children":[{"start":32,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":46,"gherkinStepLine":49,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Alunos\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Alunos\"","children":[{"start":32,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":49,"pickleLine":52,"tags":["@autorizacao"],"steps":[{"pwStepLine":50,"gherkinStepLine":53,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":51,"gherkinStepLine":54,"keywordType":"Action","textWithKeyword":"Quando acesso o gerenciamento de \"campus\"","stepMatchArguments":[{"group":{"start":26,"value":"\"campus\"","children":[{"start":27,"value":"campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":52,"gherkinStepLine":55,"keywordType":"Outcome","textWithKeyword":"Então devo poder editar o meu campus","stepMatchArguments":[]}]},
  {"pwTestLine":55,"pickleLine":58,"tags":["@autorizacao"],"steps":[{"pwStepLine":56,"gherkinStepLine":59,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":57,"gherkinStepLine":60,"keywordType":"Context","textWithKeyword":"E existe um campus ao qual não estou vinculado","stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"Quando tento editar esse campus","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":62,"keywordType":"Outcome","textWithKeyword":"Então a operação deve ser impedida","stepMatchArguments":[]}]},
  {"pwTestLine":66,"pickleLine":67,"tags":["@autorizacao"],"steps":[{"pwStepLine":67,"gherkinStepLine":68,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":68,"gherkinStepLine":69,"keywordType":"Action","textWithKeyword":"Quando acesso o sistema","stepMatchArguments":[]},{"pwStepLine":69,"gherkinStepLine":70,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as opções de \"Dashboard\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Dashboard\"","children":[{"start":30,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":70,"gherkinStepLine":71,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Cursos\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Cursos\"","children":[{"start":30,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":71,"gherkinStepLine":72,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Solicitações\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Solicitações\"","children":[{"start":30,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":72,"gherkinStepLine":73,"keywordType":"Outcome","textWithKeyword":"Mas não devo visualizar a opção de \"Campus\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Campus\"","children":[{"start":32,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":73,"gherkinStepLine":74,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Alunos\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Alunos\"","children":[{"start":32,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":74,"gherkinStepLine":75,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Usuários\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Usuários\"","children":[{"start":32,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":75,"gherkinStepLine":76,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Tipos de Hora\"","children":[{"start":32,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]}]},
  {"pwTestLine":82,"pickleLine":81,"tags":["@autorizacao"],"steps":[{"pwStepLine":83,"gherkinStepLine":82,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":84,"gherkinStepLine":83,"keywordType":"Action","textWithKeyword":"Quando acesso o sistema","stepMatchArguments":[]},{"pwStepLine":85,"gherkinStepLine":84,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as opções de \"Dashboard\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Dashboard\"","children":[{"start":30,"value":"Dashboard","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":86,"gherkinStepLine":85,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as opções de \"Solicitações\"","stepMatchArguments":[{"group":{"start":29,"value":"\"Solicitações\"","children":[{"start":30,"value":"Solicitações","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":87,"gherkinStepLine":86,"keywordType":"Outcome","textWithKeyword":"Mas não devo visualizar a opção de \"Campus\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Campus\"","children":[{"start":32,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":88,"gherkinStepLine":87,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Cursos\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Cursos\"","children":[{"start":32,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":89,"gherkinStepLine":88,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Tipos de Hora\"","children":[{"start":32,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":90,"gherkinStepLine":89,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Usuários\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Usuários\"","children":[{"start":32,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":91,"gherkinStepLine":90,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de \"Alunos\"","stepMatchArguments":[{"group":{"start":31,"value":"\"Alunos\"","children":[{"start":32,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":92,"gherkinStepLine":91,"keywordType":"Outcome","textWithKeyword":"E não devo visualizar a opção de Administração de Campus","stepMatchArguments":[]}]},
  {"pwTestLine":99,"pickleLine":96,"tags":["@autorizacao"],"steps":[{"pwStepLine":100,"gherkinStepLine":97,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":101,"gherkinStepLine":98,"keywordType":"Action","textWithKeyword":"Quando tento acessar a funcionalidade de \"Campus\"","stepMatchArguments":[{"group":{"start":34,"value":"\"Campus\"","children":[{"start":35,"value":"Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":102,"gherkinStepLine":99,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":103,"gherkinStepLine":100,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":106,"pickleLine":103,"tags":["@autorizacao"],"steps":[{"pwStepLine":107,"gherkinStepLine":104,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":108,"gherkinStepLine":105,"keywordType":"Action","textWithKeyword":"Quando tento acessar a funcionalidade de \"Cursos\"","stepMatchArguments":[{"group":{"start":34,"value":"\"Cursos\"","children":[{"start":35,"value":"Cursos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":109,"gherkinStepLine":106,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":110,"gherkinStepLine":107,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":113,"pickleLine":110,"tags":["@autorizacao"],"steps":[{"pwStepLine":114,"gherkinStepLine":111,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":115,"gherkinStepLine":112,"keywordType":"Action","textWithKeyword":"Quando tento acessar a funcionalidade de \"Tipos de Hora\"","stepMatchArguments":[{"group":{"start":34,"value":"\"Tipos de Hora\"","children":[{"start":35,"value":"Tipos de Hora","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":116,"gherkinStepLine":113,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":117,"gherkinStepLine":114,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":120,"pickleLine":117,"tags":["@autorizacao"],"steps":[{"pwStepLine":121,"gherkinStepLine":118,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":122,"gherkinStepLine":119,"keywordType":"Action","textWithKeyword":"Quando tento acessar a funcionalidade de \"Usuários\"","stepMatchArguments":[{"group":{"start":34,"value":"\"Usuários\"","children":[{"start":35,"value":"Usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":123,"gherkinStepLine":120,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":124,"gherkinStepLine":121,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":127,"pickleLine":124,"tags":["@autorizacao"],"steps":[{"pwStepLine":128,"gherkinStepLine":125,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":129,"gherkinStepLine":126,"keywordType":"Action","textWithKeyword":"Quando tento acessar a funcionalidade de \"Alunos\"","stepMatchArguments":[{"group":{"start":34,"value":"\"Alunos\"","children":[{"start":35,"value":"Alunos","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":130,"gherkinStepLine":127,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":131,"gherkinStepLine":128,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":134,"pickleLine":131,"tags":["@autorizacao"],"steps":[{"pwStepLine":135,"gherkinStepLine":132,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":136,"gherkinStepLine":133,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"campus\"","stepMatchArguments":[{"group":{"start":33,"value":"\"campus\"","children":[{"start":34,"value":"campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":137,"gherkinStepLine":134,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":138,"gherkinStepLine":135,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":141,"pickleLine":138,"tags":["@autorizacao"],"steps":[{"pwStepLine":142,"gherkinStepLine":139,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":143,"gherkinStepLine":140,"keywordType":"Action","textWithKeyword":"Quando tento acessar a administração de \"campus\"","stepMatchArguments":[{"group":{"start":33,"value":"\"campus\"","children":[{"start":34,"value":"campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":144,"gherkinStepLine":141,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":145,"gherkinStepLine":142,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":148,"pickleLine":145,"tags":["@autorizacao"],"steps":[{"pwStepLine":149,"gherkinStepLine":146,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":150,"gherkinStepLine":147,"keywordType":"Action","textWithKeyword":"Quando tento acessar o gerenciamento de \"usuários\"","stepMatchArguments":[{"group":{"start":33,"value":"\"usuários\"","children":[{"start":34,"value":"usuários","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":151,"gherkinStepLine":148,"keywordType":"Outcome","textWithKeyword":"Então o acesso deve ser negado","stepMatchArguments":[]},{"pwStepLine":152,"gherkinStepLine":149,"keywordType":"Outcome","textWithKeyword":"E devo ser direcionado para uma página permitida ao meu perfil","stepMatchArguments":[]}]},
  {"pwTestLine":159,"pickleLine":154,"tags":["@autorizacao"],"steps":[{"pwStepLine":160,"gherkinStepLine":155,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":161,"gherkinStepLine":156,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":162,"gherkinStepLine":157,"keywordType":"Action","textWithKeyword":"Quando acesso a solicitação","stepMatchArguments":[]},{"pwStepLine":163,"gherkinStepLine":158,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar a opção de avaliação","stepMatchArguments":[]}]},
  {"pwTestLine":166,"pickleLine":161,"tags":["@autorizacao"],"steps":[{"pwStepLine":167,"gherkinStepLine":162,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":168,"gherkinStepLine":163,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":169,"gherkinStepLine":164,"keywordType":"Action","textWithKeyword":"Quando acesso a solicitação","stepMatchArguments":[]},{"pwStepLine":170,"gherkinStepLine":165,"keywordType":"Outcome","textWithKeyword":"Então não devo visualizar a opção de avaliação","stepMatchArguments":[]}]},
  {"pwTestLine":173,"pickleLine":168,"tags":["@autorizacao"],"steps":[{"pwStepLine":174,"gherkinStepLine":169,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":175,"gherkinStepLine":170,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":176,"gherkinStepLine":171,"keywordType":"Action","textWithKeyword":"Quando acesso a solicitação","stepMatchArguments":[]},{"pwStepLine":177,"gherkinStepLine":172,"keywordType":"Outcome","textWithKeyword":"Então não devo visualizar a opção de avaliação","stepMatchArguments":[]}]},
]; // bdd-data-end