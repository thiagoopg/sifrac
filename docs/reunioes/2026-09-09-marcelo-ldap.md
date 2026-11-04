# Reunião com Orientador — 09/09/2026

## Participantes
- **Orientador**: Marcelo Augusto Rauh Schmitt
- **Aluno**: Thiago Adriel Oliveira de Lima (Adriel)

---

## Tema: Autenticação LDAP e Cadastro de Coordenadores

### 1. Como funciona o LDAP no IFRS

O sistema de autenticação LDAP do IFRS é desenvolvido em **PHP**. O Marcelo iria enviar o código-fonte para o aluno entender a lógica.

**Parâmetros de conexão com o servidor LDAP:**
- `baseDN` — base da busca
- `bindDN` — DN do administrador LDAP
- `bindPassword` — senha do administrador
- `userAttribute` — atributo usado para busca (ex: uid)

**Fluxo:**
1. Programa se conecta ao servidor LDAP interno do IFRS
2. Passa os parâmetros acima + username e senha digitados pelo usuário
3. Retorna sucesso se autenticar, falha caso contrário

> **Nota de segurança**: Não colocar a senha do bindDN diretamente no código. Deve ser configurada via variável de ambiente ou arquivo de configuração externo.

---

### 2. O que dá para obter do LDAP

| Tipo de usuário | Informação obtida | Observação |
|----------------|-------------------|------------|
| **Coordenador (professor)** | Apenas autenticação (sim/não) | Não se obtém nome, curso ou outras informações |
| **Aluno** | Nenhuma informação relevante | Deve-se considerar que **não** se consegue determinar o curso do aluno pelo LDAP |

> **Decisão do orientador**: "Do aluno, tenho de descobrir. Acho que deverias considerar que não consegues."

---

### 3. Cadastro de Coordenadores

**Processo manual pelo administrador:**

O admin precisa de uma tela para cadastrar professores que são coordenadores, com os campos:
- **Nome do professor**
- **Email**
- **Username LDAP** (ex: `marceloschmitt`)
- **Curso** vinculado

**Detalhes importantes:**
- São aproximadamente **20 coordenadores** para manter atualizados ao longo dos anos
- Não há vínculo automático com LDAP — tudo é cadastrado manualmente
- O sistema sabe que é coordenador pelo **username** que entrou (papel atribuído no cadastro)
- SSI **não é um usuário LDAP** — existe apenas como email no Google

---

### 4. Cadastro de Alunos

- Aluno **seleciona o curso manualmente** na tela de registro
- Não há como inferir o curso a partir do LDAP
- Login: username + senha (autenticação local, não LDAP)

---

### 5. Fluxo de Autenticação Resumido

```
COORDENADOR:
  Login com username LDAP → conecta ao servidor LDAP → valida credenciais →
  Se válido, verifica se username está cadastrado como COORDINADOR no banco →
  Se sim, gera token JWT

ALUNO:
  Login com username + senha local (bcrypt) →
  Verifica no banco → gera token JWT
```

---

## Pendências

- [ ] Marcelo enviar o código PHP do LDAP
- [ ] Definir se o sistema vai usar o código PHP como referência ou reescrever em Java
- [ ] Confirmar se há mais de um campus com coordenadores diferentes

---

*Documento gerado a partir de conversa via WhatsApp em 09/09/2026*
