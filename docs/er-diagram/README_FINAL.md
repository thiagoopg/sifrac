# Schema Final — Atividades Complementares IFRS

> Versão: 2.1
> Data: 11/09/2026
> Baseado em: docs/reunioes/teste.md

---

## 📊 Resumo das Alterações

| Item | Antes | Depois |
|------|-------|--------|
| Autenticação | Mista (LDAP + bcrypt) | 100% LDAP (sem senha local) |
| Perfil | INTEGER | ENUM (`ADMINISTRADOR`, `COORDENADOR`, `ALUNO`) |
| Status | 5 valores (inglês) | 4 valores (português) |
| Tipos de Atividade | Enum fixo (7 tipos) | Tabela dinâmica (`tipo_hora_complementar`) |
| Grau do Curso | VARCHAR fixo | Tabela `grau_curso` (admins cadastram) |
| Campus | `codigo`, `endereco` | `sigla`, `cidade`, `uf` |
| Curso | Sem `grau` como FK | FK para `grau_curso` |
| Aluno | Parte da tabela `usuario` | Tabela separada com `matricula` |
| Coordenação | Email fixo | FK `coordenador_id` + email funcional |
| Solicitação | Vinculo com anterior | Sem vinculo (simplificado) |
| Observações | Campo `justificativa` | Campo `justificativa_coordenador` |
| Histórico de Status | Tabela `historico_status_solicitacao` | **Removido** (simplificação) |
| Notificação | Com `tipo` ENUM | Simplificada (sem tipo, só email) |

---

## 🗄️ Entidades

```
campus (1) ──→ (N) curso (1) ──→ (N) tipo_hora_complementar
     │                  │                      │
     │                  │                 (N) anexo_solicitacao
     │                  │                      │
     │                  └──→ (1) grau_curso     │
     │                                    │
     └──→ (N) curso ──→ (1) aluno ──→ (N) solicitacao_hora_complementar
                                       │
                                       └──→ (N) notificacao
                                        
usuario ──→ (N) notificacao
  │
  ├──→ (1) coordenador_id (em curso)
  │
  └──→ (N) solicitacao (como coordenador_id)
```

---

## 📋 Tabelas Principais

### campus
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| nome | VARCHAR(120) | Nome do campus |
| sigla | VARCHAR(10) | Código único (ex: POA) |
| cidade | VARCHAR(80) | Cidade sede |
| uf | CHAR(2) | Estado (ex: RS) |
| ativo | BOOLEAN | Soft delete |
| criado_em | TIMESTAMP | Data de criação |

### grau_curso (nova)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| nome | VARCHAR(50) | Nome do grau (ex: Tecnológico) |
| descricao | TEXT | Descrição do grau |
| ativo | BOOLEAN | Soft delete |
| criado_em | TIMESTAMP | Data de criação |

### usuario
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| nome | VARCHAR(150) | Nome completo |
| email | VARCHAR(150) | Email institucional |
| login_ldap | VARCHAR(100) | Identificador LDAP |
| perfil | ENUM | ADMINISTRADOR/COORDENADOR/ALUNO |
| ativo | BOOLEAN | Soft delete |
| criado_em | TIMESTAMP | Data de criação |

### curso
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| campus_id | BIGINT | FK → campus |
| grau_id | BIGINT | FK → grau_curso |
| nome | VARCHAR(150) | Nome do curso |
| carga_horaria_ac_exigida | INTEGER | Horas totais de AC |
| email_coordenacao | VARCHAR(150) | Email funcional da coordenação |
| coordenador_id | BIGINT | FK → usuario (coordenador do curso) |
| ativo | BOOLEAN | Soft delete |
| criado_em | TIMESTAMP | Data de criação |

### tipo_hora_complementar
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| curso_id | BIGINT | FK → curso |
| nome | VARCHAR(150) | Nome do tipo (ex: "Curso de Extensão") |
| descricao | TEXT | Descrição detalhada |
| carga_horaria_maxima | INTEGER | Limite de horas para este tipo |
| ativo | BOOLEAN | Soft delete |
| criado_em | TIMESTAMP | Data de criação |

### aluno
| Campo | Tipo | Descrição |
|-------|------|-----------|
| usuario_id | BIGINT | PK/FK → usuario |
| curso_id | BIGINT | FK → curso |
| matricula | VARCHAR(30) | RA do aluno (único) |
| criado_em | TIMESTAMP | Data de vinculação |

### solicitacao_hora_complementar
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| aluno_id | BIGINT | FK → aluno |
| tipo_hora_id | BIGINT | FK → tipo_hora_complementar |
| horas_solicitadas | INTEGER | Horas pedidas pelo aluno |
| horas_deferidas | INTEGER | Horas aprovadas pelo coordenador |
| status | ENUM | PENDENTE/DEFERIDO/INDEFERIDO/CANCELADO |
| justificativa_coordenador | TEXT | Observações do coordenador para o aluno |
| coordenador_id | BIGINT | FK → usuario (quem avaliou) |
| data_solicitacao | TIMESTAMP | Quando foi aberta |
| data_avaliacao | TIMESTAMP | Quando foi avaliada |

### anexo_solicitacao
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| solicitacao_id | BIGINT | FK → solicitacao_hora_complementar |
| nome_arquivo | VARCHAR(255) | Nome técnico do arquivo |
| url_arquivo | TEXT | Path no servidor |
| tamanho_bytes | BIGINT | Tamanho do arquivo |
| enviado_em | TIMESTAMP | Data do upload |

### notificacao (simplificada)
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGSERIAL | PK |
| usuario_id | BIGINT | FK → usuario (destinatário) |
| solicitacao_id | BIGINT | FK → solicitacao (opcional) |
| titulo | VARCHAR(200) | Título da notificação |
| mensagem | TEXT | Corpo da mensagem |
| lida | BOOLEAN | Se foi lida pelo usuário |
| enviada_por_email | BOOLEAN | Se email foi enviado |
| criado_em | TIMESTAMP | Data de criação |

---

## 🔑 Índices Criados

| Índice | Tabela | Coluna | Uso |
|--------|--------|--------|-----|
| idx_usuario_login_ldap | usuario | login_ldap | Login LDAP |
| idx_usuario_email | usuario | email | Busca por email |
| idx_usuario_perfil | usuario | perfil | Filtro por cargo |
| idx_curso_campus | curso | campus_id | Listar cursos por campus |
| idx_curso_grau | curso | grau_id | Listar cursos por grau |
| idx_curso_coordenador | curso | coordenador_id | Listar cursos de um coord |
| idx_tipo_hora_curso | tipo_hora_complementar | curso_id | Tipos de um curso |
| idx_aluno_curso | aluno | curso_id | Alunos de um curso |
| idx_aluno_matricula | aluno | matricula | Busca por RA |
| idx_solicitacao_aluno | solicitacao_hora_complementar | aluno_id | Solicitações do aluno |
| idx_solicitacao_status | solicitacao_hora_complementar | status | Filtro por status |
| idx_solicitacao_tipo | solicitacao_hora_complementar | tipo_hora_id | Solicitações por tipo |
| idx_anexo_solicitacao | anexo_solicitacao | solicitacao_id | Anexos de uma solicitação |
| idx_notificacao_usuario | notificacao | usuario_id | Notificações do usuário |
| idx_notificacao_lida | notificacao | (usuario_id, lida) | Notificações não lidas |

---

## 🧪 Dados de Teste (Seed)

### Campi
- Porto Alegre (POA)
- Nova Porto Alegre (NPOA)
- Canoas (CAN)

### Graus de Curso
- Tecnológico
- Licenciatura
- Bacharelado

### Usuários
| Login LDAP | Nome | Perfil | Email |
|------------|------|--------|-------|
| admin | Administrador do Sistema | ADMINISTRADOR | admin@ifrs.edu.br |
| marceloschmitt | Marcelo Augusto Rauh Schmitt | COORDENADOR | marcelo.schmitt@ifrs.edu.br |
| thiagolima | Thiago Adriel Oliveira de Lima | ALUNO | thiago.a.o.lima@gmail.com |
| mariasilva | Maria Silva Santos | ALUNO | maria.silva@ifrs.edu.br |
| joaopedro | João Pedro Costa | ALUNO | joao.costa@ifrs.edu.br |

### Cursos
| Curso | Campus | Grau | Carga Horária | Coordenador |
|-------|--------|------|---------------|-------------|
| TSI | POA | Tecnológico | 180h | marceloschmitt |
| TADS | POA | Tecnológico | 180h | — |
| GTI | POA | Tecnológico | 120h | — |
| RC | NPOA | Tecnológico | 140h | — |

### Tipos de Hora (TSI e TADS)
| Tipo | Max Horas |
|------|-----------|
| Curso de Extensão | 40h |
| Participação em Eventos | 30h |
| Projeto de Pesquisa | 40h |
| Monitoria | 60h |
| Publicação Científica | 20h |
| Extensão Comunitária | 20h |
| Experiência Profissional | 40h |

### Solicitações de Teste
| Aluno | Tipo | Horas | Status | Coordenador Notas |
|-------|------|-------|--------|-------------------|
| Thiago | Curso de Extensão | 40h | DEFERIDO | Curso compatível |
| Thiago | Participação em Evento | 20h | PENDENTE | — |
| Maria | Projeto de Pesquisa | 30h | INDEFERIDO | Documento insuficiente |
| João | Monitoria | 60h | DEFERIDO | Aprovado 40h (parcial) |

---

## 🚀 Como Executar

### PostgreSQL (Produção)
```bash
psql -U postgres -d ac_ifrs -f schema-final-postgres.sql
```

### H2 (Desenvolvimento)
```bash
# No application-dev.properties:
spring.datasource.url=jdbc:h2:mem:tcc_db
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true

# Executar schema-final-h2.sql no console H2: http://localhost:8080/h2-console
```

---

## 📧 Notificação por Email (Spring Boot)

Para envio de email, usar a dependência:

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

Configuração em `application.properties`:
```properties
spring.mail.host=smtp.ifrs.edu.br
spring.mail.port=587
spring.mail.username=seu-email@ifrs.edu.br
spring.mail.password=sua-senha
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

Uso no código:
```java
@Autowired
private JavaMailSender mailSender;

public void enviarEmail(String para, String assunto, String corpo) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(para);
    message.setSubject(assunto);
    message.setText(corpo);
    mailSender.send(message);
}
```

---

*Schema gerado com base nos requisitos consolidados em teste.md*
