# Esquema do Banco de Dados — Atividades Complementares IFRS

> Documento gerado em 10/09/2026
> Baseado nos requisitos funcionais e decisões técnicas

---

## 1. Visão Geral

O sistema utiliza **PostgreSQL** em produção e **H2** em desenvolvimento. O schema foi projetado para:
- Suportar múltiplos campi e cursos
- Gerenciar solicitações de atividades complementares
- Rastrear auditoria de mudanças
- Armazenar documentos comprobatórios
- Enviar notificações por email

---

## 2. Diagrama ER

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   CAMPUS    │───────│   CURSO     │───────│ USUARIO     │
│  (1,N)      │  1,N  │  (1,N)      │  0,N  │  (1,N)      │
└─────────────┘       └─────────────┘       └─────────────┘
      │                                         │
      │                    ┌─────────────┐      │
      └────────────────────│ PREFERENCIA │──────┘
                           │  ATIVIDADE  │
                           └─────────────┘
                                    │
                                    │ 1,N
                           ┌─────────────┐
                           │ SOLICITACAO │
                           │   ATIVIDADE │
                           └─────────────┘
                                 │   │
              ┌──────────────────┘   └──────────────────┐
              │                                      │
    ┌─────────▼────────┐                  ┌─────────▼────────┐
    │  DOCUMENTO       │                  │  AUDIT_SOLICITAC │
    └──────────────────┘                  └──────────────────┘
              │
              │ 1,N
    ┌─────────▼────────┐
    │  NOTIFICACAO     │
    └──────────────────┘
```

---

## 3. Descrição das Tabelas

### 3.1 CAMPUS
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| nome | VARCHAR(100) | NOT NULL | Nome do campus |
| codigo | VARCHAR(20) | UNIQUE NOT NULL | Código identificador (ex: POA) |
| endereco | TEXT | NULL | Endereço completo |
| ativo | BOOLEAN | DEFAULT TRUE | Soft delete |
| criado_em | TIMESTAMP | NOT NULL | Data de criação |
| atualizado_em | TIMESTAMP | NOT NULL | Data de última atualização |

**Restrições:**
- Código único por campus
- Soft delete via campo `ativo`

---

### 3.2 CURSO
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| nome | VARCHAR(100) | NOT NULL | Nome do curso |
| campus_id | BIGINT | FK → campus.id | Campus vinculado |
| carga_horaria_total_requerida | INTEGER | DEFAULT 0 | Horas totais de AC |
| ativo | BOOLEAN | DEFAULT TRUE | Soft delete |
| criado_em | TIMESTAMP | NOT NULL | Data de criação |
| atualizado_em | TIMESTAMP | NOT NULL | Data de última atualização |

**Restrições:**
- Nome único por campus (não pode repetir curso no mesmo campus)
- Soft delete via campo `ativo`

---

### 3.3 USUARIO
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| username | VARCHAR(50) | UNIQUE NOT NULL | Login do usuário |
| nome_completo | VARCHAR(150) | NOT NULL | Nome completo |
| email | VARCHAR(150) | UNIQUE NOT NULL | Email institucional |
| cpf | VARCHAR(14) | UNIQUE NOT NULL | CPF do aluno/professor |
| senha | VARCHAR(255) | NULL | Hash bcrypt (NULL para LDAP) |
| role | USER_ROLE | DEFAULT 'STUDENT' | ADMIN, COORDINATOR, STUDENT |
| campus_id | BIGINT | FK → campus.id, NULLABLE | Campus vinculado |
| curso_id | BIGINT | FK → curso.id, NULLABLE | Curso vinculado |
| ativo | BOOLEAN | DEFAULT TRUE | Soft delete |
| criado_em | TIMESTAMP | NOT NULL | Data de criação |
| atualizado_em | TIMESTAMP | NOT NULL | Data de última atualização |

**Restrições:**
- Username único (login)
- Email único (exceção: coordenadores de campi diferentes podem ter emails similares)
- CPF único (11 dígitos)
- Senha pode ser NULL para coordenadores que usam LDAP
- Soft delete via campo `ativo`

**Notas:**
- O CPF do aluno é usado como username no sistema
- Coordenadores são cadastrados manualmente pelo admin

---

### 3.4 PREFERENCIA_ATIVIDADE
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| curso_id | BIGINT | FK → curso.id, NOT NULL | Curso vinculado |
| tipo_atividade | ACTIVITY_TYPE | NOT NULL | Tipo de atividade |
| horas_maximas | INTEGER | DEFAULT 0 | Limite de horas para este tipo |
| descricao | TEXT | NULL | Descrição do tipo |
| ativo | BOOLEAN | DEFAULT TRUE | Soft delete |
| criado_em | TIMESTAMP | NOT NULL | Data de criação |
| atualizado_em | TIMESTAMP | NOT NULL | Data de última atualização |

**Restrições:**
- Combo único (curso_id, tipo_atividade)
- Soft delete via campo `ativo`
- Cada curso pode ter subconjunto dos 7 tipos

---

### 3.5 SOLICITACAO_ATIVIDADE
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| usuario_id | BIGINT | FK → usuario.id, NOT NULL | Aluno que solicitou |
| tipo_atividade | ACTIVITY_TYPE | NOT NULL | Tipo de atividade solicitada |
| status | REQUEST_STATUS | DEFAULT 'PENDING' | Status atual |
| horas_solicitadas | INTEGER | DEFAULT 0 | Horas pedidas pelo aluno |
| horas_aprovadas | INTEGER | DEFAULT 0 | Horas efetivamente aprovadas |
| justificativa | TEXT | NOT NULL | Motivo da solicitação |
| coordenador_notas | TEXT | NULL | Observações do coordenador |
| analisado_por | BIGINT | FK → usuario.id, NULLABLE | Coordenador que analisou |
| analisado_em | TIMESTAMP | NULL | Data da análise |
| solicitacao_anterior_id | BIGINT | FK → solicitacao_atividade.id, NULLABLE | ID da solicitação anterior (para substituição) |
| criado_em | TIMESTAMP | NOT NULL | Data de criação |
| atualizado_em | TIMESTAMP | NOT NULL | Data de última atualização |

**Restrições:**
- Soft delete implícito (usuário ativo é requisito)
- Rejeições geram nova solicitação via `solicitacao_anterior_id`

---

### 3.6 AUDIT_SOLICITACAO
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| solicitacao_id | BIGINT | FK → solicitacao_atividade.id, NOT NULL | Solicitação auditada |
| old_status | REQUEST_STATUS | NULL | Status anterior |
| new_status | REQUEST_STATUS | NULL | Status novo |
| old_horas | INTEGER | NULL | Horas anteriores |
| new_horas | INTEGER | NULL | Horas novas |
| alterado_por | BIGINT | FK → usuario.id, NOT NULL | Usuário que fez a mudança |
| observacao | TEXT | NULL | Observação da mudança |
| enviado_email | BOOLEAN | DEFAULT FALSE | Se email foi enviado |
| criado_em | TIMESTAMP | NOT NULL | Data da mudança |

**Notas:**
- Registro de todas as mudanças de status e horas
- Campo `enviado_email` indica se notificação por email foi enviada

---

### 3.7 DOCUMENTO
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| solicitacao_id | BIGINT | FK → solicitacao_atividade.id, NOT NULL | Solicitação vinculada |
| nome_arquivo | VARCHAR(255) | NOT NULL | Nome técnico do arquivo |
| nome_original | VARCHAR(255) | NOT NULL | Nome original enviado pelo usuário |
| caminho_servidor | VARCHAR(500) | NOT NULL | Path no servidor |
| tamanho_bytes | BIGINT | DEFAULT 0 | Tamanho do arquivo |
| tipo_mime | VARCHAR(100) | NULL | MIME type |
| uploadado_em | TIMESTAMP | NOT NULL | Data do upload |
| uploadado_por | BIGINT | FK → usuario.id, NOT NULL | Usuário que fez upload |

**Notas:**
- Arquivos armazenados localmente no servidor
- Máximo 10MB por arquivo (validação na aplicação)

---

### 3.8 NOTIFICACAO
| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| id | BIGSERIAL | PK | Identificador único |
| usuario_id | BIGINT | FK → usuario.id, NOT NULL | Destinatário |
| titulo | VARCHAR(200) | NOT NULL | Título da notificação |
| mensagem | TEXT | NOT NULL | Corpo da mensagem |
| lido | BOOLEAN | DEFAULT FALSE | Se foi lida |
| tipo | VARCHAR(50) | DEFAULT 'INFO' | Tipo: INFO, SUCESSO, ALERTA |
| criado_em | TIMESTAMP | NOT NULL | Data de criação |

**Notas:**
- Notificações são criadas automaticamente quando emails são enviados
- Podem ser marcadas como lidas pelo usuário

---

## 4. Enums

### USER_ROLE
| Valor | Descrição |
|-------|-----------|
| ADMIN | Administrador do sistema |
| COORDINATOR | Coordenador de curso |
| STUDENT | Aluno |

### ACTIVITY_TYPE
| Valor | Descrição |
|-------|-----------|
| COURSE | Cursos de extensão e livres |
| EVENT | Participação em eventos, congressos, seminários |
| RESEARCH | Projetos de pesquisa científicos |
| MONITORING | Exercício de monitoria acadêmica |
| PUBLICATION | Publicações científicas e artigos |
| EXTENSION | Atividades de extensão comunitária |
| PROFESSIONAL | Experiência profissional na área |

### REQUEST_STATUS
| Valor | Descrição |
|-------|-----------|
| PENDING | Aberta, aguardando análise |
| UNDER_ANALYSIS | Em análise pelo coordenador |
| APPROVED | Aprovada |
| REJECTED | Rejeitada |
| COMPLEMENTATION_REQUESTED | Complementação solicitada |

---

## 5. Relacionamentos

| De | Para | Tipo | Restrição |
|----|------|------|-----------|
| campus | curso | 1:N | ON DELETE RESTRICT |
| curso | usuario | 1:N | ON DELETE SET NULL |
| usuario | solicitacao_atividade | 1:N | ON DELETE CASCADE |
| solicitacao_atividade | documento | 1:N | ON DELETE CASCADE |
| solicitacao_atividade | audit_solicitacao | 1:N | ON DELETE CASCADE |
| solicitacao_atividade | solicitacao_atividade | 1:1 (própria) | ON DELETE SET NULL |
| usuario | notificacao | 1:N | ON DELETE CASCADE |
| usuario | audit_solicitacao | 1:N | ON DELETE RESTRICT |

---

## 6. Índices

### Principais
- `idx_usuario_username` — Busca por login
- `idx_usuario_email` — Busca por email
- `idx_usuario_cpf` — Busca por CPF
- `idx_usuario_role` — Filtro por cargo
- `idx_usuario_campus` — Filtro por campus
- `idx_usuario_curso` — Filtro por curso
- `idx_solicitacao_usuario` — Solicitações do aluno
- `idx_solicitacao_status` — Filtro por status
- `idx_solicitacao_tipo` — Filtro por tipo de atividade
- `idx_audit_solicitacao` — Histórico da solicitação
- `idx_documento_solicitacao` — Documentos da solicitação
- `idx_notificacao_usuario` — Notificações do usuário
- `idx_notificacao_lido` — Notificações não lidas

---

## 7. Decisões de Design

### 7.1 Soft Delete em todas as entidades
Todas as tabelas possuem campo `ativo` (BOOLEAN). Nenhum registro é fisicamente removido, apenas desativado.

### 7.2 CPF como identificador único
O CPF do aluno é usado como username no sistema, garantindo unicidade natural.

### 7.3 Coordenação via FK direta
A tabela `curso` possui `coordenador_id` (não listado acima, será adicionado) referenciando `usuario.id`. Isso simplifica o relacionamento 1:1 entre curso e coordenador.

### 7.4 Auditoria vinculada à solicitação
Toda mudança de status gera um registro em `audit_solicitacao`, permitindo rastreamento completo.

### 7.5 Notificações e emails
O sistema gera notificações internas (`notificacao`) e envia emails (`enviado_email` no audit).

---

## 8. Constraints Adicionais

```sql
-- CPF deve ter 11 dígitos
CONSTRAINT chk_cpf_format CHECK (cpf ~* '^\d{11}$')

-- Email deve ter formato válido
CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
```

---

*Documento gerado automaticamente baseado nos requisitos do TCC*
