# Especificação do Sistema — Atividades Complementares IFRS

> Documento gerado como base para o desenvolvimento do TCC.
> Contém requisitos, regras de negócio, decisões técnicas e restrições.

---

## 1. Contexto do Problema

O IFRS — Campus Porto Alegre (e demais campi) gerencia as **Atividades Complementares** de forma manual:
- Aluno abre processo via SIPAC, mas **não acompanha o andamento**.
- Envio de documentos só é possível no início; o aluno não consegue incluir novos documentos depois.
- Coordenação usa planilhas compartilhadas para controle de horas.
- Comunicação entre aluno e coordenador é feita por e-mail.
- Existia um trabalho anterior (PWAC-IFRS, Bernardoni 2023) mas **não está disponível publicamente** e não atendia todas as necessidades.

**Objetivo do TCC**: desenvolver uma plataforma web que permita ao aluno solicitar certificação de atividades, acompanhar o andamento em tempo real, enviar documentos a qualquer momento, e ao coordenador analisar, aprovar/rejeitar e controlar a carga horária aproveitada.

---

## 2. Atores do Sistema

| Ator | Papel | Descrição |
|------|-------|-----------|
| **Admin** | `ADMIN` | Cadastra campi, cursos, coordenadores e usuários. Acesso a todas as telas. |
| **Coordenador** | `COORDINATOR` | Analisa solicitações do seu campus/corso. Vê horas aproveitadas por aluno. Autenticado via LDAP. |
| **Aluno** | `STUDENT` | Abre solicitações, sobe documentos, acompanha status. Autenticado localmente (bcrypt). |

> **Regra**: Coordenadores são cadastrados manualmente pelo admin (nome, email, username LDAP, curso). Alunos se cadastram sozinhos na tela de registro, selecionando o curso manualmente.

---

## 3. Requisitos Funcionais

### RF01 — Autenticação
- Login com **username + senha** (não email).
- **Coordenadores** autenticam via **LDAP** (servidor interno do IFRS, implementado em PHP — código a ser recebido do orientador).
- **Alunos** autenticam via **senha local** (bcrypt), sem LDAP.
- O LDAP retorna apenas sucesso/falha na autenticação; **não fornece informações do usuário** (nome, curso, etc).
- **Nenhum password hardcoded no código** — senhas de configuração (bindDN) devem vir de variáveis de ambiente ou arquivos externos.
- Token JWT retornado na resposta de login; frontend armazena no `localStorage`.

> **Fonte**: Conversa com orientador Marcelo Schmitt em 09/09/2026.

### RF02 — Cadastro de Aluno
- Formulário com: username, nome, email, senha, **curso** (select).
- O aluno seleciona o curso manualmente (não há vínculo automático com LDAP).
- Curso vinculado a um campus.
- Após cadastro, status inicial = `active = true`, role = `STUDENT`.

### RF03 — Gerenciamento de Campi (Admin)
- CRUD de campi: nome, código, endereço.
- Liste todos os campi para seleção na criação de cursos.

### RF04 — Gerenciamento de Cursos (Admin)
- CRUD de cursos: nome, campus vinculado, **carga horária total requerida** de AC.
- Cada campus pode ter múltiplos cursos.

### RF05 — Preferências de Atividades por Curso
- Para cada curso, definir **limites de horas por tipo** de atividade:
  - `COURSE` — cursos de extensão e livres
  - `EVENT` — participação em eventos, congressos, seminários
  - `RESEARCH` — projetos de pesquisa científicos
  - `MONITORING` — exercício de monitoria acadêmica
  - `PUBLICATION` — publicações científicas e artigos
  - `EXTENSION` — atividades de extensão comunitária
  - `PROFESSIONAL` — experiência profissional na área
- Cada curso tem sua própria configuração de limites.
- Admin e coordenador podem configurar.

### RF06 — Solicitação de Atividades (Aluno)
- Aluno abre uma solicitação escolhendo o tipo de atividade.
- Informa: horas pretendidas, justificativa.
- Pode **anexar documentos** (PDF, imagens) na abertura ou **adicionar depois**.
- Status inicial: `PENDING`.
- O sistema calcula automaticamente quanto já foi aproveitado daquele tipo no curso do aluno.

### RF07 — Acompanhamento de Solicitação (Aluno)
- Aluno vê lista das suas solicitações com status.
- Vê detalhes: horas solicitadas, aprovadas, rejeitadas, justificativa, observações do coordenador.
- Pode anexar novos documentos enquanto status for `PENDING` ou `UNDER_ANALYSIS`.

### RF08 — Análise de Solicitação (Coordenador)
- Coordenador vê lista de solicitações do seu campus/cursos.
- Pode: **aprovar**, **rejeitar** ou **solicitar complementação**.
- Ao aprovar: informa horas efetivamente aprovadas (pode ser diferente do solicitado).
- Adiciona observações.
- O sistema atualiza automaticamente a carga horária aproveita do aluno.

### RF09 — Auditoria
- Todo evento de mudança de status ou horas gera um registro de auditoria.
- Registro contém: request_id, old_status, new_status, old_hours, new_hours, changed_by (user_id), observation, timestamp.
- Coordenador e admin podem consultar o histórico completo.

### RF10 — Notificações
- Aluno é notificado quando:
  - Sua solicitação é aprovada/rejeitada/complementação solicitada.
- Notificações ficam na plataforma (ícone no header) e podem ser marcadas como lidas.

### RF11 — Gerenciamento de Usuários (Admin)
- Listar, ativar/desativar usuários.
- Alterar cargo de usuário (exceto próprio).
- Criar coordenadores vinculados a um campus/corso.

---

## 4. Regras de Negócio

| # | Regra |
|---|-------|
| RN01 | Aluno **só pode solicitar** atividades do curso em que está matriculado. |
| RN02 | Coordenador **só vê** solicitações dos cursos do seu campus. |
| RN03 | Admin vê **todos** os campi e cursos. |
| RN04 | Horas aprovadas de um tipo **não podem exceder** o limite configurado para aquele curso/tipo. |
| RN05 | Ao reprovar uma solicitação, o aluno pode abrir nova solicitação do mesmo tipo (substitui a anterior). |
| RN06 | Documento pode ser adicionado a qualquer momento enquanto o status for `PENDING` ou `UNDER_ANALYSIS`. |
| RN07 | Usuário desativado (`active = false`) **não faz login**. |
| RN08 | Coordenador não pode ser excluído, apenas desativado. |
| RN09 | Cada curso tem um **único coordenador** (cadastrado pelo admin com username LDAP). |
| RN10 | O campo `course_id` em `users` é opcional — alunos ainda não têm curso vinculado no cadastro. |
| RN11 | O LDAP do IFRS **não retorna informações do aluno** (curso, nome completo). O aluno seleciona o curso manualmente no registro. |
| RN12 | Coordenadores são identificados pelo username cadastrado no sistema; o LDAP apenas valida a senha. |
| RN13 | Senhas de configuração (bindDN, JWT secret) **nunca** devem constar no código-fonte. |

---

## 5. Decisões Técnicas

### 5.1 Stack
| Camada | Tecnologia | Versão | Justificativa |
|--------|-----------|--------|--------------|
| Backend | Spring Boot | 4.1.1 | Última versão estável; suporte nativo a Jakarta EE 11 |
| Linguagem | Java | 25 LTS | JDK do projeto; permite usar features recentes |
| ORM | Spring Data JPA + Hibernate | — | Controle de versão pelo parent POM |
| Banco produção | PostgreSQL | — | Robustez, exigido pelo TCC |
| Banco dev | H2 | — | Console integrado, zero configuração para desenvolvimento |
| Frontend | Vue.js 3 + Vite | ^3.4 / ^5.1 | SPA moderna, rápida, ecossistema maduro |
| Auth | JWT (JJWT) | 0.12.5 | Stateless, padrão da indústria, frontend armazena em localStorage |
| Validação | Jakarta Validation | 3.1.1 | @NotBlank, @Email nos DTOs |
| Docs API | SpringDoc OpenAPI | 3.1.0 | Swagger UI automático (opcional) |
| Build Backend | Maven | — | Padrão Spring Boot |
| Build Frontend | npm + Vite | — | Rápido, padrão Vue 3 |

### 5.2 Autenticação
- **Coordenadores**: autenticação via **LDAP** do IFRS (servidor interno, código PHP a ser recebido do orientador). O LDAP só valida credenciais; não retorna dados do usuário. O vínculo com o curso é feito manualmente pelo admin no cadastro.
- **Alunos**: autenticação local com **bcrypt** (senha armazenada no banco).
- **Admin**: autenticação local com **bcrypt**.
- **JWT stateless**: token enviado no header `Authorization: Bearer <token>`.
- Expiração: 24h (configurável via `jwt.expiration`).
- Segredo JWT: variável de ambiente `JWT_SECRET` (nunca hardcodar).
- **Nenhuma senha de configuração LDAP deve estar no código-fonte** — usar variáveis de ambiente.

### 5.3 Banco de Dados
- **Schema**: DDL em `schema-postgres.sql` (produção) e `schema-h2.sql` (dev).
- **Seed**: `data-postgres.sql` e `data-h2.sql` com dados iniciais.
- **H2 console**: acessível em `/h2-console` no perfil dev.
- **PostgreSQL**: conectado via variáveis `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.

### 5.4 CORS
- Origens permitidas: `http://localhost:5173` (Vite dev), `http://localhost:3000`.
- Credentials habilitados.
- Métodos: GET, POST, PUT, DELETE, OPTIONS.
- Headers: todos permitidos.

---

## 6. Modelo de Dados (Entidades)

### Campus
```
id, name, code (unique), address, createdAt
```

### User
```
id, username (unique), name, email (unique), password (nullable = LDAP),
role (ADMIN/COORDINATOR/STUDENT), campusId (FK), courseId (FK, nullable),
studentId, active (default true), createdAt, updatedAt
```
> **Nota**: `coordinator_email` **não existe** — o coordenador é um user com role COORDINATOR vinculado a um campus.

### Course
```
id, name, campusId (FK), totalHoursRequired, coordinatorId (FK → User.id, nullable)
```
> Cada curso tem **um único coordenador** vinculado via `coordinatorId`.

### ActivityPreference
```
id, courseId (FK), activityType, maxHours, description, active, createdAt
```
> Unique constraint: `(courseId, activityType)`.

### ActivityRequest
```
id, userId (FK), activityType, status (PENDING/UNDER_ANALYSIS/APPROVED/REJECTED),
totalHours, justification, coordinatorNotes, analyzedBy (FK → user),
analyzedAt, previousRequestId (FK → activityRequest, nullable), createdAt, updatedAt
```

### RequestAudit
```
id, requestId (FK), oldStatus, newStatus, oldHours, newHours,
changedBy (FK → user), observation, changedAt
```

### Document
```
id, requestId (FK), filename, originalName, filePath, fileSize, uploadedAt
```

### Notification
```
id, userId (FK), title, message, read (default false), createdAt
```

---

## 7. Tipos de Atividade (Enum)

| Valor | Descrição |
|-------|-----------|
| COURSE | Cursos de extensão e livres |
| EVENT | Participação em eventos, congressos, seminários |
| RESEARCH | Projetos de pesquisa científicos |
| MONITORING | Exercício de monitoria acadêmica |
| PUBLICATION | Publicações científicas e artigos |
| EXTENSION | Atividades de extensão comunitária |
| PROFESSIONAL | Experiência profissional na área |

---

## 8. Status da Solicitação (Enum)

| Valor | Significado |
|-------|------------|
| PENDING | Aberta, aguardando análise |
| UNDER_ANALYSIS | Em análise pelo coordenador |
| APPROVED | Aprovada |
| REJECTED | Rejeitada |
| COMPLEMENTATION_REQUESTED | Coordenador pediu complementação |

---

## 9. Endpoints da API (REST)

### Autenticação
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/api/auth/login` | Público | Login retorna JWT + dados do usuário |

### Campi
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/campuses` | ADMIN/COORDINATOR | Listar campi |
| POST | `/api/campuses` | ADMIN | Criar campus |
| PUT | `/api/campuses/{id}` | ADMIN | Atualizar campus |
| DELETE | `/api/campuses/{id}` | ADMIN | Desativar campus |

### Cursos
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/courses` | ADMIN/COORDINATOR | Listar cursos (com campus) |
| POST | `/api/courses` | ADMIN | Criar curso |
| PUT | `/api/courses/{id}` | ADMIN | Atualizar curso |
| DELETE | `/api/courses/{id}` | ADMIN | Desativar curso |

### Preferências de Atividade
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/preferences` | ADMIN/COORDINATOR | Listar preferências por curso |
| POST | `/api/preferences` | ADMIN/COORDINATOR | Criar preferência |
| PUT | `/api/preferences/{id}` | ADMIN/COORDINATOR | Atualizar preferência |
| DELETE | `/api/preferences/{id}` | ADMIN/COORDINATOR | Desativar preferência |

### Usuários
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/users` | ADMIN | Listar todos |
| POST | `/api/users/register` | Público | Cadastro de aluno |
| POST | `/api/users` | ADMIN | Criar usuário (coordenador) |
| PUT | `/api/users/{id}` | ADMIN | Atualizar usuário |
| DELETE | `/api/users/{id}` | ADMIN | Desativar usuário |

### Solicitações
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/requests` | Autenticado | Listar (próprias ou do campus) |
| POST | `/api/requests` | STUDENT | Criar solicitação |
| GET | `/api/requests/{id}` | Autenticado | Detalhes + documentos |
| PUT | `/api/requests/{id}/analyze` | COORDINATOR/ADMIN | Analisar (aprovar/rejeitar) |
| POST | `/api/requests/{id}/documents` | STUDENT/COORDINATOR | Anexar documento |
| GET | `/api/requests/{id}/audit` | COORDINATOR/ADMIN | Histórico de auditoria |

### Notificações
| Método | Path | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/api/notifications` | Autenticado | Listar notificações do usuário |
| PUT | `/api/notifications/{id}/read` | Autenticado | Marcar como lida |

---

## 10. Estrutura do Projeto

```
tcc/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/br/edu/ifrs/portoalegre/ac/
│   │   ├── ActividadesComplementaresApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   ├── JwtService.java
│   │   │   └── LdapAuthService.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── CampusController.java
│   │   │   ├── CourseController.java
│   │   │   ├── ActivityPreferenceController.java
│   │   │   ├── ActivityRequestController.java
│   │   │   ├── UserController.java
│   │   │   └── NotificationController.java
│   │   ├── dto/
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── UserDTO.java
│   │   │   ├── CourseDTO.java
│   │   │   ├── ActivityPreferenceDTO.java
│   │   │   ├── ActivityRequestDTO.java
│   │   │   ├── DocumentDTO.java
│   │   │   └── NotificationDTO.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   ├── Campus.java
│   │   │   ├── Course.java
│   │   │   ├── ActivityPreference.java
│   │   │   ├── ActivityRequest.java
│   │   │   ├── RequestAudit.java
│   │   │   ├── Document.java
│   │   │   └── Notification.java
│   │   ├── enums/
│   │   │   ├── UserRole.java
│   │   │   ├── ActivityType.java
│   │   │   └── RequestStatus.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── CampusRepository.java
│   │   │   ├── CourseRepository.java
│   │   │   ├── ActivityPreferenceRepository.java
│   │   │   ├── ActivityRequestRepository.java
│   │   │   ├── RequestAuditRepository.java
│   │   │   ├── DocumentRepository.java
│   │   │   └── NotificationRepository.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       ├── UserService.java
│   │       ├── CampusService.java
│   │       ├── CourseService.java
│   │       ├── ActivityPreferenceService.java
│   │       ├── ActivityRequestService.java
│   │       ├── DocumentService.java
│   │       └── NotificationService.java
│   └── src/main/resources/
│       ├── application.yml           # configurações gerais
│       ├── application-dev.yml       # H2 + dev settings
│       ├── schema-postgres.sql       # DDL produção
│       ├── schema-h2.sql             # DDL dev
│       ├── data-postgres.sql         # seed produção
│       └── data-h2.sql               # seed dev
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/index.js
│       ├── stores/
│       │   ├── auth.js
│       │   ├── requests.js
│       │   └── notifications.js
│       ├── composables/
│       │   └── useApi.js
│       └── views/
│           ├── Login.vue
│           ├── Dashboard.vue
│           ├── Requests.vue
│           ├── NewRequest.vue
│           ├── RequestDetail.vue
│           ├── Audit.vue
│           ├── Preferences.vue
│           ├── Courses.vue
│           ├── Users.vue
│           ├── Coordinators.vue
│           └── Layout.vue
├── docker-compose.yml                # PostgreSQL para dev
└── README.md
```

---

## 11. Configuração de Ambiente

### Variáveis de ambiente (produção)
```bash
# Banco
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ac_ifrs
DB_USER=postgres
DB_PASSWORD=sua-senha

# JWT
JWT_SECRET=sua-chave-secreta-aqui-minimo-256-bits
JWT_EXPIRATION=86400000

# LDAP (coordenadores) — código PHP a receber do orientador
# Parâmetros passados ao servidor LDAP interno:
LDAP_BASE_DN=ou=people,dc=ifrs,edu,br
LDAP_BIND_DN=cn=admin,dc=ifrs,edu,br
LDAP_BIND_PASSWORD=senha-admin   # NUNCA hardcoded no código
LDAP_USER_ATTRIBUTE=uid
LDAP_URL=ldap://ldap.ifrs.edu.br:389
```

> **Nota**: A autenticação LDAP é implementada em **PHP** (código do IFRS). O backend Java não usa `spring-ldap-core`. A validação é feita consultando o servidor LDAP com os parâmetros acima; apenas o resultado (sucesso/falha) é retornado.

### Profiles
- `dev`: H2 em memória, SQL scripts executados, LDAP desligado, H2 console ativo.
- `prod` (padrão): PostgreSQL, sem SQL scripts, LDAP configurável via env vars.

---

## 12. Frontend — Telas

| Tela | Rota | Acesso | Descrição |
|------|------|--------|-----------|
| Login | `/login` | Visitante | Username + senha |
| Dashboard | `/dashboard` | Todos | Visão geral: horas aproveitadas vs. requeridas |
| Solicitações | `/requests` | Todos | Lista das suas solicitações (aluno) ou do campus (coord) |
| Nova Solicitação | `/requests/new` | STUDENT | Formulário para abrir solicitação |
| Detalhe | `/requests/:id` | Autenticado | Detalhes + documentos + status |
| Auditoria | `/requests/:id/audit` | COORD/ADMIN | Histórico de mudanças |
| Preferências | `/preferences` | ADMIN/COORD | Configurar limites por tipo e curso |
| Cursos | `/courses` | ADMIN | CRUD de cursos |
| Usuários | `/users` | ADMIN | CRUD de usuários, ativação/desativação |
| Coordenadores | `/coordinators` | ADMIN | Cadastro de coordenadores por campus/corso |
| Layout | `/` | Autenticado | Sidebar + header + conteúdo |

### Rotas protegidas
- `/login` — acesso público (guest).
- Todas as demais — exigem token JWT válido.
- `/preferences`, `/courses`, `/users`, `/coordinators` — apenas ADMIN.
- `/preferences` — também COORDINATOR.

---

## 13. Critérios de Sucesso (TCC)

1. Aluno consegue **abrir solicitação** e ver o andamento em tempo real.
2. Aluno consegue **anexar documentos** a qualquer momento antes da análise final.
3. Coordenador consegue **analisar, aprovar ou rejeitar** com registro de auditoria.
4. Sistema calcula automaticamente as **horas aproveitadas por tipo**.
5. Aluno desativado **não consegue mais login**.
6. Suporte a **múltiplos campi** e cursos.
7. Login de **coordenadores** com LDAP do IFRS funciona quando habilitado.
8. Interface responsiva e acessível via navegador.

---

## 14. Observações para o Desenvolvimento

- **Não usar** `javax.*` para web/security (usar `jakarta.*`). Manter `javax.crypto` e `javax.naming` do JDK padrão.
- **Não herdar** de `EntityClassMapper` ou classes obsoletas do Hibernate.
- **Testar com H2** antes de mudar para PostgreSQL — o dev profile já vem configurado.
- **Hash de senha**: usar `BCryptPasswordEncoder` do Spring Security. Nunca armazenar senha em texto puro.
- **JWT secret**: nunca hardcodar. Usar variável de ambiente.
- **Arquivos**: limitar tamanho a 10MB por arquivo (configurado no `application.yml`).
- **Maven**: usar `maven-compiler-plugin` com `annotationProcessorPaths` para Lombok funcionar corretamente.
- **Spring Security 7**: atenção a mudanças de API em relação à versão 6.
