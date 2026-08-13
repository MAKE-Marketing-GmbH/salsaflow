---
name: Salsa Flow Verify Commands
status: locked
date: 2026-07-01
---

# VERIFY_COMMANDS

## Schnell

```bash
npm run typecheck
npm run build
npm run verify:umlaut
npm run verify:public
```

## Fullstack lokal

```bash
npm run setup
npm run dev
```

Danach:

```bash
node scripts/ui-smoke-public.cjs
node scripts/ui-smoke-courses.cjs
# Reservierungs-Flow (13.08.2026): Origin des laufenden Vite-Servers mitgeben.
SMOKE_ORIGIN=http://127.0.0.1:5174 node scripts/ui-smoke-booking.cjs
node scripts/ui-smoke-contact.cjs
```

## Gates

```bash
node /Users/raphaelhund/.claude/skills/react-webdesign/scripts/react-webdesign-gate.mjs /Users/raphaelhund/code/projects/salsaflow-dc
node /Users/raphaelhund/.claude/skills/next-ai-webbuilder-pro/scripts/next-build-gate.mjs --workspace /Users/raphaelhund/code/projects/salsaflow-dc --strict --components --visual
```
