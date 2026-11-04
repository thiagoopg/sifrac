# Sistema de Horas Complementares - IFRS

Sistema web para gestão de atividades complementares de cursos do IFRS Campus Restinga.

## 🚀 Início rápido

### Pré-requisitos

- Java 21
- Maven 3.9+
- Node.js 20+
- Docker e Docker Compose

### Instalação

```bash
# 1. Subir SMTP local (Mailpit)
cd backend
docker-compose up -d mailpit

# 2. Rodar o backend
mvn spring-boot:run

# 3. Rodar o frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

## 📖 Documentação

- [Guia de Instalação Completo](docs/INSTALACAO.md)
- [Configuração de E-mail](docs/CONFIGURACAO_EMAIL.md)
- [Solução de Problemas](docs/TROUBLESHOOTING.md)

## 🏗️ Arquitetura

- **Backend**: Spring Boot 4.1.1 + H2 (porta 8081)
- **Frontend**: Vue 3 + Vite + Tailwind (porta 5173)
- **Admin**: Spring Boot Admin (porta 8080)
- **LDAP**: LDAP do IFRS (real)
- **SMTP**: Mailpit para testes (porta 1025/8025)

## 👥 Perfis de usuário

| Perfil | Login teste | Descrição |
|--------|-------------|-----------|
| ADMINISTRADOR | `admin` | Acesso total ao sistema |
| ADMIN_CAMPUS | `coordpoa` | Gerencia solicitações do campus |
| COORDENADOR | `marceloschmitt` | Avalia solicitações do curso |
| ALUNO | `thiagolima` | Submete solicitações |

## 📬 Funcionalidades de e-mail

- **Retorno de avaliação**: Notifica aluno quando solicitação é avaliada
- **Resumo de pendências**: Notifica coordenador quando há novas solicitações

Veja [CONFIGURACAO_EMAIL.md](docs/CONFIGURACAO_EMAIL.md) para detalhes.

## 🔧 Desenvolvimento

```bash
# Backend - rodar testes
cd backend
mvn test

# Frontend - modo desenvolvimento
cd frontend
npm run dev

# Ver e-mails enviados
open http://localhost:8025
```

## 📝 Licença

Este projeto foi desenvolvido como Trabalho de Conclusão de Curso.
