# Clear Energy — 3-App Monorepo

A production-quality React Native monorepo built with Expo SDK 52, TypeScript, npm workspaces, React Navigation, TanStack Query, and Axios.

---

## Workspace layout

```
clear-energy/
├── apps/
│   ├── customer/          # "Today's Orders" — GET /orders
│   ├── driver/            # "Today's Trip"   — GET /trips
│   └── admin-mobile/      # "Pending Actions" — GET /pending-actions
└── packages/
    └── shared/
        ├── api/           # Axios client, interceptors, typed endpoint functions
        ├── components/    # OrderCard, LoadingState, EmptyState, ErrorState
        ├── constants/     # Design tokens (colors, spacing, radius, typography)
        ├── hooks/         # useAppQuery — typed TanStack Query wrapper
        ├── types/         # Order, TripStop, PendingAction (mirrors openapi.yaml)
        └── utils/         # formatPrice, formatDate, formatAge
```

---

## Architecture decisions

### npm workspaces over Turborepo

Three apps, one shared package, no CI pipeline yet — Turborepo's task-graph and remote caching aren't worth the configuration overhead at this scale. npm workspaces give us `@clear-energy/shared` resolution and hoisted `node_modules` with zero extra tooling. **Turborepo is the clear next step** the moment we add a fourth app, a real CI matrix, or `tsc --build` across packages.

### Domain-ignorant OrderCard with per-app adapters

`OrderCard` (`packages/shared/components/OrderCard.tsx`) is a presentational primitive: it knows about layout, colour tokens, and press states — not about paise, SLA clocks, or stop sequences. Each app has an **adapter** (`orderToCard.ts`, `stopToCard.ts`, `actionToCard.ts`) that maps the domain type to `OrderCardProps`. This means:

- Shared component never grows `if (mode === 'driver')` branches
- Adding a new app means writing one adapter, not touching shared
- Adapters are the only place business rules live (e.g. "SLA breached when `ageMinutes >= slaMinutes`")

### Strict type separation

The three API schemas look similar but are **different state machines** with incompatible semantics. `Order.status` is a 6-value delivery lifecycle; `TripStop.status` is a 4-value route position; `PendingAction` has no status at all — it uses `priority` + an SLA clock. Using one shared `Status` type would create impossible states. We model them as three completely independent types.

### Money

All amounts stay as integer paise (`number`) in types and in memory. `formatPrice(paise: number): string` is called only at render time. This matches the API contract and prevents floating-point rounding errors (₹0.01 ≠ 1 paise if you divide first).

### API client

`packages/shared/api/client.ts` wraps a single Axios instance with:
- 10 s request timeout
- Request interceptor — injects `Idempotency-Key` on mutating verbs (POST/PUT/PATCH/DELETE) for future-proofing; auth header injection point is stubbed and commented
- Response interceptor — normalises every failure into `ApiError` with a discriminated `kind` field (`'network' | 'timeout' | 'server' | 'client' | 'unknown'`)
- `apiFetch<T>()` generic wrapper that forwards React Query's `AbortSignal` for clean unmount cancellation

Screens never import Axios. They call `fetchOrders()` / `fetchTrips()` / `fetchPendingActions()` and get typed responses or a typed `ApiError`.

### TanStack Query

`useAppQuery` (`packages/shared/hooks/useAppQuery.ts`) sets project-wide defaults:
- `staleTime: 30_000` — list screens feel instant on re-focus without a spinner
- `retry`: 2 retries for `network | server | timeout`; **no retry** for 4xx — retrying a `404` wastes bandwidth and confuses users
- Exponential backoff capped at 8 s

Each screen calls `useQuery` directly (for readability) but with `queryKeys.*` from the shared factory to keep cache invalidation predictable.

### Category grouping (Admin)

`groupByCategory()` in `apps/admin-mobile/src/adapters/actionToCard.ts` converts the flat `PendingAction[]` from the API into `CategoryGroup[]` while preserving the API's sort order (SLA-breach risk) within each group. The SLA breach check (`ageMinutes >= slaMinutes`) lives here — not in shared — because it's admin domain logic.

---

## Setup

### Prerequisites

- Node.js 20+
- npm 9+
- Expo Go app on device/simulator, **or** a local Expo development build

### 1. Start the mock backend

```bash
npx json-server mock-api.json --port 4000
# Verify: curl http://localhost:4000/orders?customerId=c-001
```

### 2. Install dependencies

```bash
cd clear-energy
npm install
```

### 3. Run an app

```bash
# Customer app
cd apps/customer && npx expo start

# Driver app
cd apps/driver && npx expo start

# Admin mobile
cd apps/admin-mobile && npx expo start
```

> **Android emulator note:** change `EXPO_PUBLIC_API_URL` to `http://10.0.2.2:4000` (Android's localhost alias) in an `.env.local` file inside the app directory.

### 4. Run tests

```bash
# From repo root
npm test

# Shared package only
npm run test:shared
```

---

## Trade-offs and known limitations

| Area | Decision | Trade-off |
|---|---|---|
| Navigation | One screen per app, real `Stack.Navigator` wired | Future screens slot in without structural change |
| Auth | Hard-coded `customerId`, `driverId`, `adminId` | Replace with an auth context when real login exists |
| Map | Placeholder `View` in Driver app | A real map (react-native-maps) needs a dev build, not Expo Go |
| Icons | Emoji instead of Lucide/react-native-vector-icons | Avoids native build dependency; swap trivially once build is set up |
| Mutations | No POST/PATCH — API is read-only in this slice | Idempotency-Key interceptor already in place for when they arrive |
| Error boundary | Per-screen `isError` state, no React Error Boundary | Add a top-level boundary for truly unexpected crashes |

---

## Future improvements

1. **Auth context** — replace hard-coded IDs with a `useSession()` hook from a shared auth package
2. **Real map** — `react-native-maps` with polyline route and live driver position via WebSocket
3. **Optimistic updates** — when mutations land, use TanStack Query's `optimisticUpdate` + rollback
4. **Pull-to-refresh** — `FlatList`'s `onRefresh` + `refetch()` is one prop away
5. **Turborepo** — task graph for `build`, `lint`, `test` once CI is wired
6. **react-native-mmkv** — persist the query cache across app restarts (offline support)
7. **Sentry** — plug into the Axios response interceptor (`normaliseError`) with one line
8. **E2E tests** — Maestro flows for the three happy-path screens

---

## AI usage

GitHub Copilot was used for:
- Boilerplate `StyleSheet` entries (spacing arithmetic)
- Initial `Intl.NumberFormat` options lookup for `en-IN` locale

All architecture decisions, type designs, adapter patterns, and the OrderCard prop surface were designed manually before any code was generated.

---

## Actual hours

| Phase | Time |
|---|---|
| Reading all files + architecture design | ~45 min |
| Shared package (types, tokens, API client, components, hooks, utils) | ~90 min |
| Three app screens + adapters + navigation | ~75 min |
| Unit tests | ~20 min |
| README | ~20 min |
| **Total** | **~4.5 hours** |
