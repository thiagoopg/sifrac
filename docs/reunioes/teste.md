# Especificação do Sistema — Atividades Complementares IFRS

> Documento gerado como base para o desenvolvimento do TCC.
> Contém requisitos, regras de negócio e decisões técnicas consolidadas.

---

## 1. Contexto do Problema

O IFRS — Campus Porto Alegre (e demais campi) gerencia as **Atividades Complementares** de forma manual:
- Aluno abre processo via SIPAC, mas **não acompanha o andamento**.
- Envio de documentos só é possível no início; o aluno não consegue incluir novos documentos depois.
- Coordenação usa planilhas compartilhadas para controle de horas.
- Comunicação entre aluno e coordenador é feita por e-mail.
- Existia um trabalho anterior (PWAC-IFRS, Bernardoni 2023), mas **não está disponível publicamente** e não atendia todas as necessidades.

**Objetivo do TCC**: desenvolver uma plataforma web que permita ao aluno solicitar certificação de atividades complementares, acompanhar o andamento em tempo real, enviar documentos a qualquer momento, e ao coordenador analisar, deferir/indeferir e controlar a carga horária aproveitada por tipo e por curso.

---

## 2. Atores do Sistema

| Ator | Papel | Descrição |
|------|-------|-----------|
| **Administrador** | `ADMINISTRADOR` | Cadastra campi, cursos, tipos de hora complementar e usuários. Acesso a todas as telas. |
| **Coordenador** | `COORDENADOR` | Avalia solicitações do curso que coordena. Vê horas aproveitadas por aluno. Único coordenador por curso. |
| **Aluno** | `ALUNO` | Abre solicitações, anexa documentos, acompanha status, pode cancelar pedidos pendentes. |

Todos os perfis autenticam pelo mesmo servidor **LDAP institucional do IFRS**.

---

## 3. Autenticação

- Login **sempre via LDAP** — Administrador, Coordenador e Aluno usam o mesmo servidor.
- Não existe senha local armazenada no banco em nenhuma tabela.
- `usuario.login_ldap` guarda o identificador usado no bind com o diretório.
- Como o LDAP não fornece dados de perfil, essas informações são mantidas localmente:
  - **Aluno**: preenche nome, e-mail e **escolhe o curso manualmente** no cadastro — não há sincronização automática de curso vinda do LDAP.
  - **Coordenador**: cadastrado manualmente pelo Administrador, já vinculado a um curso.
- Nenhuma senha ou parâmetro de configuração do LDAP (bind DN, etc.) deve estar hardcoded no código-fonte — usar variáveis de ambiente.

Obs: perguntei pro timóteo essa questão
---

## 4. Requisitos Funcionais

### RF01 — Autenticação
- Login via LDAP institucional para todos os perfis.
- Backend recebe apenas sucesso/falha da validação; 

Obs: perfil e vínculo com curso são geridos localmente, perguntei pro professor essa questão.

### RF02 — Cadastro de Aluno
- Aluno se cadastra informando: login LDAP, nome, e-mail e **curso** (seleção manual).
- Curso está vinculado a um campus.
- Após cadastro, `ativo = true`.

### RF03 — Gerenciamento de Campi (Administrador)
- CRUD de campi: nome, sigla, cidade, UF.

### RF04 — Gerenciamento de Cursos (Administrador)
- CRUD de cursos: nome, campus vinculado, grau, carga horária total de AC exigida, e-mail de coordenação (conta funcional fixa), coordenador vinculado.
- Um campus pode ter múltiplos cursos.
- Cada curso tem **um único coordenador** vinculado.

### RF05 — Tipos de Hora Complementar por Curso
- Cada curso define seu **próprio conjunto de tipos** de hora complementar (nome, descrição e teto de horas livres) — **não é uma lista fixa/enum**, permitindo qualquer curso criar tipos específicos sem alteração de código.
- Podem ser criados/editados por **Administrador ou Coordenador do curso**.
- Cada tipo pode ter um teto de horas aproveitáveis (`carga_horaria_maxima`), opcional.

### RF06 — Solicitação de Horas Complementares (Aluno)
- Aluno abre uma solicitação escolhendo um tipo de hora complementar do seu curso.
- Informa quantas horas deseja aplicar.
- Anexa um ou mais documentos comprobatórios.
- Status inicial: `PENDENTE`.
- Sistema calcula automaticamente quanto já foi aproveitado daquele tipo e do total do curso, para permitir bloqueios (ver seção 5).

### RF07 — Acompanhamento de Solicitação (Aluno)
- Aluno vê lista das suas solicitações com status.
- Vê detalhes: horas solicitadas, horas deferidas, justificativa do coordenador.
- Pode **anexar novos documentos a qualquer momento** enquanto a solicitação estiver `PENDENTE`.
- Pode **cancelar** (não editar) uma solicitação enquanto `PENDENTE` — vira status `CANCELADO`, sem exclusão do registro.
- Se a solicitação for `INDEFERIDA`, pode abrir uma nova solicitação para o mesmo tipo, vinculada à anterior.

### RF08 — Avaliação de Solicitação (Coordenador)
- Coordenador vê as solicitações do(s) curso(s) que coordena.
- Pode **deferir** (total ou parcialmente, informando quantas horas aprova) ou **indeferir**, com justificativa.
- Pode **reabrir/corrigir** uma decisão já registrada — a correção atualiza o mesmo registro (não cria um novo).
- Sistema atualiza automaticamente a carga horária aproveitada do aluno.

### RF09 — Auditoria
- Toda mudança de status (inclusive reaberturas de decisão) gera um registro de histórico com: solicitação, status anterior, status novo, horas deferidas no momento, quem alterou, observação e data/hora.
- Coordenador e Administrador podem consultar o histórico completo de qualquer solicitação.

### RF10 — Notificações
- Notificação disparada para o Coordenador quando uma nova solicitação é aberta no seu curso.
- Notificação disparada para o Aluno quando o status da sua solicitação muda.
- Notificações ficam na plataforma, podem ser marcadas como lidas.

### RF11 — Gerenciamento de Usuários (Administrador)
- Listar, ativar/desativar usuários.
- Cadastrar coordenadores vinculados a um curso.

---

## 5. Regras de Negócio

| # | Regra |
|---|-------|
| RN01 | Aluno só pode solicitar horas de tipos pertencentes ao curso em que está matriculado. |
| RN02 | Coordenador só vê e avalia solicitações do(s) curso(s) que coordena. |
| RN03 | Administrador vê todos os campi, cursos e solicitações. |
| RN04 | Ao atingir o teto de horas (`carga_horaria_maxima`) de um **tipo específico**, o sistema bloqueia novas solicitações daquele tipo para o aluno. |
| RN05 | Ao atingir a carga horária total exigida do **curso** (soma de horas deferidas do aluno), o sistema bloqueia **qualquer** nova solicitação, independente do tipo. |
| RN06 | Aluno pode **cancelar** (não editar) uma solicitação enquanto `PENDENTE`; o registro permanece com status `CANCELADO`. |
| RN07 | Se `INDEFERIDA`, o aluno pode reenviar uma nova solicitação para o mesmo tipo; o novo registro fica vinculado à tentativa anterior. |
| RN08 | Documentos podem ser anexados a qualquer momento enquanto a solicitação estiver `PENDENTE` — múltiplos anexos por solicitação são permitidos, sem restrição de tipo/tamanho definida por ora. |
| RN09 | Apenas o Coordenador do curso do aluno pode avaliar (deferir/indeferir) suas solicitações — sem delegação ao Administrador. |
| RN10 | Coordenador pode reabrir/corrigir uma decisão já registrada; a correção atualiza o registro existente (não cria um novo) e é auditada no histórico. |
| RN11 | Cada curso tem um único coordenador vinculado (`curso.coordenador_id`); trocar de coordenador é uma simples atualização desse vínculo, sem histórico de mandatos. |
| RN12 | Cada curso tem um e-mail de coordenação **funcional e fixo**, independente de quem ocupa o cargo. |
| RN13 | Tipos de hora complementar podem ser criados/editados por Administrador ou pelo Coordenador do curso, sem necessidade de registrar autoria. |
| RN14 | Não há prazo ou janela específica para envio de solicitações — o aluno pode solicitar a qualquer momento durante o curso. |
| RN15 | Autenticação é sempre via LDAP institucional; nenhuma senha é armazenada localmente. |
| RN16 | Como o LDAP não retorna dados de perfil, nome/e-mail/curso do aluno são definidos no cadastro local, não sincronizados automaticamente. |

---

## 6. Status da Solicitação (fluxo simples)

| Valor | Significado |
|-------|------------|
| `PENDENTE` | Aberta, aguardando avaliação do coordenador. |
| `DEFERIDO` | Aprovada — total ou parcialmente (horas deferidas podem ser menores que as solicitadas). |
| `INDEFERIDO` | Reprovada. |
| `CANCELADO` | Cancelada pelo próprio aluno enquanto ainda estava pendente. |

---

## 7. Modelo de Dados (Entidades — visão lógica)

### Campus
```
id, nome, cidade, uf, criado_em
```

### Usuario
```
id, nome, email, login_ldap (único), perfil (ALUNO/COORDENADOR/ADMINISTRADOR),
ativo, criado_em
```

### Curso
```
id, campus_id (FK), nome, grau, carga_horaria_ac_exigida,
email_coordenacao (único, funcional/fixo), coordenador_id (FK → Usuario, nullable),
ativo, criado_em
```

### TipoHoraComplementar
```
id, curso_id (FK), nome, descricao, carga_horaria_maxima (nullable),
ativo, criado_em
```

### Aluno
```
usuario_id (PK/FK → Usuario), curso_id (FK), matricula (único)
```

### SolicitacaoHoraComplementar
```
id, aluno_id (FK), tipo_hora_id (FK), horas_solicitadas, horas_deferidas (nullable),
status (PENDENTE/DEFERIDO/INDEFERIDO/CANCELADO), justificativa_coordenador,
coordenador_id (FK → Usuario, nullable), solicitacao_anterior_id (FK → própria tabela, nullable),
data_solicitacao, data_avaliacao (nullable)
```

### AnexoSolicitacao
```
id, solicitacao_id (FK), nome_arquivo, url_arquivo, tamanho_bytes (nullable), enviado_em
```

### HistoricoStatusSolicitacao
```
id, solicitacao_id (FK), status_anterior (nullable), status_novo, horas_deferidas (snapshot),
alterado_por (FK → Usuario), observacao, alterado_em
```

### Notificacao
```
id, usuario_id (FK, destinatário), solicitacao_id (FK, nullable),
tipo (NOVA_SOLICITACAO/MUDANCA_STATUS/GERAL), mensagem, lida, enviada_por_email, criado_em
```

---

## 8. Critérios de Sucesso (TCC)

1. Aluno consegue abrir solicitação e acompanhar o andamento em tempo real.
2. Aluno consegue anexar documentos a qualquer momento enquanto a solicitação estiver pendente.
3. Coordenador consegue avaliar (deferir/indeferir, inclusive parcialmente) com registro de auditoria.
4. Sistema bloqueia automaticamente novas solicitações ao atingir o teto de um tipo ou o total exigido do curso.
5. Usuário desativado não consegue mais fazer login.
6. Suporte a múltiplos campi e cursos, cada um com seu próprio conjunto de tipos de hora complementar.
7. Login funcional via LDAP institucional para todos os perfis.
8. Histórico completo de mudanças de status disponível para consulta.

---

## 9. Pontos em Aberto (para validar com o orientador)

- Restrições de tipo/tamanho de arquivo nos anexos (hoje sem limite definido).
- Se o Administrador deve poder consultar/gerar relatórios agregados por campus (fora do escopo definido até aqui).