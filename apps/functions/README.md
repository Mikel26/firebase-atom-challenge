# ⚡ Firebase Functions (Backend API)

Backend de la aplicación TODO con Cloud Functions v2 + Express.

## Stack

- **Firebase Cloud Functions v2**
- **Express.js** (API REST)
- **TypeScript** (strict mode)
- **Zod** (validación de schemas)
- **Firestore** (base de datos)
- **JWT** (autenticación)

## Estructura

```
apps/functions/src/
├── index.ts              # Export de Cloud Functions
├── app.ts                # Express app principal
├── api/                  # Controllers (users, tasks)
├── core/
│   ├── domain/           # Entities (de @atom-challenge/shared)
│   ├── dto/              # DTOs y schemas Zod
│   ├── services/         # Lógica de negocio
│   └── repositories/     # Interfaces de repos
├── infra/
│   ├── firestore.ts      # Admin SDK + converters
│   └── repositories/     # Implementaciones Firestore
└── middleware/
    ├── auth.ts           # JWT verification
    └── error.ts          # Error handling
```

## Endpoints (cuando estén implementados)

```
POST   /api/users/login        - Login por email
POST   /api/users              - Crear usuario
GET    /api/tasks              - Listar tasks del usuario
POST   /api/tasks              - Crear task
PATCH  /api/tasks/:id          - Actualizar task
DELETE /api/tasks/:id          - Eliminar task
```

## Scripts

```bash
pnpm run build          # Compilar TypeScript
pnpm run serve          # Emuladores locales
pnpm run lint           # ESLint
pnpm run test           # Jest tests
pnpm run deploy         # Deploy a Firebase
```

## Implementación

La implementación comenzará en:
- **PR1**: Bootstrap + Health endpoint
- **PR2**: Auth (JWT + users endpoints)
- **PR3**: Tasks CRUD completo

