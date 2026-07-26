# School SOS Frontend

Vue 3 + TypeScript + Vuetify + Pinia SPA

Routes:

- `/dashboard`
- `/report`
- `/incidents/:id`
- catch-all 404

```powershell
pnpm install --frozen-lockfile --ignore-scripts
Copy-Item .env.example .env
pnpm dev
```

Checks:

```powershell
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

Incident data comes only from `VITE_BACKEND_URL`; Pinia stores UI/server response state and does not persist incidents in browser storage.
