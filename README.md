# Compliance Hub

Dashboard interno de compliance para tres entidades reguladas relacionadas: **Eluter SA** (PSAV/AR), **ArgyPay SA** (PSP/AR) y **ADBLIDAI LLC** (MSB/US). Permite a un Oficial de Cumplimiento revisar legajos de onboarding corporativo: documentos, beneficiarios finales, red flags y scoring de riesgo, con motor determinista alineado a los manuales internos de cada entidad.

MVP funcional, sin LLM real ni base de datos. La lógica de scoring y la matriz de checklist son reales; los datos de clientes son mock.

## Stack

- Next.js 15 (App Router) · TypeScript estricto
- Tailwind CSS v3 con sistema de design tokens propio (paleta financiera-sobria)
- Geist Sans + Geist Mono via `next/font/google`
- `lucide-react` para iconografía
- Componentes UI propios (sin shadcn, sin Radix)
- Mock data in-memory; sin DB, sin auth

## Correr local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/
│   ├── layout.tsx              · sidebar + topbar + Geist fonts
│   ├── globals.css             · design tokens (paleta)
│   ├── page.tsx                · dashboard ejecutivo
│   ├── legajos/
│   │   ├── page.tsx            · lista con filtros
│   │   ├── nuevo/page.tsx      · alta de legajo
│   │   └── [id]/page.tsx       · vista detalle (la pantalla principal)
│   └── api/analyze/route.ts    · stub IA (devuelve aiAnalysis precomputado)
├── components/
│   ├── ui/                     · Button, Card, Badge, Pill, RiskGauge
│   ├── layout/                 · Sidebar, Topbar
│   ├── dashboard/              · KpiStrip, QueueTable, EntityDistribution
│   ├── legajos/                · LegajoHeader, DocumentList, RedFlagsList, …
│   └── nuevo/                  · NewLegajoForm
└── lib/
    ├── types.ts                · dominio completo
    ├── risk-engine.ts          · 10 dimensiones, override por reglas duras
    ├── checklist-engine.ts     · matrices PSAV-AR/US, PSP-AR, MSB-US
    ├── red-flags-library.ts    · catálogo de ~18 red flags con manualReference
    ├── ai-prompts.ts           · 5 templates de prompts (classification, extraction, cross-validation, red-flags, client message)
    ├── mock-data.ts            · 8 legajos completos
    ├── format.ts               · fechas, CUIT, etc.
    └── utils.ts                · cn helper
```

## Qué es real, qué está mockeado

| Componente | Estado |
|---|---|
| Motor de scoring de riesgo (`risk-engine.ts`) | **Real** — función pura determinista, 10 dimensiones, pesos del manual, override automático a `critico` por OFAC / documentación falsificada / actividad prohibida |
| Motor de checklist (`checklist-engine.ts`) | **Real** — devuelve la matriz documental obligatoria/recomendada por combinación entidad × país × servicio |
| Biblioteca de red flags (`red-flags-library.ts`) | **Real** — catálogo con código, nivel, descripción, referencia al manual |
| Prompts internos (`ai-prompts.ts`) | **Reales como strings** — listos para enchufar a un LLM, no se ejecutan ahora |
| 8 legajos de ejemplo (`mock-data.ts`) | **Mock** — datos sintéticos coherentes con los manuales (UBO 10% / 25% según entidad) |
| API `/api/analyze` | **Stub** — devuelve `aiAnalysis` precomputado con latencia simulada de 800 ms |
| Persistencia | **In-memory** — las ediciones no persisten |
| Autenticación | **Ausente** — demo interna |

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SHOW_PROMPTS` | `false` | Si `true`, en la vista detalle aparece un acordeón con los prompts internos armados para ese legajo (modo debug). |

Crear `.env.local` con:

```
NEXT_PUBLIC_SHOW_PROMPTS=true
```

## Cómo extender

**Agregar una entidad regulada:** sumar el literal al tipo `EntityScope` en `types.ts`, extender el peso `crypto` o agregar dimensiones en `risk-engine.ts` si aplica, y agregar la matriz en `checklist-engine.ts`.

**Agregar un red flag:** sumarlo al diccionario en `red-flags-library.ts` con su `manualReference`. Para que dispare en algún legajo, agregarlo manualmente al array `redFlags` del legajo correspondiente (o, cuando se enchufe el LLM, dejarlo que lo sugiera el motor).

**Enchufar un LLM real:** en `src/app/api/analyze/route.ts`, reemplazar la lectura del mock por una llamada al SDK (Anthropic / OpenAI / etc.). Los prompts ya están construidos en `ai-prompts.ts` — basta importar `buildPrompt(legajo)` del template que corresponda, enviar y parsear la respuesta JSON.

## Roadmap fase 2

- OCR real de documentos (con verificación de firma y detección de adulteraciones).
- Screening live OFAC SDN + listas ONU/RePET + GAFI gris.
- Autenticación con roles (Analista / Oficial / Director).
- Persistencia (Postgres + Prisma) y monitoreo continuo post-onboarding.
- Drag & drop de documentos con preview.
- Tabs restantes en la vista detalle (Documentos / Checklist / Sociedad & UBO / Red flags / Historial).
- Modo oscuro completo.

## Decisiones explícitas (§16 del brief)

No se incluyeron: LLM real, autenticación, base de datos, shadcn/Radix, framer-motion, tests unitarios, i18n, upload real, animaciones complejas, modo oscuro a medias, splash screens o onboarding tours.

## Deploy

Cualquier host de Next.js standard. Recomendado Vercel: importar el repo en [vercel.com/new](https://vercel.com/new) y aceptar los defaults (no requiere variables de entorno para funcionar — solo si se quiere activar el modo debug de prompts).
