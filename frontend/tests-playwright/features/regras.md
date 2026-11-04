# HComplementares — Regras de Negócio e Comportamentos

> **Documento de referência para BDD/E2E**
>
> Este documento consolida as regras e comportamentos atualmente definidos para os testes do frontend do sistema **HComplementares**.
>
> **Escopo:** testes comportamentais com Gherkin + Playwright BDD  
> **Idioma dos cenários:** Português  
> **Organização:** por comportamento/capacidade, e não por perfil

---

## 1. Perfis do sistema

| Perfil | Responsabilidade principal |
|---|---|
| **Administrador** | Administração geral do sistema |
| **Administrador de Campus** | Administração limitada ao campus ao qual está vinculado |
| **Coordenador** | Coordenação e avaliação de solicitações |
| **Aluno** | Solicitação e acompanhamento das próprias horas complementares |

---

# 2. Autenticação

## 2.1 Login

Todo usuário deve realizar autenticação para acessar funcionalidades protegidas.

### Usuários de referência

| Perfil | Usuário |
|---|---|
| Administrador | `admin` |
| Administrador de Campus | `coordpoa` |
| Coordenador | `marceloschmitt` |
| Aluno | `thiagolima` |

### Regras

- Usuários com credenciais válidas devem ser autenticados.
- Após o login bem-sucedido, o usuário deve ser direcionado ao **Dashboard**.
- Credenciais inválidas não devem autenticar o usuário.
- Após uma tentativa inválida, o usuário deve permanecer na página de login.
- Deve ser apresentada uma mensagem indicando que as credenciais são inválidas.

## 2.2 Logout

- Um usuário autenticado deve conseguir encerrar sua sessão.
- Após o logout, o usuário deve ser direcionado para o login.
- Após o logout, a sessão autenticada não deve permanecer disponível.
- O acesso posterior a uma página protegida deve exigir autenticação.

---

# 3. Autorização

## 3.1 Administrador

O Administrador possui acesso às funcionalidades administrativas gerais:

- Dashboard
- Campus
- Cursos
- Alunos
- Solicitações
- Tipos de Hora
- Usuários
- Administração de Campus

### Regra de escopo

O Administrador pode gerenciar **qualquer campus**, não apenas um campus específico.

### Solicitações

> **O Administrador não avalia solicitações.**

A avaliação de solicitações é exclusiva do Coordenador.

---

## 3.2 Administrador de Campus

O Administrador de Campus possui acesso limitado ao campus ao qual está vinculado.

### Funcionalidades disponíveis

- Dashboard
- Campus
- Cursos
- Tipos de Hora
- Solicitações

### Funcionalidades não disponíveis

- Usuários
- Alunos

### Regra de escopo

O Administrador de Campus pode gerenciar somente recursos vinculados ao seu campus.

Não deve conseguir:

- editar outro campus;
- excluir outro campus;
- editar curso de outro campus;
- excluir curso de outro campus;
- editar tipo de hora de outro campus;
- excluir tipo de hora de outro campus.

---

## 3.3 Coordenador

O Coordenador possui acesso às funcionalidades de coordenação:

- Dashboard
- Cursos
- Solicitações

Não possui acesso a:

- Campus
- Alunos
- Usuários
- Tipos de Hora
- Administração de Campus

### Avaliação de solicitações

O Coordenador é o **único perfil autorizado a avaliar solicitações**.

---

## 3.4 Aluno

O Aluno possui acesso a:

- Dashboard
- Solicitações

Não possui acesso a:

- Campus
- Cursos
- Tipos de Hora
- Usuários
- Alunos
- Administração de Campus

### Escopo dos dados

O Aluno deve visualizar somente as suas próprias solicitações.

---

# 4. Dashboard

Todos os perfis autenticados devem conseguir acessar o Dashboard.

## 4.1 Administrador

O Dashboard deve apresentar as informações disponíveis para o Administrador.

## 4.2 Administrador de Campus

O Dashboard deve apresentar informações relacionadas ao seu campus.

## 4.3 Coordenador

O Dashboard deve apresentar as informações disponíveis para a coordenação.

## 4.4 Aluno

O Dashboard deve apresentar suas informações acadêmicas e o acompanhamento das próprias solicitações.

---

# 5. Navegação

## 5.1 Princípio geral

O menu deve apresentar somente as funcionalidades permitidas ao perfil autenticado.

A navegação deve direcionar o usuário para a funcionalidade correspondente.

## 5.2 Administrador

Pode navegar para:

- Dashboard
- Campus
- Cursos
- Alunos
- Solicitações
- Tipos de Hora
- Usuários
- Administração de Campus

## 5.3 Administrador de Campus

Pode navegar para:

- Dashboard
- Campus
- Cursos
- Tipos de Hora
- Solicitações

## 5.4 Coordenador

Pode navegar para:

- Dashboard
- Cursos
- Solicitações

## 5.5 Aluno

Pode navegar para:

- Dashboard
- Solicitações

## 5.6 Logout

A opção de encerramento da sessão deve estar disponível para usuários autenticados.

---

# 6. Campus

## 6.1 Administrador

O Administrador pode:

- visualizar os campus;
- cadastrar campus;
- editar campus;
- excluir campus;
- gerenciar qualquer campus.

## 6.2 Administrador de Campus

O Administrador de Campus pode:

- visualizar seu campus;
- editar seu próprio campus;
- cadastrar campus, conforme a regra de permissão definida pelo sistema.

Não pode:

- editar outro campus;
- excluir outro campus.

> **Ponto a confirmar:** o comportamento de cadastro de um novo campus pelo Administrador de Campus deve ser validado contra os requisitos do sistema antes da implementação dos testes.

## 6.3 Validação

O cadastro de campus deve impedir o envio quando os dados obrigatórios não forem informados.

Devem ser apresentadas as mensagens de validação correspondentes.

---

# 7. Cursos

## 7.1 Administrador

O Administrador pode:

- visualizar cursos;
- cadastrar cursos;
- editar cursos;
- excluir cursos.

## 7.2 Administrador de Campus

O Administrador de Campus pode gerenciar cursos vinculados ao seu campus:

- visualizar;
- cadastrar;
- editar;
- excluir.

Não pode editar ou excluir cursos vinculados a outro campus.

## 7.3 Coordenador

O Coordenador pode consultar os cursos disponíveis.

## 7.4 Aluno

O Aluno não possui acesso à administração de Cursos.

## 7.5 Validação

O cadastro de curso deve impedir o envio quando os dados obrigatórios não forem informados.

---

# 8. Alunos

## 8.1 Administrador

O Administrador pode:

- acessar a administração de alunos;
- visualizar os alunos cadastrados;
- visualizar os dados de um aluno;
- pesquisar alunos.

## 8.2 Outros perfis

O acesso à administração de alunos não está disponível para:

- Administrador de Campus;
- Coordenador;
- Aluno.

O Aluno não deve conseguir acessar a administração de outros alunos.

---

# 9. Usuários

## 9.1 Administrador

Somente o Administrador possui acesso ao gerenciamento de usuários.

Pode:

- visualizar usuários;
- consultar dados de usuários;
- pesquisar usuários;
- gerenciar administradores de campus;
- remover vínculo de administrador com campus.

## 9.2 Outros perfis

Não possuem acesso ao gerenciamento de usuários:

- Administrador de Campus;
- Coordenador;
- Aluno.

---

# 10. Tipos de Hora

## 10.1 Administrador

O Administrador pode:

- visualizar tipos de hora;
- cadastrar tipos de hora;
- editar tipos de hora;
- excluir tipos de hora.

## 10.2 Administrador de Campus

O Administrador de Campus pode gerenciar tipos de hora do seu campus:

- visualizar;
- cadastrar;
- editar;
- excluir.

Não pode editar ou excluir tipos de hora vinculados a outro campus.

## 10.3 Outros perfis

Não possuem acesso à administração de Tipos de Hora:

- Coordenador;
- Aluno.

## 10.4 Validação

O cadastro de tipo de hora deve impedir o envio quando os dados obrigatórios não forem informados.

---

# 11. Solicitações

## 11.1 Consulta

Usuários autorizados podem consultar solicitações.

### Administrador

Pode visualizar as solicitações disponíveis no sistema.

### Administrador de Campus

Pode visualizar as solicitações disponíveis conforme suas permissões.

### Coordenador

Pode visualizar as solicitações disponíveis conforme suas permissões.

### Aluno

Deve visualizar **somente suas próprias solicitações**.

---

# 12. Filtros de solicitações

O sistema deve permitir a filtragem das solicitações.

## 12.1 Filtro por status

Quando existem solicitações com diferentes status, o filtro deve apresentar somente as solicitações correspondentes ao status selecionado.

## 12.2 Filtro por período

Quando existem solicitações em diferentes períodos, o filtro deve apresentar somente as solicitações correspondentes ao período selecionado.

---

# 13. Cadastro de solicitação

## 13.1 Aluno

O Aluno pode cadastrar uma solicitação de horas complementares.

Após o cadastro:

- a solicitação deve ser criada com sucesso;
- o status inicial deve ser **Pendente**.

## 13.2 Validação

O cadastro deve ser impedido quando os dados obrigatórios não forem informados.

As mensagens de validação devem ser apresentadas ao usuário.

---

# 14. Detalhes da solicitação

O Aluno deve conseguir:

- visualizar os dados da própria solicitação;
- visualizar o status da própria solicitação.

O acesso aos dados de solicitações de outros alunos deve ser impedido.

---

# 15. Avaliação de solicitações

## 15.1 Regra principal

> **Somente o Coordenador pode avaliar solicitações.**

## 15.2 Coordenador

O Coordenador pode avaliar uma solicitação pendente.

A avaliação pode resultar em:

- **Deferido**
- **Indeferido**

O status da solicitação deve ser atualizado de acordo com a decisão.

## 15.3 Administrador

O Administrador pode consultar solicitações, mas **não deve visualizar a opção de avaliação**.

## 15.4 Aluno

O Aluno não pode avaliar solicitações.

---

# 16. Cancelamento de solicitações

O Aluno pode cancelar suas próprias solicitações nos estados permitidos pelo sistema.

Atualmente estão definidos cenários para:

- solicitação **Pendente**;
- solicitação **Deferida**.

Após o cancelamento, a solicitação deve refletir o cancelamento.

> **Ponto a confirmar:** o status final exato utilizado pelo sistema para uma solicitação cancelada deve ser validado contra o modelo de domínio.

---

# 17. Auditoria

A auditoria deve permitir acompanhar alterações realizadas nas solicitações.

## 17.1 Registro de eventos

Devem ser registrados eventos relevantes, incluindo:

- cadastro da solicitação;
- avaliação da solicitação;
- cancelamento da solicitação.

## 17.2 Aluno

O Aluno pode consultar o histórico das suas próprias solicitações.

Não pode consultar o histórico de solicitações pertencentes a outro aluno.

## 17.3 Coordenador

O Coordenador pode consultar o histórico das solicitações que possui permissão para acessar.

## 17.4 Informações do histórico

O histórico deve permitir identificar:

- status anterior;
- novo status;
- data da alteração;
- usuário responsável pela alteração.

---

# 18. Rotas protegidas

Usuários sem permissão não devem conseguir acessar funcionalidades administrativas diretamente pela URL.

A proteção deve ser aplicada mesmo quando o usuário tenta acessar a rota sem utilizar o menu.

### Exemplos de funcionalidades protegidas

- Campus
- Cursos
- Tipos de Hora
- Usuários
- Alunos
- Administração de Campus

Quando o acesso não for permitido:

1. o acesso deve ser negado;
2. o sistema deve direcionar o usuário para uma página permitida ao seu perfil.

> **Ponto a confirmar:** as rotas e destinos exatos dos redirecionamentos devem ser definidos com base no comportamento real do frontend.

---

# 19. Matriz de acesso

| Funcionalidade | Administrador | Admin. Campus | Coordenador | Aluno |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Campus | ✓ | ✓* | — | — |
| Cursos | ✓ | ✓* | ✓ | — |
| Alunos | ✓ | — | — | — |
| Solicitações | ✓ | ✓ | ✓ | ✓** |
| Tipos de Hora | ✓ | ✓* | — | — |
| Usuários | ✓ | — | — | — |
| Administração de Campus | ✓ | — | — | — |
| Avaliar solicitações | — | — | ✓ | — |

**\*** Restrito aos recursos vinculados ao próprio campus quando aplicável.

**\*\*** O Aluno visualiza somente suas próprias solicitações.

---
