# Configuracao de E-mail (SMTP)

Este documento descreve como configurar o envio de e-mails do Sistema de
Horas Complementares **sem alterar ou recompilar o codigo**.

O sistema envia:

- **Retorno ao aluno**: sempre que uma solicitacao e deferida ou indeferida.
- **Resumo ao coordenador**: quando a quantidade de solicitacoes pendentes do
  curso supera a ultima quantidade que gerou envio.

---

## 1. Como a configuracao funciona

A aplicacao le as configuracoes da seguinte ordem (a ultima sobrescreve a anterior):

1. `application.properties` empacotado no `.jar` (padroes de desenvolvimento).
2. `application-prod.properties` quando o perfil `prod` esta ativo.
3. Variaveis de ambiente (`MAIL_*`, `APP_BASE_URL`, ...).
4. Arquivo externo `config/application.properties` (recomendado para credenciais).

Nenhuma senha deve ser versionada no repositorio.

---

## 2. Variaveis disponiveis

| Variavel | Padrao | Descricao |
|---|---|---|
| `MAIL_HOST` | `localhost` | Host do servidor SMTP |
| `MAIL_PORT` | `1025` | Porta SMTP (587 STARTTLS, 465 SSL) |
| `MAIL_USERNAME` | vazio | Usuario de autenticacao |
| `MAIL_PASSWORD` | vazio | Senha de autenticacao |
| `MAIL_PROTOCOL` | `smtp` | Protocolo |
| `MAIL_SMTP_AUTH` | `false` | Habilita autenticacao |
| `MAIL_SMTP_STARTTLS` | `false` | Habilita STARTTLS (porta 587) |
| `MAIL_SMTP_STARTTLS_REQUIRED` | `false` | Exige STARTTLS |
| `MAIL_SMTP_SSL` | `false` | Habilita SSL direto (porta 465) |
| `MAIL_TIMEOUT` | `5000` | Timeout de conexao/leitura/escrita (ms) |
| `MAIL_FROM` | `no-reply@hcomplementares.ifrs.edu.br` | Remetente |
| `MAIL_ENABLED` | `false` | Liga/desliga o envio automatico |
| `MAIL_AVALIACAO_ALUNO_ENABLED` | `false` | Envia retorno ao aluno |
| `MAIL_RESUMO_PENDENCIAS_ENABLED` | `false` | Envia resumo de pendencias ao coordenador |
| `APP_BASE_URL` | `http://localhost:5173` | URL publica usada nos links dos e-mails |
| `MAIL_HEALTH_ENABLED` | `false` | Expõe o SMTP no `/actuator/health` |

> Em producao, ative o perfil `prod` (`SPRING_PROFILES_ACTIVE=prod`). Ele liga
> automaticamente `MAIL_ENABLED` e `MAIL_AVALIACAO_ALUNO_ENABLED`.

---

## 3. Opcao A - Configurar por arquivo externo (recomendado)

1. Copie o exemplo:

```bash
cp config/application.properties.example config/application.properties
```

2. Edite `config/application.properties` com os dados do SMTP institucional.

3. Inicie a aplicacao:

```bash
SPRING_PROFILES_ACTIVE=prod java -jar hcomplementares.jar \
  --spring.config.additional-location=optional:file:./config/
```

O arquivo fica fora do `.jar`; a TI pode alterar host/porta/senha e reiniciar
a aplicacao sem recompilar nada.

---

## 4. Opcao B - Configurar por variaveis de ambiente

```bash
export SPRING_PROFILES_ACTIVE=prod
export MAIL_HOST=smtp.ifrs.edu.br
export MAIL_PORT=587
export MAIL_USERNAME=usuario.smtp@ifrs.edu.br
export MAIL_PASSWORD='senha'
export MAIL_SMTP_AUTH=true
export MAIL_SMTP_STARTTLS=true
export MAIL_SMTP_STARTTLS_REQUIRED=true
export MAIL_SMTP_SSL=false
export MAIL_FROM=no-reply@hcomplementares.ifrs.edu.br
export APP_BASE_URL=https://horascomplementares.ifrs.edu.br

java -jar hcomplementares.jar
```

### Exemplo SMTP com SSL direto (porta 465)

```bash
export MAIL_PORT=465
export MAIL_SMTP_STARTTLS=false
export MAIL_SMTP_STARTTLS_REQUIRED=false
export MAIL_SMTP_SSL=true
```

### Exemplo Gmail (temporario, para testes)

Requer verificacao em duas etapas e uma **App Password** de 16 caracteres:

```bash
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=seuemail@gmail.com
export MAIL_PASSWORD='abcd efgh ijkl mnop'
export MAIL_SMTP_AUTH=true
export MAIL_SMTP_STARTTLS=true
export MAIL_FROM=seuemail@gmail.com
```

> O Gmail normalmente reescreve o remetente para a conta autenticada.

---

## 5. Desenvolvimento com Mailpit (captura local)

O `docker-compose.yml` do backend inclui o servico `mailpit`:

```bash
cd backend
docker compose up -d mailpit
```

- SMTP: `localhost:1025`
- Interface web: `http://localhost:8025`

Para ativar no desenvolvimento:

```bash
MAIL_ENABLED=true \
MAIL_AVALIACAO_ALUNO_ENABLED=true \
mvn spring-boot:run
```

O Mailpit **captura** as mensagens localmente; ele **nao entrega** em caixas
externas como `@aluno.poa.ifrs.edu.br`. Para entrega real, use o SMTP
institucional ou um Gmail temporario.

---

## 6. Validar a configuracao (sem criar solicitacao)

Com o backend rodando, autentique-se como administrador e chame o endpoint
de teste:

```bash
# Login (cookie de sessao)
curl -c /tmp/cookies.txt -X POST http://localhost:8081/api/v1/login \
  -d 'username=admin&password=senha123'

# Envia para um destinatario especifico
curl -b /tmp/cookies.txt -X POST http://localhost:8081/api/v1/admin/email/teste \
  -H 'Content-Type: application/json' \
  -d '{"destinatario":"2024009471@aluno.poa.ifrs.edu.br"}'

# Ou sem corpo: envia para o e-mail do administrador autenticado
curl -b /tmp/cookies.txt -X POST http://localhost:8081/api/v1/admin/email/teste
```

Resposta de sucesso:

```json
{
  "sucesso": true,
  "mensagem": "E-mail de teste enviado com sucesso. Verifique a caixa de entrada.",
  "destinatario": "2024009471@aluno.poa.ifrs.edu.br"
}
```

Resposta de falha (exemplo):

```json
{
  "sucesso": false,
  "mensagem": "Falha ao enviar o e-mail de teste: MailAuthenticationException - ...",
  "destinatario": "2024009471@aluno.poa.ifrs.edu.br"
}
```

O endpoint de teste **funciona mesmo com `MAIL_ENABLED=false`**, justamente para
validar a configuracao antes de ligar o envio automatico.

---

## 7. Checklist de ativacao em producao

- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `config/application.properties` (ou variaveis `MAIL_*`) preenchido
- [ ] `MAIL_FROM` autorizado pelo servidor SMTP
- [ ] Endpoint de teste retornando `sucesso: true`
- [ ] `MAIL_ENABLED=true` e `MAIL_AVALIACAO_ALUNO_ENABLED=true`
- [ ] `MAIL_RESUMO_PENDENCIAS_ENABLED` conforme a necessidade da coordenacao
- [ ] `APP_BASE_URL` apontando para o frontend publico
- [ ] Logs sem mensagens `[EMAIL] Falha ao enviar...`

---

## 8. Problemas comuns

| Sintoma | Causa provavel | Solucao |
|---|---|---|
| `Connection refused` | Host/porta errados ou firewall | Confirme `MAIL_HOST`/`MAIL_PORT` e libere saida |
| `MailAuthenticationException` | Usuario/senha invalidos | Revise `MAIL_USERNAME`/`MAIL_PASSWORD` |
| `SSLHandshakeException` | Modo TLS incorreto | Porta 587 usa STARTTLS; 465 usa SSL |
| `MessagingException: 550` | Remetente nao autorizado | Ajuste `MAIL_FROM` para conta permitida |
| E-mail nao chega | Spam/filtro ou Mailpit | Verifique spam e se nao esta usando Mailpit |
| `/actuator/health` DOWN | Health check de e-mail ativo | `MAIL_HEALTH_ENABLED=false` ou configure o SMTP |

---

## 9. Resumo de pendencias do coordenador

Quando `MAIL_RESUMO_PENDENCIAS_ENABLED=true`, cada nova solicitacao dispara o
calculo das pendencias do coordenador do curso. O e-mail so e enviado quando:

- existe pelo menos uma solicitacao `PENDENTE`; e
- a quantidade atual e **maior** que a ultima quantidade que gerou envio.

Avaliacoes e cancelamentos reduzem a quantidade e **nunca** geram e-mail. O
controle fica na tabela `coordenador_notificacao_pendencia`, com uma linha por
coordenador e data (`coordenador_id`, `data_referencia`).

Se o envio falhar, a quantidade nao e registrada, permitindo nova tentativa na
proxima solicitacao.

## 10. Seguranca

- Nunca commite `config/application.properties` nem `.env` com senha real.
- Prefira segredos do orquestrador (Kubernetes Secret, Docker Secret, etc.).
- O `MailConfigLogger` registra host/porta/remetente no startup, mas **nunca**
  a senha.
- O endpoint de teste e restrito ao perfil `ADMINISTRADOR`.
