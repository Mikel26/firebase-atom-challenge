# 🚀 Guía de Deployment

Esta guía te ayudará a desplegar la aplicación TODO a Firebase (Hosting + Cloud Functions).

## 📋 Requisitos Previos

- ✅ Cuenta de Firebase
- ✅ Firebase CLI instalado (`npm install -g firebase-tools`)
- ✅ Proyecto de Firebase creado
- ✅ Código funcionando localmente

---

## 🔧 Configuración Inicial

### 1. Crear Proyecto en Firebase

```bash
# Ir a: https://console.firebase.google.com
# Click en "Crear proyecto"
# Nombre: atom-challenge-mikel (o el que prefieras)
# Habilitar Google Analytics (opcional)
```

### 2. Inicializar Firebase Localmente

```bash
# Login en Firebase CLI
firebase login

# Vincular proyecto local con proyecto de Firebase
firebase use --add

# Selecciona tu proyecto y dale un alias (ej: production)
```

### 3. Configurar Variables de Entorno

**Backend (`apps/functions/.env`):**

```env
JWT_SECRET=tu-secreto-super-seguro-de-64-caracteres-minimo
ALLOWED_ORIGINS=https://tu-proyecto.web.app,https://tu-proyecto.firebaseapp.com
```

**Frontend (`apps/web/src/environments/environment.prod.ts`):**

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://us-central1-TU-PROYECTO-ID.cloudfunctions.net/api',
};
```

---

## 📦 Deploy Completo

### Opción 1: Deploy Automático (Recomendado)

```bash
# Build + Deploy de todo
pnpm run deploy
```

Este comando hace:

1. Build del frontend (Angular)
2. Build del backend (TypeScript)
3. Deploy de Hosting
4. Deploy de Functions

---

### Opción 2: Deploy Manual Paso a Paso

#### Step 1: Build

```bash
# Build de producción
pnpm run build

# Verificar que existan:
# - apps/web/dist/web/browser/
# - apps/functions/lib/
```

#### Step 2: Deploy Hosting

```bash
# Solo hosting (frontend)
firebase deploy --only hosting

# URL: https://TU-PROYECTO.web.app
```

#### Step 3: Deploy Functions

```bash
# Solo functions (backend)
firebase deploy --only functions

# URL: https://us-central1-TU-PROYECTO.cloudfunctions.net/api
```

---

## 🔐 Secretos y Variables de Entorno

### Configurar en Firebase

```bash
# Establecer secreto de JWT
firebase functions:secrets:set JWT_SECRET

# Establecer origins permitidos
firebase functions:config:set app.allowed_origins="https://tu-app.web.app"
```

### Usar en Cloud Functions

```typescript
// Ya configurado en src/core/auth/jwt.ts
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
```

---

## 🌐 Configurar CORS

Actualiza `apps/functions/src/app.ts` con tu dominio de producción:

```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'https://tu-proyecto.web.app',
      'https://tu-proyecto.firebaseapp.com',
      'http://localhost:4200', // Dev
    ];
```

---

## 🗄️ Firestore Indexes

El proyecto requiere un **índice compuesto**:

### Crear Índice Manualmente

1. Ir a [Firebase Console](https://console.firebase.google.com)
2. Firestore Database → Indexes
3. Crear índice compuesto:
   - Collection: `tasks`
   - Fields:
     - `userId` (Ascending)
     - `createdAt` (Descending)
   - Query scope: Collection

### O Deployar con Firebase

```bash
# Crear archivo firestore.indexes.json
# Ya está incluido en el proyecto

firebase deploy --only firestore:indexes
```

---

## ✅ Verificación Post-Deploy

### 1. Verificar Hosting

```bash
# Abrir en navegador
https://TU-PROYECTO.web.app

# Debería ver la pantalla de login
```

### 2. Verificar Functions

```bash
# Health check
curl https://us-central1-TU-PROYECTO.cloudfunctions.net/api/v1/health

# Debería retornar: {"status":"ok",...}
```

### 3. Probar Flujo Completo

1. Login con email
2. Crear usuario
3. Crear tareas
4. Verificar en Firestore Console que los datos se guardan

---

## 🔄 CI/CD Automático

### GitHub Actions

El proyecto incluye CI/CD configurado en `.github/workflows/ci.yml`:

**Triggers:**

- Push a `main`
- Pull Requests

**Jobs:**

1. Build & Test
2. Deploy (solo en main)

### Configurar Secrets en GitHub

Ve a: `Settings → Secrets and variables → Actions`

Añade:

```
FIREBASE_SERVICE_ACCOUNT
FIREBASE_TOKEN  # Obtener con: firebase login:ci
```

---

## 🐛 Troubleshooting

### Error: "Function deployment failed"

**Solución:**

```bash
# Verificar que el build esté OK
pnpm -C apps/functions build

# Ver logs
firebase functions:log

# Deployar con debug
firebase deploy --only functions --debug
```

### Error: "CORS policy"

**Solución:**

- Verificar ALLOWED_ORIGINS en functions config
- Asegurarse que el dominio de hosting esté en la lista

### Error: "Permission denied"

**Solución:**

```bash
# Re-login en Firebase
firebase login --reauth

# Verificar permisos del proyecto
firebase projects:list
```

---

## 📊 Monitoreo Post-Deploy

### Functions Logs

```bash
# Ver logs en tiempo real
firebase functions:log --follow

# Ver logs de una función específica
firebase functions:log --only api
```

### Firestore Usage

- Firebase Console → Firestore → Usage
- Monitorear reads/writes/deletes
- Configurar alertas si es necesario

---

## 🔄 Rollback

Si algo sale mal:

```bash
# Ver versiones anteriores
firebase functions:list --filter api

# Hacer rollback (no recomendado, mejor fix-forward)
# En su lugar, hacer un hotfix y redeploy
```

---

## 📝 Checklist de Deploy

Antes de hacer deploy a producción:

- [ ] Tests passing (63/63)
- [ ] Lint sin errores
- [ ] Build exitoso
- [ ] Variables de entorno configuradas
- [ ] JWT_SECRET seguro (64+ caracteres)
- [ ] CORS configurado con dominios correctos
- [ ] Firestore indexes creados
- [ ] README actualizado con URLs de producción
- [ ] Probado localmente con emulators

---

## 🎯 Deploy por Primera Vez

```bash
# 1. Crear proyecto en Firebase Console
# 2. Login y vincular
firebase login
firebase use --add

# 3. Configurar secretos
firebase functions:secrets:set JWT_SECRET

# 4. Build
pnpm run build

# 5. Deploy
firebase deploy

# 6. Verificar
curl https://us-central1-TU-PROYECTO.cloudfunctions.net/api/v1/health

# 7. Abrir app
open https://TU-PROYECTO.web.app
```

---

**¡Listo para producción!** 🚀

Para más ayuda, consulta la [documentación oficial de Firebase](https://firebase.google.com/docs/hosting).
