# Atividades Complementares IFRS — Esquema do Banco de Dados

> Versão: 1.0
> Data: 10/09/2026
> Status: Em desenvolvimento

---

## 📁 Estrutura de Arquivos

```
docs/er-diagram/
├── ESQUEMA_BANCO.md          # Documentação completa do schema
├── PERGUNTAS_RESPostas.md    # Decisões de design
├── schema-postgres.sql       # Schema PostgreSQL (produção)
├── schema-h2.sql             # Schema H2 (desenvolvimento)
├── V1__initial_schema.sql    # Migration Flyway - Criação
└── V2__seed_data.sql         # Migration Flyway - Dados iniciais
```

---

## 🗄️ Entidades Principais

| Entidade | Descrição | Registro Inicial |
|----------|-----------|------------------|
| `campus` | Campi do IFRS | 3 (POA, NPOA, CAN) |
| `curso` | Cursos de graduação | 4 |
| `usuario` | Users do sistema | 3 (admin, coord, student) |
| `preferencia_atividade` | Limites por tipo/course | 7 (por curso) |
| `solicitacao_atividade` | Solicitações dos alunos | 0 |
| `audit_solicitacao` | Histórico de mudanças | 0 |
| `documento` | Arquivos anexados | 0 |
| `notificacao` | Notificações do sistema | 0 |

---

## 🔑 Relacionamentos

```
campus (1) ──→ (N) curso
curso (1) ──→ (N) usuario (coordenador_id)
curso (1) ──→ (N) preferencia_atividade
usuario (1) ──→ (N) solicitacao_atividade
solicitacao (1) ──→ (N) documento
solicitacao (1) ──→ (N) audit_solicitacao
usuario (1) ──→ (N) notificacao
```

---

## 📊 Tipos de Atividade (7)

1. **COURSE** — Cursos de extensão e livres
2. **EVENT** — Participação em eventos, congressos, seminários
3. **RESEARCH** — Projetos de pesquisa científicos
4. **MONITORING** — Exercício de monitoria acadêmica
5. **PUBLICATION** — Publicações científicas e artigos
6. **EXTENSION** — Atividades de extensão comunitária
7. **PROFESSIONAL** — Experiência profissional na área

---

## 🔄 Status da Solicitação (5)

| Status | Significado |
|--------|-------------|
| `PENDING` | Aberta, aguardando análise |
| `UNDER_ANALYSIS` | Em análise pelo coordenador |
| `COMPLEMENTATION_REQUESTED` | Complementação solicitada |
| `APPROVED` | Aprovada |
| `REJECTED` | Rejeitada |

---

## 👥 Perfis de Usuário (3)

| Perfil | Acesso | Autenticação |
|--------|--------|--------------|
| `ADMIN` | Todas as telas | bcrypt local |
| `COORDINATOR` | Análise de solicitações do campus | LDAP |
| `STUDENT` | Abertura de solicitações | bcrypt local + CPF |

---

## 🚀 Executar Migrações

### Desenvolvimento (H2)
```bash
# Rodar aplicação com perfil dev
mvn spring-boot:run -Dspring.profiles.active=dev

# Acessar H2 Console: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:tcc_db
# Username: sa
# Password: (vazio)
```

### Produção (PostgreSQL)
```bash
# Variáveis de ambiente
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=ac_ifrs
export DB_USER=postgres
export DB_PASSWORD=sua-senha

# Rodar com perfil prod
mvn spring-boot:run -Dspring.profiles.active=prod
```

---

## 📝 Dados Iniciais (Seed)

### Usuários
| Username | Nome | CPF | Role | Senha |
|----------|------|-----|------|-------|
| `admin` | Administrador | 123.456.789-01 | ADMIN | demo |
| `marceloschmitt` | Marcelo Schmitt | 111.222.333-44 | COORDINATOR | (LDAP) |
| `thiagolima` | Thiago Lima | 555.666.777-88 | STUDENT | demo |

> **Nota:** Senha `demo` para testes. Em produção, usar senhas seguras.

---

## 🔒 Constraints de Negócio

1. **CPF único** — 11 dígitos, formato validado
2. **Email único** — Global no sistema
3. **Curso + Campus únicos** — Não repetir curso no mesmo campus
4. **Tipo + Curso únicos** — Não repetir tipo de atividade no mesmo curso
5. **Soft delete** — Nenhum registro é fisicamente removido

---

*Documento gerado automaticamente a partir dos requisitos do TCC*
