# SIFRAC - Sistema de Registro de Atividades Complementares

📘 Documentação Completa – Spring Boot + LDAP + PostgreSQL

⚙️ Guia de configuração: para entender como configurar e-mails, SMTP, LDAP, banco de dados e demais opções, consulte o guia completo em docs/CONFIGURACAO.md.

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
| PostgreSQL     | 13+               |
| LDAP           | OpenLDAP          |
| Docker         | latest            |
| Docker Compose | latest            |

---

## 📦 Instalação

### 🐳 Docker Compose (recomendado)

Suba todos os serviços com um comando:

```bash
cd backend
docker-compose up -d
```

**Serviços disponíveis:**

- PostgreSQL: `localhost:5432` (banco: `sifrac`, usuário: `sifrac`)
- LDAP local: `localhost:3890` (opcional, em produção pode usar servidor LDAP institucional)
- Mailpit SMTP: `localhost:1025` (UI: `localhost:8025`)

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

---

## 🗄️ Flyway: Estratégia recomendada

### Nunca:

- Editar migration antiga já aplicada
- Deletar migration aplicada em produção
- Usar `hibernate.hbm2ddl.auto=update` em produção

### Evite:

`hibernate.hbm2ddl.auto=update` — isso destrói previsibilidade.

### Fluxo ideal:

1. Altera entidade/modelo
2. Cria migration SQL
3. Commit junto
4. CI sobe banco limpo
5. Flyway aplica tudo automaticamente

---

## 🔐 LDAP (estrutura padrão)

### Produção: LDAP Institucional

```
ldap://ldap.seu-dominio.com:389
Base DN: dc=seu-dominio,dc=com
```

### Development: LLDAP local (opcional)

```
localhost:3890
Base DN: dc=example,dc=com
```

**Estrutura padrão:**
```
dc=example,dc=com
 ├── ou=people
 │    └── uid=user1
 └── ou=groups
      └── cn=alunos
```

---

## ⚙️ Configuração

### 📄 Arquivo `.env`

Crie um arquivo `.env` na raiz do backend:

```bash
cp backend/.env.example backend/.env
```

Edite com suas credenciais:

```bash
# Banco
POSTGRES_DB=sifrac
POSTGRES_USER=sifrac
POSTGRES_PASSWORD=sua_senha_segura

# LDAP (em produção pode usar servidor institucional)
LDAP_URL=ldap://ldap.seu-dominio.com:389
LDAP_BASE_DN=dc=seu-dominio,dc=com

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=seu-email@gmail.com
SMTP_PASSWORD=sua_senha_app
```

### 🚫 NUNCA versione `.env`

Use secrets em produção!

---

## 🚀 Execução

### ▶️ Modo desenvolvimento

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

---

## 🔐 Autenticação

O sistema usa **LDAP** para autenticação.

### Roles padrão

| Grupo LDAP    | Role no Sistema   |
|---------------|-------------------|
| alunos        | ALUNO             |
| coordenadores | COORDENADOR       |
| admins        | ADMINISTRADOR     |

### 👥 Perfis de usuário

| Perfil       | Login teste    | Descrição                      |
|--------------|----------------|--------------------------------|
| ADMINISTRADOR | `admin`       | Acesso total ao sistema        |
| ADMIN_CAMPUS  | `coordpoa`     | Gerencia solicitações do campus|
| COORDENADOR   | `marceloschmitt` | Avalia solicitações do curso  |
| ALUNO         | `thiagolima`   | Submete solicitações           |

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
- URL do LDAP
- DN base
- Senha
- Porta aberta

### Banco falhando

Verifique:
- Banco existe
- Credenciais corretas
- Porta 5432 aberta

### E-mails não enviados

Verifique:
- Configuração SMTP em `.env`
- Mailpit rodando (`docker-compose ps`)
- Porta 1025 liberada

---

## 🧠 Boas práticas

- ✅ Nunca versionar `.env`
- ✅ Usar secrets em produção
- ✅ Evitar `hibernate update` em produção
- ✅ sempre criar migration para mudanças no banco
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
      ├── INSTALACAO.md
      ├── CONFIGURACAO_EMAIL.md
      └── TROUBLESHOOTING.md
```

---

## ℹ️ Sobre

**SIFRAC** - Sistema de Registro de Atividades Complementares

Desenvolvido para gerenciar solicitações de horas complementares dos alunos.

Repositório: https://github.com/thiagoopg/sifrac