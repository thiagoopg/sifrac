# SIFRAC - Sistema de Registro de Atividades Complementares

📘 Documentação Completa – Spring Boot + LDAP + PostgreSQL

⚙️ Guia de configuração detalhado: consulte `docs/configuracao_email.md` para e-mails, SMTP, `docs/instalacao.md` para instalação e `docs/problemas.md` para troubleshooting.

---

## 🎯 Objetivo

Este documento descreve tudo o que é necessário para:

- Configurar a aplicação
- Instalar dependências
- Preparar ambiente
- Executar localmente ou em servidor

---

## 🧱 Requisitos do Sistema

### 🔧 Dependências obrigatórias

| Ferramenta     | Versão recomendada |
|----------------|-------------------|
| Java           | 21+               |
| Maven          | 3.9+              |
| Node.js        | 18+               |
| npm            | 9+                |
| PostgreSQL     | 13+               |
| LDAP           | OpenLDAP ou compatível |
| Docker         | latest            |
| Docker Compose | latest            |

---

## 🚀 Primeiros Passos (do zero)

Se você já tem um servidor LDAP (institucional ou próprio), siga esta ordem:

### 1. Clonar o repositório

```bash
git clone https://github.com/thiagoopg/sifrac.git
cd sifrac
```

### 2. Configurar variáveis de ambiente

No backend, copie o exemplo e edite com suas credenciais:

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env`:

```bash
# Banco de dados
POSTGRES_DB=sifrac
POSTGRES_USER=sifrac
POSTGRES_PASSWORD=sua_senha_segura

# LDAP (seu servidor institucional)
LDAP_URL=ldap://ldap.seu-dominio.com:389
LDAP_BASE_DN=dc=seu-dominio,dc=com
LDAP_MANAGER_DN=cn=admin,dc=seu-dominio,dc=com
LDAP_MANAGER_PASSWORD=sua_senha_ldap

# SMTP para envio de e-mails
SMTP_HOST=smtp.seu-servidor.com
SMTP_PORT=587
SMTP_USERNAME=seu-email@dominio.com
SMTP_PASSWORD=sua_senha_app
SMTP_FROM=no-reply@dominio.com

# URL base da aplicação
APP_BASE_URL=http://localhost:8080
```

> 💡 **Variáveis obrigatórias:** `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `LDAP_URL`, `LDAP_BASE_DN`.  
> As demais têm valores padrão ou são opcionais.

### 3. Subir serviços auxiliares (Docker)

No backend:

```bash
docker-compose up -d
```

Isso sobe:
- **PostgreSQL:** `localhost:5432` (banco: `sifrac`, usuário: `sifrac`)
- **Mailpit SMTP:** `localhost:1025` (UI: `localhost:8025`) — para testar e-mails localmente
- **LDAP local:** `localhost:3890` (opcional — só se não tiver LDAP institucional)

### 4. Rodar o backend

Novo terminal, dentro de `backend/`:

```bash
mvn spring-boot:run
```

O backend inicia em: **http://localhost:8080**

### 5. Rodar o frontend

Novo terminal, dentro de `frontend/`:

```bash
npm install
npm run dev
```

O frontend inicia em: **http://localhost:5173**

### 6. Acessar o sistema

| Serviço | URL |
|---------|-----|
| Frontend (Vue 3) | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Mailpit (e-mails de teste) | http://localhost:8025 |

---

## 🔐 LDAP e Autenticação

O sistema autentica via **LDAP**. O perfil de cada usuário é definido da seguinte forma:

| Perfil | Como é definido |
|--------|-----------------|
| **ALUNO** | Automático via LDAP (`OU=Discente` no DN) — criado no banco no primeiro login |
| **COORDENADOR** | **Manual** — cadastrado pelo administrador no banco |
| **ADMIN_CAMPUS** | **Manual** — cadastrado pelo administrador no banco |
| **ADMINISTRADOR** | **Manual** — cadastrado pelo administrador no banco |

### Regras importantes:

- **Alunos**: são criados automaticamente no primeiro login se o DN contiver `OU=Discente`.
- **Docentes/Coordenadores/Admins**: não são criados automaticamente. O admin do sistema deve cadastrá-los manualmente com o perfil correto. O LDAP apenas valida a senha.

---

## ⚙️ Configuração

### 📄 Arquivo `.env`

Crie o arquivo na raiz do backend:

```bash
cd backend
cp .env.example .env
```

Variáveis disponíveis:

| Variável | Obrigatório | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `POSTGRES_DB` | ✅ | Nome do banco | `sifrac` |
| `POSTGRES_USER` | ✅ | Usuário do banco | `sifrac` |
| `POSTGRES_PASSWORD` | ✅ | Senha do banco | `sua_senha` |
| `LDAP_URL` | ✅ | URL do servidor LDAP | `ldap://ldap.empresa.com:389` |
| `LDAP_BASE_DN` | ✅ | Base DN do LDAP | `dc=empresa,dc=com` |
| `LDAP_MANAGER_DN` | ❌ | DN do administrador LDAP | `cn=admin,dc=empresa,dc=com` |
| `LDAP_MANAGER_PASSWORD` | ❌ | Senha do admin LDAP | `senha123` |
| `SMTP_HOST` | ❌ | Servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | ❌ | Porta SMTP | `587` |
| `SMTP_USERNAME` | ❌ | Usuário SMTP | `email@dominio.com` |
| `SMTP_PASSWORD` | ❌ | Senha SMTP | `senha_app` |
| `SMTP_FROM` | ❌ | Remetente dos e-mails | `no-reply@dominio.com` |
| `APP_BASE_URL` | ❌ | URL base da aplicação | `http://localhost:8080` |

### 🚫 NUNCA versione `.env`

Use secrets em produção!

---

## 📦 Instalação detalhada

### ☕ Java

```bash
sudo apt install openjdk-21-jdk
```

### 📦 Maven

```bash
sudo apt install maven
```

### 🗄️ PostgreSQL (sem Docker)

```bash
sudo apt install postgresql
sudo -u postgres psql

CREATE DATABASE sifrac;
CREATE USER sifrac WITH ENCRYPTED PASSWORD 'sifrac123';
GRANT ALL PRIVILEGES ON DATABASE sifrac TO sifrac;
```

### 🗄️ Flyway: Estratégia recomendada

#### Nunca:

- Editar migration antiga já aplicada
- Deletar migration aplicada em produção
- Usar `hibernate.hbm2ddl.auto=update` em produção

#### Evite:

`hibernate.hbm2ddl.auto=update` — isso destrói previsibilidade.

#### Fluxo ideal:

1. Altera entidade/modelo
2. Cria migration SQL
3. Commit junto
4. CI sobe banco limpo
5. Flyway aplica tudo automaticamente

---

## 🚀 Execução

### ▶️ Modo desenvolvimento (backend)

```bash
cd backend
mvn spring-boot:run
```

Acesse: **http://localhost:8080**

### 🐳 Com Docker

```bash
cd backend
docker-compose up -d
```

### 📦 Build

```bash
mvn clean package
java -jar target/hcomplementares-0.0.1-SNAPSHOT.jar
```

### 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse: **http://localhost:5173**

---

## 📬 Funcionalidades de E-mail

- **Retorno de avaliação**: Notifica aluno quando solicitação é avaliada
- **Resumo de pendências**: Notifica coordenador quando há novas solicitações
- **Mailpit**: UI para visualizar e-mails em `http://localhost:8025`

---

## 🧪 Testes

```bash
cd backend
mvn test
```

**52 testes automatizados** cobrindo:

- EmailService
- EmailResumoPendenciasService
- AvaliacaoAlunoListener
- ResumoPendenciasListener
- Repository e Services

---

## ⚠️ Problemas comuns

### LDAP não conecta

Verifique:
- URL do LDAP (`LDAP_URL` no `.env`)
- DN base (`LDAP_BASE_DN`)
- Senha do usuário LDAP
- Porta 389 aberta
- Usuário existe no LDAP

### Banco falhando

Verifique:
- Banco existe (`CREATE DATABASE sifrac`)
- Credenciais corretas no `.env`
- Porta 5432 aberta
- PostgreSQL rodando

### E-mails não enviados

Verifique:
- Configuração SMTP em `.env`
- Mailpit rodando (`docker-compose ps`)
- Porta 1025 liberada

### Usuário não consegue entrar

- Aluno: verifique se `OU=Discente` está no DN do LDAP
- Coordenador/Admin: verifique se foi cadastrado manualmente pelo admin do sistema
- Usuário inativo: verifique se está ativo no banco

---

## 🧠 Boas práticas

- ✅ Nunca versionar `.env`
- ✅ Usar secrets em produção
- ✅ Evitar `hibernate update` em produção
- ✅ Sempre criar migration para mudanças no banco
- ✅ Testar localmente com Docker antes de subir

---

## 📁 Estrutura do Projeto

```
sifrac/
 ├── backend/          # Spring Boot API
 │    ├── src/         # Código fonte
 │    ├── docker-compose.yml
 │    └── .env         # Configurações
 ├── admin/            # Spring Boot Admin
 ├── frontend/         # Vue 3 + Vite
 └── docs/             # Documentação
      ├── instalacao.md
      ├── configuracao_email.md
      └── problemas.md
```

---

## ℹ️ Sobre

**SIFRAC** - Sistema de Registro de Atividades Complementares

Desenvolvido para gerenciar solicitações de horas complementares dos alunos.

Repositório: https://github.com/thiagoopg/sifrac