# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-campus/login.spec.ts >> ADMIN_CAMPUS — Permissões e navegação >> não deve conseguir acessar Campus diretamente
- Location: tests/admin-campus/login.spec.ts:32:3

# Error details

```
Error: Channel closed
```

```
Error: page.goto: net::ERR_ABORTED at http://localhost:5173/campus
Call log:
  - navigating to "http://localhost:5173/campus", waiting until "load"

```

```
Error: browserContext.close: Target page, context or browser has been closed
```