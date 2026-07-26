# School SOS Deployment Plan

Production target คือ Cloudflare Workers (`school-sos-backend`) + D1 (`school-sos-db`) + Cloudflare Pages ไม่มี KV, Lambda หรือ AI secret

## Required secrets

| GitHub Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Deploy Workers, D1 และ Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account |
| `D1_DATABASE_ID` | Production `school-sos-db` |
| `PAGES_PROJECT_NAME` | Pages project |
| `VITE_BACKEND_URL` | Public Worker URL สำหรับ frontend build |

## First-time setup

```powershell
cd backend
npx wrangler login
npx wrangler d1 create school-sos-db
Copy-Item wrangler.example.jsonc wrangler.jsonc
```

แทน `<REPLACE_WITH_D1_DATABASE_ID>` ใน `wrangler.jsonc` ซึ่งถูก ignore และตั้ง `ALLOWED_ORIGINS` เป็น Pages origin จริง

## Pre-deploy gate

```powershell
cd backend
npm ci
npm test
npm run typecheck
npm run build

cd ..\frontend
pnpm install --frozen-lockfile --ignore-scripts
pnpm test
pnpm lint
pnpm typecheck
pnpm build
```

## Manual deploy

```powershell
cd backend
npm run db:migrate:remote
npm run deploy

cd ..\frontend
$env:VITE_BACKEND_URL = "https://<worker>.workers.dev"
pnpm build
npx wrangler pages deploy dist --project-name=<PAGES_PROJECT_NAME> --branch=main
```

Seed เป็น local/demo utility และห้ามรันอัตโนมัติใน production

## CI

Pull request รัน tests, lint, typecheck และ build ทั้งสองแอป Push ไป `main` จะ inject D1 ID ใน temporary Wrangler config, migrate D1 ก่อน deploy Worker แล้ว deploy artifact frontend ไป Pages

รอบนี้ไม่ได้ deploy production เพราะยังไม่มี resource IDs, token, Pages project และ public backend URL ที่ผู้ใช้ยืนยัน
