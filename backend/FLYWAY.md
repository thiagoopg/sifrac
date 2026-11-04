# Flyway Configuration — Atividades Complementares IFRS

## Versão do Flyway
- **Gerenciado pelo Spring Boot 4.1.1**: Flyway **12.4.0**
- **Driver H2**: 2.4.240 (mais novo que o versionado pelo Flyway, mas funciona)

## Configuração Atual (`application.properties`)
```properties
# Flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
spring.flyway.clean-disabled=false  # Permite DROP ALL em desenvolvimento

# JPA — NUNCA use validate com Flyway!
spring.jpa.hibernate.ddl-auto=none
```

## Por que `ddl-auto=none` e não `validate`?
- `validate` faz Hibernate comparar schema vs entidades a cada startup
- Flyway adiciona colunas extras (ex: `campus_id` em V5)
- Conflito: Hibernate espera schema "limpo", Flyway o modifica
- **Solução**: Flyway gerencia o schema, Hibernate apenas usa

## Migrações Executadas (V1→V6)
| Versão | Arquivo | Descrição |
|--------|---------|-----------|
| V1 | `h2_schema.sql` | Schema H2 (CREATE TABLE, índices) |
| V2 | `seed_data.sql` | Dados iniciais (campi, usuários, cursos) |
| V3 | `add_titulo_solicitacao.sql` | Coluna título na solicitação |
| V4 | `fix_horas_deferidas.sql` | Correção tipo horas deferidas |
| V5 | `add_campus_admin.sql` | Coluna campus_id no usuário |
| V6 | `insert_campus_admin_user.sql` | Insere coordpoa ADMIN_CAMPUS |

## Sintaxe H2 Correta
❌ **Errado**: `INSERT IGNORE INTO ...` (PostgreSQL-only)
❌ **Errado**: `MERGE INTO ...` (syntax complexa, bug em algumas versões)
✅ **Correto**: `UPDATE ... WHERE` + `INSERT ... SELECT ... WHERE NOT EXISTS`

### Exemplo V6 (correto):
```sql
-- Atualiza se existir
UPDATE usuario SET perfil = 'ADMIN_CAMPUS', campus_id = 1 WHERE login_ldap = 'coordpoa';

-- Insere se não existir
INSERT INTO usuario (nome, email, login_ldap, perfil, campus_id)
SELECT 'Coordenador de Campus POA', 'coord.poa@ifrs.edu.br', 'coordpoa', 'ADMIN_CAMPUS', 1
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE login_ldap = 'coordpoa');
```

## Comandos Úteis
```bash
# Ver status Flyway
curl http://localhost:8081/actuator/health

# Reiniciar com DB limpo (dev only)
mvn flyway:clean && mvn spring-boot:run

# Ver logs de migração
grep -i flyway /tmp/backend.log
```

## Logs de Migração
```
FlywayExecutor: Database: jdbc:h2:mem:hcomplementares (H2 2.4)
```

## Perfis de Usuário Testados
| Login | Perfil | Status |
|-------|--------|--------|
| admin | ADMINISTRADOR | ✅ |
| coordpoa | ADMIN_CAMPUS | ✅ |
| marceloschmitt | COORDENADOR | ✅ |
| thiagolima | ALUNO | ✅ |
