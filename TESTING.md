# 🧪 Guía de Testing y Validación

Esta guía te muestra cómo probar y validar el progreso del proyecto.

---

## 📋 Tabla de Contenidos

1. [Tests Automatizados](#tests-automatizados)
2. [Pruebas Manuales con Emulators](#pruebas-manuales-con-emulators)
3. [Herramientas de Testing](#herramientas-de-testing)
4. [Validación por PR](#validación-por-pr)

---

## 🤖 Tests Automatizados

### Ejecutar todos los tests

```bash
# Todos los tests (functions + web)
pnpm run test

# Con coverage
pnpm -C apps/functions test -- --coverage
```

### Tests por aplicación

```bash
# Solo backend (functions)
pnpm -C apps/functions test

# Solo frontend (web)
pnpm -C apps/web test

# Modo watch (auto-reload)
pnpm -C apps/functions test:watch
```

### Verificar build y lint

```bash
# Build completo
pnpm run build

# Lint
pnpm run lint

# Formateo
pnpm run format:check
```

---

## 🔥 Pruebas Manuales con Emulators

### Paso 1: Iniciar Emulators

```bash
pnpm run emulators
```

Esto iniciará:

- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Hosting**: http://localhost:5002
- **Emulator UI**: http://localhost:4000

### Paso 2: Probar Endpoints

#### Opción A: Script automatizado

```bash
# En otra terminal (con emulators corriendo)
pnpm run test:health
```

Este script:

- ✅ Llama al health endpoint
- ✅ Valida la respuesta
- ✅ Verifica CORS headers
- ✅ Muestra resultado formateado

#### Opción B: Con curl

```bash
# Health endpoint
curl http://localhost:5001/demo-atom-challenge/us-central1/api/api/health

# Con formato JSON bonito (requiere jq)
curl http://localhost:5001/demo-atom-challenge/us-central1/api/api/health | jq

# Test de CORS
curl -H "Origin: http://localhost:4200" \
     -v \
     http://localhost:5001/demo-atom-challenge/us-central1/api/api/health
```

#### Opción C: Con navegador

Abre en tu navegador:

```
http://localhost:5001/demo-atom-challenge/us-central1/api/api/health
```

---

## 🛠️ Herramientas de Testing

### 1. REST Client (VSCode Extension)

**Instalar:**

- Extension ID: `humao.rest-client`

**Usar:**

1. Abre el archivo `test-api.http` (creado en el root)
2. Click en "Send Request" sobre cada endpoint
3. Ve las respuestas en el panel lateral

### 2. Thunder Client (VSCode Extension)

**Instalar:**

- Extension ID: `rangav.vscode-thunder-client`

**Configuración:**

```
Base URL: http://localhost:5001/demo-atom-challenge/us-central1/api
```

### 3. Postman

Importa la colección con estos endpoints:

```
GET  {{baseUrl}}/api/health
GET  {{baseUrl}}/api/nonexistent  (test 404)
```

---

## 📊 Validación por PR

### PR0 - Bootstrap ✅

```bash
# Verificar estructura
ls -la apps/functions/src
ls -la apps/web/src

# Verificar configs
cat firebase.json
cat package.json

# Verificar git hooks
ls -la .husky/
```

**Resultado esperado:**

- ✅ Estructura de monorepo creada
- ✅ Configs (TypeScript, ESLint, Prettier) presentes
- ✅ Firebase configurado
- ✅ Git hooks funcionando

---

### PR1 - Shared + Functions Bootstrap ✅

```bash
# 1. Verificar modelos compartidos
cat packages/shared/src/models.ts
cat packages/shared/src/dto/user.dto.ts

# 2. Build
pnpm run build

# 3. Tests
pnpm run test

# 4. Iniciar emulators
pnpm run emulators

# 5. Probar health endpoint (en otra terminal)
pnpm run test:health
# O con curl:
curl http://localhost:5001/demo-atom-challenge/us-central1/api/api/health
```

**Resultado esperado:**

```json
{
  "status": "ok",
  "message": "TODO API is running",
  "timestamp": "2025-10-21T18:00:00.000Z",
  "version": "1.0.0"
}
```

**Tests esperados:**

- ✅ 5/5 tests passing (functions)
- ✅ 2/2 tests passing (web)
- ✅ Coverage > 85% (lines & statements)

---

### PR2 - Auth + Login (Próximo)

```bash
# Probar endpoints de usuarios
curl -X POST http://localhost:5001/.../api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

curl -X POST http://localhost:5001/.../api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

### PR3 - Tasks CRUD (Próximo)

```bash
# Obtener token primero (de PR2)
TOKEN="eyJhbGc..."

# Listar tasks
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5001/.../api/tasks

# Crear task
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Mi primera tarea"}' \
  http://localhost:5001/.../api/tasks
```

---

## 🐛 Troubleshooting

### Problema: Emulators no inician

**Solución:**

```bash
# Verificar que Firebase CLI esté instalado
firebase --version

# Verificar proyecto
firebase projects:list

# Re-iniciar emulators
pkill -f firebase
pnpm run emulators
```

### Problema: Tests fallan

**Solución:**

```bash
# Limpiar cache
rm -rf node_modules apps/*/node_modules
pnpm run setup

# Re-build
pnpm run build

# Re-run tests
pnpm run test
```

### Problema: Puerto ocupado

**Solución:**

```bash
# Ver qué está usando el puerto 5001
lsof -i :5001

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en firebase.json
```

---

## ✅ Checklist de Validación Completa

Antes de considerar un PR completado, verificar:

```bash
☐ pnpm run build          # Sin errores
☐ pnpm run test           # Todos pasan
☐ pnpm run lint           # Sin errores
☐ pnpm run format:check   # Formateado correcto
☐ pnpm run emulators      # Inician correctamente
☐ pnpm run test:health    # Endpoint responde
☐ Git hooks funcionando   # Commit ejecuta pre-commit
```

---

## 📚 Recursos Adicionales

- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [REST Client VSCode](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

---

## 🎯 Resumen de Tests

```
Backend (Functions): 61 tests passing
Frontend (Web): 2 tests passing
Total: 63 tests passing
Coverage: ≥70% en branches, functions, lines, statements
```

### Tests por Categoría

**Backend:**
- Health endpoint: 5 tests
- JWT utilities: 6 tests  
- Users Service: 12 tests
- Users Controller: 9 tests
- Tasks Service: 16 tests
- Tasks Controller: 15 tests
- Auth Middleware: 5 tests

**Frontend:**
- AppComponent: 2 tests

---

**Última actualización:** PR6 - Documentación Final Completa
