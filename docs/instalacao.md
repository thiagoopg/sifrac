# Instalação do Sistema

Este guia detalha como configurar e rodar o sistema no seu computador.

---

## 1. Pré-requisitos

Instale as ferramentas abaixo:

| Ferramenta | Versão mínima | Verificar com |
|------------|---------------|---------------|
| Java JDK | 21 | `java --version` |
| Maven | 3.9+ | `mvn --version` |
| Node.js | 20+ | `node --version` && `npm --version` |
| Docker | Latest | `docker --version` |

---

## 2. Estrura do projeto

```
tcc/
├── backend/     # API Java (porta 8081)
├── frontend/    # Frontend Vue (porta 5173)
├── admin/       # Spring Boot Admin (porta 8080)
└── docs/        # Documentação
```

---

## 3. Serviços auxiliares (Docker)

O sistema precisa de dois serviços que rodam em container:

- **Mailpit**: Servidor SMTP para capturar e-mails enviados durante desenvolvimento

**Nota**: O LDAP é o do IFRS (real), não precisa rodar nada localmente para autenticação.

### 3.1 Subir o Mailpit

```bash
cd backend
docker-compose up -d mailpit
```

### 3.2 Verificar se está rodando

```bash
docker ps
# Deve mostrar:
# hcomplementares-mailpit (portas 1025, 8025)
```

**Nota**: Se quiser usar o LLDAP simulado para testes locais (opcional), veja a seção "LLDAP para desenvolvimento" no final.

---

## 4. Configurar e rodar o backend

### 4.1 Variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/`:

```bash
# backend/.env

# LDAP do IFRS (produção)
LDAP_URL="ldap://ldap.ifrs.edu.br"
LDAP_BASE_DN="dc=ifrs,dc=edu,dc=br"
LDAP_ADMIN_DN="cn=admin,dc=ifrs,dc=edu,dc=br"
LDAP_ADMIN_PASS="senha-do-admin-ldap"
LDAP_SEARCH_BASE_DN="ou=usuarios"
LDAP_USER_FILTER="(uid={0})"

# SMTP (Mailpit para desenvolvimento)
MAIL_HOST="localhost"
MAIL_PORT="1025"
MAIL_SMTP_AUTH="false"
MAIL_SMTP_STARTTLS="false"
MAIL_SMTP_SSL="false"

# Funcionalidades de e-mail
MAIL_ENABLED="true"
MAIL_AVALIACAO_ALUNO_ENABLED="true"
MAIL_RESUMO_PENDENCIAS_ENABLED="false"
APP_BASE_URL="http://localhost:5173"
MAIL_HEALTH_ENABLED="false"
```

⚠️ **Importante**: 
- As configurações de LDAP acima são exemplo. Solicite as credenciais reais ao setor de TI do IFRS.
- Esse arquivo `.env` é apenas para desenvolvimento. Não versione no Git com senhas reais.

### 4.2 Rodar o backend

```bash
cd backend
source .env
mvn spring-boot:run
```

O backend estará disponível em: http://localhost:8081

### 4.3 Verificar se está funcionando

```bash
curl http://localhost:8081/actuator/health
# Resposta: {"status":"UP"}
```

---

## 5. Configurar e rodar o frontend

### 5.1 Instalar dependências

```bash
cd frontend
npm install
```

### 5.2 Configurar URL da API

Crie o arquivo `.env` na pasta `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

### 5.3 Rodar o frontend

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: http://localhost:5173

---

## 6. Autenticação com LDAP real

O sistema usa o **LDAP do IFRS** para autenticação. Os usuários são autenticados com suas credenciais institucionais.

**Nota para produção**: Solicite ao setor de TI do IFRS:
- Endereço correto do servidor LDAP
- Credenciais de acesso (se necessário)
- Base DN e filtro de usuários

---

## LLDAP para desenvolvimento (opcional)

Se quiser testar localmente sem depender do LDAP do IFRS, pode usar o LLDAP simulado:

1. Subir o LLDAP:
```bash
cd backend
docker-compose up -d lldap
```

2. Acessar interface web: http://localhost:17170
3. Login: `uid=admin,ou=people,dc=example,dc=com` / `senha123`

4. No arquivo `.env`, use:
```bash
# LDAP simulado
LDAP_URL="ldap://localhost:3890"
LDAP_BASE_DN="dc=example,dc=com"
LDAP_ADMIN_DN="uid=admin,ou=people,dc=example,dc=com"
LDAP_ADMIN_PASS="senha123"
LDAP_SEARCH_BASE_DN="ou=people"
LDAP_USER_FILTER="(uid={0})"
```

---

## 7. Testar o sistema

1. Abra http://localhost:5173 no navegador
2. Faça login com um usuário existente
3. Navegue pelo sistema

### Usuários de teste disponíveis

| Login | Perfil |
|-------|--------|
| `admin` | ADMINISTRADOR |
| `coordpoa` | ADMIN_CAMPUS |
| `marceloschmitt` | COORDENADOR |
| `thiagolima` | ALUNO |

---

## 8. Ver e-mails enviados

Durante o desenvolvimento, todos os e-mails são capturados pelo Mailpit:

1. Acesse: http://localhost:8025
2. Veja a lista de e-mails enviados pelo sistema
3. Clique em um e-mail para ver o conteúdo

---

## 9. Comandos úteis

```bash
# Ver logs do backend
cd backend && mvn spring-boot:run

# Ver logs do Docker
docker-compose logs -f

# Parar os containers
docker-compose down

# Rodar testes do backend
cd backend && mvn test

# Build de produção do frontend
cd frontend && npm run build
```

---

## Próximos passos

- Configure o SMTP real para produção (veja [CONFIGURACAO_EMAIL.md](CONFIGURACAO_EMAIL.md))
- Em caso de problemas, consulte [TROUBLESHOOTING.md](TROUBLESHOOTING.md)