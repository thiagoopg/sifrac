// Generated from: tests-playwright/features/solicitacoes.feature
import { test } from "playwright-bdd";

test.describe('Gerenciamento de solicitações de horas complementares', () => {

  test.describe('Usuários autorizados podem consultar solicitações', () => {

    test('Administrador visualiza as solicitações', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await When('acesso as Solicitações', null, { page }); 
      await Then('devo visualizar as solicitações cadastradas', null, { page }); 
    });

    test('Administrador de Campus visualiza as solicitações', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Administrador de Campus"', null, { page }); 
      await When('acesso as Solicitações', null, { page }); 
      await Then('devo visualizar as solicitações disponíveis', null, { page }); 
    });

    test('Coordenador visualiza as solicitações', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await When('acesso as Solicitações', null, { page }); 
      await Then('devo visualizar as solicitações disponíveis', null, { page }); 
    });

    test('Aluno visualiza somente suas solicitações', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existem solicitações de diferentes alunos'); 
      await When('acesso as Solicitações', null, { page }); 
      await Then('devo visualizar somente minhas solicitações', null, { page }); 
    });

  });

  test.describe('O usuário pode filtrar solicitações', () => {

    test('Usuário filtra solicitações por status', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado no sistema', null, { page }); 
      await And('existem solicitações com diferentes status'); 
      await When('filtro as solicitações por status', null, { page }); 
      await Then('devo visualizar somente as solicitações correspondentes ao status selecionado', null, { page }); 
    });

    test('Usuário filtra solicitações por período', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado no sistema', null, { page }); 
      await And('existem solicitações cadastradas em diferentes períodos'); 
      await When('filtro as solicitações por período', null, { page }); 
      await Then('devo visualizar somente as solicitações correspondentes ao período selecionado', null, { page }); 
    });

  });

  test.describe('O Aluno pode cadastrar uma solicitação', () => {

    test('Aluno cadastra uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('cadastro uma solicitação de horas complementares', null, { page }); 
      await Then('a solicitação deve ser cadastrada com sucesso', null, { page }); 
      await And('a solicitação deve ficar com status Pendente', null, { page }); 
    });

    test('Aluno deve informar os dados obrigatórios da solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await When('tento cadastrar uma solicitação sem informar os dados obrigatórios', null, { page }); 
      await Then('a solicitação não deve ser cadastrada', null, { page }); 
      await And('devo visualizar as mensagens de validação', null, { page }); 
    });

  });

  test.describe('O Aluno pode consultar os dados da sua solicitação', () => {

    test('Aluno visualiza os detalhes de uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação cadastrada pelo aluno'); 
      await When('acesso os detalhes da solicitação', null, { page }); 
      await Then('devo visualizar os dados da solicitação', null, { page }); 
    });

    test('Aluno visualiza o status da solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação cadastrada pelo aluno'); 
      await When('acesso os detalhes da solicitação', null, { page }); 
      await Then('devo visualizar o status da solicitação', null, { page }); 
    });

  });

  test.describe('Apenas o Coordenador pode avaliar solicitações', () => {

    test('Coordenador avalia uma solicitação pendente', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('avalio a solicitação', null, { page }); 
      await Then('a solicitação deve ter seu status atualizado', null, { page }); 
    });

    test('Coordenador pode deferir uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('defiro a solicitação', null, { page }); 
      await Then('a solicitação deve ficar com status Deferido', null, { page }); 
    });

    test('Coordenador pode indeferir uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('indefiro a solicitação', null, { page }); 
      await Then('a solicitação deve ficar com status Indeferido', null, { page }); 
    });

  });

  test.describe('Usuários que não são Coordenadores não podem avaliar solicitações', () => {

    test('Administrador não pode avaliar uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Administrador"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('acesso os detalhes da solicitação', null, { page }); 
      await Then('não devo visualizar a opção de avaliação', null, { page }); 
    });

    test('Aluno não pode avaliar uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page, request }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação pendente', null, { request }); 
      await When('acesso os detalhes da solicitação', null, { page }); 
      await Then('não devo visualizar a opção de avaliação', null, { page }); 
    });

  });

  test.describe('O usuário pode consultar o histórico da solicitação', () => {

    test('Aluno consulta o histórico de uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Aluno"', null, { page }); 
      await And('existe uma solicitação cadastrada pelo aluno'); 
      await When('acesso o histórico da solicitação', null, { page }); 
      await Then('devo visualizar o histórico de alterações da solicitação', null, { page }); 
    });

    test('Coordenador consulta o histórico de uma solicitação', { tag: ['@solicitacoes'] }, async ({ Given, When, Then, And, page }) => { 
      await Given('que estou autenticado como "Coordenador"', null, { page }); 
      await And('existe uma solicitação cadastrada'); 
      await When('acesso o histórico da solicitação', null, { page }); 
      await Then('devo visualizar o histórico de alterações da solicitação', null, { page }); 
    });

  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('tests-playwright/features/solicitacoes.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":8,"pickleLine":13,"tags":["@solicitacoes"],"steps":[{"pwStepLine":9,"gherkinStepLine":14,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":10,"gherkinStepLine":15,"keywordType":"Action","textWithKeyword":"Quando acesso as Solicitações","stepMatchArguments":[]},{"pwStepLine":11,"gherkinStepLine":16,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as solicitações cadastradas","stepMatchArguments":[]}]},
  {"pwTestLine":14,"pickleLine":18,"tags":["@solicitacoes"],"steps":[{"pwStepLine":15,"gherkinStepLine":19,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador de Campus\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador de Campus\"","children":[{"start":28,"value":"Administrador de Campus","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":16,"gherkinStepLine":20,"keywordType":"Action","textWithKeyword":"Quando acesso as Solicitações","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as solicitações disponíveis","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":23,"tags":["@solicitacoes"],"steps":[{"pwStepLine":21,"gherkinStepLine":24,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":22,"gherkinStepLine":25,"keywordType":"Action","textWithKeyword":"Quando acesso as Solicitações","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":26,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar as solicitações disponíveis","stepMatchArguments":[]}]},
  {"pwTestLine":26,"pickleLine":28,"tags":["@solicitacoes"],"steps":[{"pwStepLine":27,"gherkinStepLine":29,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":28,"gherkinStepLine":30,"keywordType":"Context","textWithKeyword":"E existem solicitações de diferentes alunos","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":31,"keywordType":"Action","textWithKeyword":"Quando acesso as Solicitações","stepMatchArguments":[]},{"pwStepLine":30,"gherkinStepLine":32,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar somente minhas solicitações","stepMatchArguments":[]}]},
  {"pwTestLine":37,"pickleLine":37,"tags":["@solicitacoes"],"steps":[{"pwStepLine":38,"gherkinStepLine":38,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado no sistema","stepMatchArguments":[]},{"pwStepLine":39,"gherkinStepLine":39,"keywordType":"Context","textWithKeyword":"E existem solicitações com diferentes status","stepMatchArguments":[]},{"pwStepLine":40,"gherkinStepLine":40,"keywordType":"Action","textWithKeyword":"Quando filtro as solicitações por status","stepMatchArguments":[]},{"pwStepLine":41,"gherkinStepLine":41,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar somente as solicitações correspondentes ao status selecionado","stepMatchArguments":[]}]},
  {"pwTestLine":44,"pickleLine":44,"tags":["@solicitacoes"],"steps":[{"pwStepLine":45,"gherkinStepLine":45,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado no sistema","stepMatchArguments":[]},{"pwStepLine":46,"gherkinStepLine":46,"keywordType":"Context","textWithKeyword":"E existem solicitações cadastradas em diferentes períodos","stepMatchArguments":[]},{"pwStepLine":47,"gherkinStepLine":47,"keywordType":"Action","textWithKeyword":"Quando filtro as solicitações por período","stepMatchArguments":[]},{"pwStepLine":48,"gherkinStepLine":48,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar somente as solicitações correspondentes ao período selecionado","stepMatchArguments":[]}]},
  {"pwTestLine":55,"pickleLine":53,"tags":["@solicitacoes"],"steps":[{"pwStepLine":56,"gherkinStepLine":54,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":57,"gherkinStepLine":55,"keywordType":"Action","textWithKeyword":"Quando cadastro uma solicitação de horas complementares","stepMatchArguments":[]},{"pwStepLine":58,"gherkinStepLine":56,"keywordType":"Outcome","textWithKeyword":"Então a solicitação deve ser cadastrada com sucesso","stepMatchArguments":[]},{"pwStepLine":59,"gherkinStepLine":57,"keywordType":"Outcome","textWithKeyword":"E a solicitação deve ficar com status Pendente","stepMatchArguments":[]}]},
  {"pwTestLine":62,"pickleLine":59,"tags":["@solicitacoes"],"steps":[{"pwStepLine":63,"gherkinStepLine":60,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":64,"gherkinStepLine":61,"keywordType":"Action","textWithKeyword":"Quando tento cadastrar uma solicitação sem informar os dados obrigatórios","stepMatchArguments":[]},{"pwStepLine":65,"gherkinStepLine":62,"keywordType":"Outcome","textWithKeyword":"Então a solicitação não deve ser cadastrada","stepMatchArguments":[]},{"pwStepLine":66,"gherkinStepLine":63,"keywordType":"Outcome","textWithKeyword":"E devo visualizar as mensagens de validação","stepMatchArguments":[]}]},
  {"pwTestLine":73,"pickleLine":68,"tags":["@solicitacoes"],"steps":[{"pwStepLine":74,"gherkinStepLine":69,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":75,"gherkinStepLine":70,"keywordType":"Context","textWithKeyword":"E existe uma solicitação cadastrada pelo aluno","stepMatchArguments":[]},{"pwStepLine":76,"gherkinStepLine":71,"keywordType":"Action","textWithKeyword":"Quando acesso os detalhes da solicitação","stepMatchArguments":[]},{"pwStepLine":77,"gherkinStepLine":72,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar os dados da solicitação","stepMatchArguments":[]}]},
  {"pwTestLine":80,"pickleLine":74,"tags":["@solicitacoes"],"steps":[{"pwStepLine":81,"gherkinStepLine":75,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":82,"gherkinStepLine":76,"keywordType":"Context","textWithKeyword":"E existe uma solicitação cadastrada pelo aluno","stepMatchArguments":[]},{"pwStepLine":83,"gherkinStepLine":77,"keywordType":"Action","textWithKeyword":"Quando acesso os detalhes da solicitação","stepMatchArguments":[]},{"pwStepLine":84,"gherkinStepLine":78,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o status da solicitação","stepMatchArguments":[]}]},
  {"pwTestLine":91,"pickleLine":83,"tags":["@solicitacoes"],"steps":[{"pwStepLine":92,"gherkinStepLine":84,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":93,"gherkinStepLine":85,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":94,"gherkinStepLine":86,"keywordType":"Action","textWithKeyword":"Quando avalio a solicitação","stepMatchArguments":[]},{"pwStepLine":95,"gherkinStepLine":87,"keywordType":"Outcome","textWithKeyword":"Então a solicitação deve ter seu status atualizado","stepMatchArguments":[]}]},
  {"pwTestLine":98,"pickleLine":89,"tags":["@solicitacoes"],"steps":[{"pwStepLine":99,"gherkinStepLine":90,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":100,"gherkinStepLine":91,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":101,"gherkinStepLine":92,"keywordType":"Action","textWithKeyword":"Quando defiro a solicitação","stepMatchArguments":[]},{"pwStepLine":102,"gherkinStepLine":93,"keywordType":"Outcome","textWithKeyword":"Então a solicitação deve ficar com status Deferido","stepMatchArguments":[]}]},
  {"pwTestLine":105,"pickleLine":95,"tags":["@solicitacoes"],"steps":[{"pwStepLine":106,"gherkinStepLine":96,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":107,"gherkinStepLine":97,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":108,"gherkinStepLine":98,"keywordType":"Action","textWithKeyword":"Quando indefiro a solicitação","stepMatchArguments":[]},{"pwStepLine":109,"gherkinStepLine":99,"keywordType":"Outcome","textWithKeyword":"Então a solicitação deve ficar com status Indeferido","stepMatchArguments":[]}]},
  {"pwTestLine":116,"pickleLine":104,"tags":["@solicitacoes"],"steps":[{"pwStepLine":117,"gherkinStepLine":105,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Administrador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Administrador\"","children":[{"start":28,"value":"Administrador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":118,"gherkinStepLine":106,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":119,"gherkinStepLine":107,"keywordType":"Action","textWithKeyword":"Quando acesso os detalhes da solicitação","stepMatchArguments":[]},{"pwStepLine":120,"gherkinStepLine":108,"keywordType":"Outcome","textWithKeyword":"Então não devo visualizar a opção de avaliação","stepMatchArguments":[]}]},
  {"pwTestLine":123,"pickleLine":110,"tags":["@solicitacoes"],"steps":[{"pwStepLine":124,"gherkinStepLine":111,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":125,"gherkinStepLine":112,"keywordType":"Context","textWithKeyword":"E existe uma solicitação pendente","stepMatchArguments":[]},{"pwStepLine":126,"gherkinStepLine":113,"keywordType":"Action","textWithKeyword":"Quando acesso os detalhes da solicitação","stepMatchArguments":[]},{"pwStepLine":127,"gherkinStepLine":114,"keywordType":"Outcome","textWithKeyword":"Então não devo visualizar a opção de avaliação","stepMatchArguments":[]}]},
  {"pwTestLine":134,"pickleLine":129,"tags":["@solicitacoes"],"steps":[{"pwStepLine":135,"gherkinStepLine":130,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Aluno\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Aluno\"","children":[{"start":28,"value":"Aluno","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":136,"gherkinStepLine":131,"keywordType":"Context","textWithKeyword":"E existe uma solicitação cadastrada pelo aluno","stepMatchArguments":[]},{"pwStepLine":137,"gherkinStepLine":132,"keywordType":"Action","textWithKeyword":"Quando acesso o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":138,"gherkinStepLine":133,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o histórico de alterações da solicitação","stepMatchArguments":[]}]},
  {"pwTestLine":141,"pickleLine":135,"tags":["@solicitacoes"],"steps":[{"pwStepLine":142,"gherkinStepLine":136,"keywordType":"Context","textWithKeyword":"Dado que estou autenticado como \"Coordenador\"","stepMatchArguments":[{"group":{"start":27,"value":"\"Coordenador\"","children":[{"start":28,"value":"Coordenador","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":143,"gherkinStepLine":137,"keywordType":"Context","textWithKeyword":"E existe uma solicitação cadastrada","stepMatchArguments":[]},{"pwStepLine":144,"gherkinStepLine":138,"keywordType":"Action","textWithKeyword":"Quando acesso o histórico da solicitação","stepMatchArguments":[]},{"pwStepLine":145,"gherkinStepLine":139,"keywordType":"Outcome","textWithKeyword":"Então devo visualizar o histórico de alterações da solicitação","stepMatchArguments":[]}]},
]; // bdd-data-end