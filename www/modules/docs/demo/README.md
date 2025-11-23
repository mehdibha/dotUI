# Demo module (next-gen)

- `ComponentDemo` is the opt-in entry point that uses the modular `DemoShell`.
- Legacy docs still rely on `www/modules/docs/demo.tsx`; keep it untouched until you migrate callers.
- `load-demo-payload.server.tsx` centralizes registry/file lookups so both shells can share data.
- Controls logic lives in `hooks/use-demo-controls.ts`; UI pieces sit inside `components/`.
- Import via `import { ComponentDemo } from "@/modules/docs/demo"` when you are ready to adopt the new structure.
