# Perguntas e Respostas — Design do Banco de Dados

> Reunidas em 10/09/2026

---

## 1. Curso do aluno é obrigatório no cadastro?

**Pergunta:** A RF02 diz que o aluno seleciona o curso no registro, mas a RN10 diz que `course_id` é opcional. Qual prevalece?

**Resposta:** O aluno **seleciona o curso manualmente** na tela de registro. O campo `curso_id` é **obrigatório** para alunos (`STUDENT`). A RN10 foi reinterpretada: coordenadores podem não ter curso vinculado inicialmente, mas alunos devem ter.

**Decisão:** `curso_id` é NOT NULL para STUDENT, mas nullable para COORDINATOR e ADMIN.

---

## 2. Como mapear o coordenador do curso?

**Pergunta:** A RN09 diz "cada curso tem um único coordenador". Isso seria FK direta ou tabela separada?

**Resposta:** **FK direta** na tabela `curso`.

```sql
coordenador_id BIGINT REFERENCES usuario(id) ON DELETE SET NULL
```

Isso mantém a relação 1:1 implícita e simplifica consultas.

---

## 3. Student ID — o que é?

**Pergunta:** A entidade User mostra `studentId`. É o RA/matrícula?

**Resposta:** O **CPF do aluno** é usado como identificador único (e como username no sistema). Não há campo separado de RA/matrícula.

**Decisão:** Remover `studentId` da entidade. O `cpf` já garante unicidade e serve como login.

---

## 4. Email único global ou por cargo?

**Pergunta:** O email deve ser único em todo o sistema?

**Resposta:** **Email único global** com exceção para coordenadores de campi diferentes.

**Decisão:** Mantiver UNIQUE constraint no email. Na prática, coordenadores terão emails institucionais diferentes por campus.

---

## 5. Documentos — onde são armazenados?

**Pergunta:** O campo `filePath` sugere filesystem. Onde os arquivos ficam?

**Resposta:** **Armazenamento local no servidor**, dentro do diretório do projeto.

```
uploads/
  documentos/
    <solicitacao_id>/<filename>
```

**Decisão:** Usar caminho relativo ao projeto. Em produção, pode ser ajustado para storage externo (S3).

---

## 6. Auditoria — o que exatamente é rastreado?

**Pergunta:** A RF09 menciona mudanças de status/horas. Mas adições de documentos e alterações de observações também geram registro?

**Resposta:** Apenas **mudanças de status e horas**. Alterações de documentos e observações não geram registro de auditoria.

**Decisão:** Tabela `audit_solicitacao` registra apenas:
- `old_status` → `new_status`
- `old_horas` → `new_horas`
- `enviado_email` (boolean)

---

## 7. Status `COMPLEMENTATION_REQUESTED` existe?

**Pergunta:** O enum lista 5 status, incluindo `COMPLEMENTATION_REQUESTED`. Esse status é distinto de `UNDER_ANALYSIS`?

**Resposta:** **Não foi definido claramente.** Pode ser:
- Um sub-estado de `UNDER_ANALYSIS`
- Um status intermediário antes de `APPROVED` ou `REJECTED`

**Decisão (provisória):** Manter no enum, mas implementar como transição:
```
PENDING → UNDER_ANALYSIS → COMPLEMENTATION_REQUESTED → UNDER_ANALYSIS → APPROVED/REJECTED
```

---

## 8. Predefinição de tipos de atividade por curso?

**Pergunta:** Todo curso precisa ter os 7 tipos configurados?

**Resposta:** **Não.** Cada curso configura apenas os tipos que se aplicam.

**Decisão:** Tabela `preferencia_atividade` permite qualquer subconjunto dos 7 tipos por curso.

---

## 9. Soft delete — quais entidades?

**Pergunta:** Usuários têm `active = false`. Campi e Cursos têm `DELETE`. Eles usam soft delete?

**Resposta:** **Todas as entidades usam soft delete** (campo `ativo` BOOLEAN).

**Decisão:** Nenhum registro é fisicamente removido. A consulta sempre filtra `WHERE ativo = true`.

---

## 10. Notificações — trigger automático?

**Pergunta:** O sistema cria notificações automaticamente via trigger ou o service gera manualmente?

**Resposta:** **Envio de emails** é feito via service, não trigger. As notificações internas são criadas junto com o email.

**Decisão:** Service `NotificationService` é chamado explicitamente após análise da solicitação.

---

## Resumo das Decisões

| # | Pergunta | Decisão |
|---|----------|---------|
| 1 | Curso obrigatório? | Sim para STUDENT, nullable para outros |
| 2 | Coordenação? | FK direta `curso.coordenador_id` |
| 3 | Student ID? | CPF como identificador (sem campo extra) |
| 4 | Email único? | Global, sem exceções |
| 5 | Documentos? | Local no servidor |
| 6 | Auditoria? | Apenas status e horas |
| 7 | Complementation? | Manter no enum, status intermediário |
| 8 | Tipos por curso? | Subconjunto flexível |
| 9 | Soft delete? | Todas as entidades |
| 10 | Notificações? | Service manual, não trigger |

---

*Documento gerado automaticamente*
