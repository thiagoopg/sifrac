# Solução de Problemas

Problemas comuns e como resolvê-los.

---

## Backend

### ❌ Erro: "Failed to connect to ldap://localhost:3890"

**Causa**: O LLDAP não está rodando.

**Solução**:
```bash
cd backend
docker-compose up -d
docker ps  # Verificar se hcomplementares-ldap está UP
```

---

### ❌ Erro: "Address already in use: bind" (porta 8081)

**Causa**: Outro processo está usando a porta 8081.

**Solução**:
```bash
# Linux/Mac: encontrar e matar o processo
lsof -i :8081
kill -9 <PID>

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

---

### ❌ Erro: "Failed to connect to localhost:1025" (SMTP)

**Causa**: O Mailpit não está rodando.

**Solução**:
```bash
cd backend
docker-compose up -d
docker ps  # Verificar se hcomplementares-mailpit está UP
```

---

### ❌ Erro: "Table 'XXX' not found"

**Causa**: As migrations do Flyway não foram executadas.

**Solução**:
```bash
# Parar o backend
# Verificar logs de inicialização
mvn spring-boot:run | grep Flyway
# Deve mostrar: "Successfully applied X migrations"
```

Se o Flyway não executar, delete o banco H2 e reinicie:
```bash
rm -rf ~/hcomplementares.mv.db  # Se usar H2 em arquivo
# Reinicie o backend
```

---

## Frontend

### ❌ Erro: "Network Error" ou "ERR_CONNECTION_REFUSED"

**Causa**: O backend não está rodando ou a URL está errada.

**Solução**:
1. Verifique se o backend está rodando:
```bash
curl http://localhost:8081/actuator/health
```

2. Verifique o arquivo `.env` do frontend:
```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

3. Reinicie o frontend:
```bash
cd frontend
npm run dev
```

---

### ❌ Erro: "EADDRINUSE: address already in use :::5173"

**Causa**: Outro processo está usando a porta 5173.

**Solução**:
```bash
# Linux/Mac
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

### ❌ Página em branco após build

**Causa**: Configuração incorreta da base URL.

**Solução**:
Verifique se o arquivo `.env` existe e está correto:
```env
VITE_API_BASE_URL=http://localhost:8081/api/v1
```

---

## Docker

### ❌ Erro: "Cannot connect to the Docker daemon"

**Causa**: Docker não está rodando.

**Solução**:
- **Linux**: `sudo systemctl start docker`
- **Mac/Windows**: Abra o Docker Desktop

---

### ❌ Containers não sobem

**Causa**: Portas já em uso ou Docker sem recursos.

**Solução**:
```bash
# Parar todos os containers
docker-compose down

# Ver containers rodando
docker ps -a

# Remover containers antigos
docker-compose rm -f

# Subir novamente
docker-compose up -d
```

---

## E-mail

### ❌ E-mail não é enviado

**Causa 1**: Flag de envio desabilitada.

**Solução**: Verifique as variáveis de ambiente:
```bash
export MAIL_ENABLED="true"
export MAIL_AVALIACAO_ALUNO_ENABLED="true"
```

**Causa 2**: Mailpit não está rodando.

**Solução**:
```bash
docker ps  # Verificar se hcomplementares-mailpit está UP
docker-compose up -d
```

---

### ❌ Erro: "MailAuthenticationException"

**Causa**: Usuário/senha SMTP incorretos (apenas se usar SMTP real).

**Solução**: Verifique as credenciais em `MAIL_USERNAME` e `MAIL_PASSWORD`.

---

### ❌ Erro: "SSLHandshakeException"

**Causa**: Configuração TLS/SSL incorreta.

**Solução**:
- **Porta 587** (STARTTLS):
```bash
MAIL_SMTP_STARTTLS="true"
MAIL_SMTP_SSL="false"
```

- **Porta 465** (SSL):
```bash
MAIL_SMTP_STARTTLS="false"
MAIL_SMTP_SSL="true"
```

---

## Autenticação

### ❌ Login falha com credenciais corretas

**Causa**: LDAP não está configurado corretamente.

**Solução**:
1. Verifique as variáveis LDAP no `.env`:
```bash
LDAP_URL="ldap://localhost:3890"
LDAP_BASE_DN="dc=example,dc=com"
```

2. Teste a conexão LDAP:
```bash
ldapsearch -x -H ldap://localhost:3890 -b "dc=example,dc=com"
```

---

## Performance

### ❌ Sistema lento ou travando

**Causa**: H2 em memória pode ficar lento com muitos dados.

**Solução**:
```bash
# Limpar banco H2 (CUIDADO: apaga todos os dados)
# Parar o backend, depois:
rm -rf ~/hcomplementares.mv.db
# Reiniciar o backend
```

---

## Logs úteis

### Ver logs do backend
```bash
cd backend
mvn spring-boot:run
# Logs aparecem no terminal
```

### Ver logs do Docker
```bash
docker-compose logs -f
# ou para um serviço específico:
docker-compose logs -f mailpit
```

### Ver logs do frontend
```bash
cd frontend
npm run dev
# Logs aparecem no terminal e no console do navegador (F12)
```

---

## Ainda com problemas?

1. Verifique se todas as portas necessárias estão livres:
   - 3890 (LDAP)
   - 1025 (SMTP)
   - 8025 (Mailpit UI)
   - 8081 (Backend)
   - 5173 (Frontend)

2. Reinicie tudo do zero:
```bash
# Parar tudo
docker-compose down
pkill -f spring-boot
pkill -f vite

# Subir novamente
docker-compose up -d
cd backend && mvn spring-boot:run &
cd frontend && npm run dev
```

3. Verifique os arquivos de configuração:
   - `backend/.env`
   - `frontend/.env`
