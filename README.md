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

## Modos de operación

| Modo | Cómo activarlo | Qué se muestra |
|---|---|---|
| `demo` (default) | sin env vars | Los 8 legajos de ejemplo + cualquier legajo creado por API |
| `real` | `HUB_MODE=real` (o `NEXT_PUBLIC_HUB_MODE=real`) | Solo legajos creados vía API/UI; persiste en `data/legajos.json` (en local) o memoria (en serverless) |

Badge visible en la topbar indica el modo actual.

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `HUB_MODE` | `demo` | `demo` o `real`. Determina si la UI muestra los 8 legajos sintéticos. |
| `NEXT_PUBLIC_HUB_MODE` | `demo` | Mismo efecto, expuesto al cliente cuando hace falta. |
| `NEXT_PUBLIC_SHOW_PROMPTS` | `false` | Si `true`, la vista detalle muestra un acordeón con los prompts internos armados para ese legajo (modo debug). |

Crear `.env.local` con:

```
HUB_MODE=real
NEXT_PUBLIC_SHOW_PROMPTS=true
```

## API REST

Todos los endpoints viven bajo `/api`. Devuelven JSON. No requieren auth en el MVP.

### `GET /api/legajos`

Lista todos los legajos visibles en el modo actual.

```bash
curl https://compliance-hub-eight.vercel.app/api/legajos | jq '.count, .legajos[0].id'
```

Respuesta:
```json
{ "mode": "demo", "count": 8, "legajos": [ { "id": "LEG-2026-0418", ... } ] }
```

### `POST /api/legajos`

Crea un legajo. El motor calcula automáticamente `riskBreakdown`, `riskScore`, `riskBand`, `aiAnalysis.recommendation` y `suggestedClientMessage` a partir de los inputs. Si no se envía `documents[]`, se inicializa con la checklist obligatoria/recomendada vacía.

Campos requeridos:
- `clientLegalName`, `taxId`, `countryOfIncorporation`
- `entityScope` (`PSAV` | `PSP` | `MSB`)
- `clientType`, `corporateForm`, `requestedService`
- `primaryContact`, `primaryContactEmail`

Opcionales: `clientCommercialName`, `expectedMonthlyVolume`, `countriesInvolved`, `currenciesInvolved`, `website`, `assignedAnalyst`, `documents[]`, `beneficialOwners[]`, `authorities[]`, `redFlagCodes[]`, `internalNotes[]`, `riskBreakdown` (override manual).

```bash
curl -X POST https://compliance-hub-eight.vercel.app/api/legajos \
  -H "Content-Type: application/json" \
  -d '{
    "clientLegalName": "Sur Capital SAS",
    "taxId": "30-72004118-2",
    "countryOfIncorporation": "Argentina",
    "entityScope": "PSAV",
    "clientType": "fintech",
    "corporateForm": "SAS",
    "requestedService": "Conversión fiat/cripto",
    "expectedMonthlyVolume": "ARS 90M",
    "primaryContact": "Lucía Méndez",
    "primaryContactEmail": "lucia@surcapital.ar",
    "beneficialOwners": [
      { "fullName": "Lucía Méndez", "capitalPercentage": 60, "jurisdiction": "Argentina" },
      { "fullName": "Atlas Holdings Ltd", "capitalPercentage": 40, "jurisdiction": "Bahamas", "indirectVia": "Holding offshore" }
    ],
    "redFlagCodes": ["UBO_OFFSHORE_INDIRECT", "SAS_ARGENTINA"]
  }'
```

Respuesta: `{ "legajo": { "id": "LEG-2026-...", ... } }` con todos los campos calculados.

### `GET /api/legajos/:id`

```bash
curl https://compliance-hub-eight.vercel.app/api/legajos/LEG-2026-0418
```

### `PATCH /api/legajos/:id`

Actualiza campos arbitrarios y reanaliza (re-corre los motores) automáticamente. Solo aplica a legajos creados vía API.

```bash
curl -X PATCH https://compliance-hub-eight.vercel.app/api/legajos/LEG-2026-XXXX \
  -H "Content-Type: application/json" \
  -d '{ "state": "subsanacion_solicitada", "internalNotes": ["Contactado por email"] }'
```

### `POST /api/legajos/:id/analyze`

Re-corre los motores deterministas (`risk-engine`, `checklist-engine`) y devuelve análisis actualizado. Simula latencia de 600ms.

```bash
curl -X POST https://compliance-hub-eight.vercel.app/api/legajos/LEG-2026-XXXX/analyze
```

### `POST /api/legajos/:id/documents`

Registra (o actualiza) documentos del legajo. Triggerea reanálisis automático. Aceptado: `{ document }` (uno) o `{ documents }` (lote). Si no se provee `id`, se hace upsert por `type`.

```bash
curl -X POST https://compliance-hub-eight.vercel.app/api/legajos/LEG-2026-XXXX/documents \
  -H "Content-Type: application/json" \
  -d '{
    "document": {
      "type": "estatuto",
      "label": "Estatuto SAS",
      "filename": "estatuto_sur_capital.pdf",
      "status": "recibido_valido",
      "issueDate": "2024-03-12"
    }
  }'
```

### `DELETE /api/legajos/:id`

Elimina un legajo real (los de demo no se pueden eliminar — siempre vienen del módulo de mock data).

### `POST /api/analyze` (legacy)

Endpoint heredado del prototipo. Toma `{ legajoId }` y devuelve el `aiAnalysis` precomputado. Mantenido por compatibilidad — prefieran `POST /api/legajos/:id/analyze` para datos reales.

## Persistencia

Local: `data/legajos.json` se crea automáticamente cuando se llama al API. Es texto plano, fácil de versionar o backupear.

En Vercel/serverless: el filesystem es read-only, así que la persistencia cae a memoria en el proceso del worker. **Para producción seria, migrar a Vercel KV / Postgres / Supabase** — el contrato del módulo `src/lib/storage.ts` está pensado para hacer drop-in.

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
