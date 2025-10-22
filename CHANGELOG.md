# Changelog

Todos los cambios notables del proyecto están documentados en este archivo.

El formato se basa en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2025-10-22

### ✨ Versión Inicial - Challenge Completado

Primera versión completa de la aplicación TODO con todas las funcionalidades requeridas.

---

## [PR5] - API Documentation - 2025-10-22

### Added

- OpenAPI 3.0 specification completa
- Swagger UI interactivo en `/v1/api-docs`
- Documentación de todos los endpoints (Health, Users, Tasks)
- Archivo `openapi.yaml` exportable
- Sección de API docs en README

### Changed

- Actualizada información de autor en todos los archivos

---

## [PR4] - Frontend UI - 2025-10-22

### Added

- Página de Login con reactive forms y validaciones
- Diálogo de crear usuario (Material Design)
- Página de Tasks con CRUD completo
- TaskItem component con checkbox, edit, delete
- TaskEditor dialog para editar tareas
- ConfirmDialog reutilizable (Material)
- AuthService con manejo de tokens y estado
- ApiClient tipado para todos los endpoints
- Auth Interceptor (JWT automático)
- AuthGuard y loginGuard para routing
- Observables + async pipe en toda la UI
- trackBy function para optimización
- Indicador de conexión en toolbar

### Changed

- Refactorización completa a archivos separados (.html/.scss/.ts)
- Migraci ón de signals a Observables para cumplir requisitos
- Routing inteligente (mantiene sesión en navegación)

### Fixed

- Confirmaciones con Material Dialogs (no alerts nativos)
- Manejo correcto de sesión en rutas raíz y 404

---

## [PR3] - Tasks CRUD - 2025-10-22

### Added

- Tasks Repository (interface + Firestore implementation)
- Tasks Service con lógica de ownership
- Tasks Controller con 4 endpoints (GET, POST, PATCH, DELETE)
- Auth middleware aplicado a rutas protegidas
- 35 tests nuevos (Tasks Service, Controller, Auth Middleware)
- Verificación estricta de ownership (403 Forbidden)

### Changed

- Coverage threshold restaurado a 70% en todos los metrics
- Rutas de API cambiadas de `/api/*` a `/v1/*` para versionado

---

## [PR2] - Authentication - 2025-10-22

### Added

- JWT utilities (sign, verify)
- Auth middleware para Express
- Users Repository (interface + Firestore)
- Users Service con login y create user
- Users Controller con 2 endpoints
- 21 tests nuevos (JWT, Users Service, Controller)
- TypeScript paths con tsc-alias para monorepo

### Fixed

- Módulos compartidos resueltos correctamente en runtime
- Build structure optimizada para emulators

---

## [PR1] - Shared + Functions Bootstrap - 2025-10-21

### Added

- Modelos compartidos (User, Task)
- DTOs con Zod schemas (validación)
- Express app base con middlewares
- Health endpoint (`GET /v1/health`)
- Firestore Admin SDK setup
- 11 tests iniciales
- TESTING.md con guía completa
- Script de test automatizado

---

## [PR0] - Bootstrap & Tooling - 2025-10-21

### Added

- Estructura de monorepo (apps/ + packages/)
- Configuración de TypeScript (strict mode)
- ESLint + Prettier + Husky
- Commitlint con Conventional Commits
- CI/CD con GitHub Actions
- Firebase configuration
- VSCode workspace settings
- Git hooks funcionando

### Fixed

- Emulator ports (5000 → 5002 para hosting)
- Placeholder files para compilación inicial
- Scripts de test configurados para CI headless

---

## Tipos de Cambios

- `Added` - Nueva funcionalidad
- `Changed` - Cambio en funcionalidad existente
- `Deprecated` - Funcionalidad que se eliminará próximamente
- `Removed` - Funcionalidad eliminada
- `Fixed` - Corrección de bug
- `Security` - Corrección de vulnerabilidad

---

**Ver commits completos**: https://github.com/Mikel26/firebase-atom-challenge/commits/main
