# 🤝 Guía de Contribución

Gracias por tu interés en contribuir al proyecto Firebase Atom Challenge!

## 📋 Tabla de Contenidos

1. [Configuración del Entorno](#configuración-del-entorno)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Workflow de Desarrollo](#workflow-de-desarrollo)
4. [Estándares de Código](#estándares-de-código)
5. [Testing](#testing)
6. [Pull Requests](#pull-requests)

---

## ⚙️ Configuración del Entorno

### Requisitos Previos

- Node.js >= 20.0.0
- PNPM >= 9.0.0
- Firebase CLI
- Git

### Setup Inicial

```bash
# 1. Fork del repositorio
git clone https://github.com/tu-usuario/firebase-atom-challenge.git
cd firebase-atom-challenge

# 2. Instalar dependencias
pnpm run setup

# 3. Configurar git hooks
# (Se configura automáticamente con husky)

# 4. Verificar instalación
pnpm run build
pnpm run test
pnpm run lint
```

---

## 📂 Estructura del Proyecto

```
firebase-atom-challenge/
├── apps/
│   ├── web/              # Angular 17 frontend
│   │   ├── src/app/
│   │   │   ├── core/     # Servicios core (API, Auth)
│   │   │   ├── features/ # Features (Login, Tasks)
│   │   │   └── shared/   # Componentes compartidos
│   │   └── ...
│   └── functions/        # Firebase Functions backend
│       ├── src/
│       │   ├── api/      # Controllers HTTP
│       │   ├── core/     # Services + Repositories (interfaces)
│       │   ├── infra/    # Implementaciones (Firestore)
│       │   ├── middleware/ # Auth middleware
│       │   └── docs/     # OpenAPI documentation
│       └── test/
├── packages/
│   └── shared/           # Tipos y DTOs compartidos
└── ...
```

---

## 🔄 Workflow de Desarrollo

### 1. Crear una Rama

```bash
# Features
git checkout -b feat/nombre-feature

# Fixes
git checkout -b fix/nombre-fix

# Docs
git checkout -b docs/nombre-doc
```

### 2. Desarrollo

```bash
# Levantar emulators (Terminal 1)
pnpm run emulators

# Levantar frontend (Terminal 2)
pnpm -C apps/web start

# Hacer cambios...
```

### 3. Testing

```bash
# Tests antes de commit
pnpm run test
pnpm run lint
pnpm run build
```

### 4. Commit

Seguimos **Conventional Commits**:

```bash
git add .
git commit -m "tipo(scope): descripción breve

Contexto más detallado si es necesario

Cambios:
- Cambio 1
- Cambio 2

Notas:
- Nota importante"
```

**Tipos permitidos:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato (no afecta lógica)
- `refactor`: Refactorización
- `test`: Añadir/modificar tests
- `chore`: Cambios en build, deps, etc.

**Scopes permitidos:**

- `web`, `functions`, `shared`, `ci`, `repo`, `deps`

### 5. Push y PR

```bash
git push origin feat/nombre-feature
# Crear PR en GitHub
```

---

## 📏 Estándares de Código

### TypeScript

- ✅ **Strict mode** obligatorio
- ✅ **Sin `any`** (usar tipos explícitos)
- ✅ Preferir `interface` sobre `type` para objetos
- ✅ Usar `const` por defecto, `let` solo si muta

### Angular

- ✅ **Standalone components** (no módulos)
- ✅ **Signals** y **Observables** (async pipe)
- ✅ **Reactive Forms** (no template-driven)
- ✅ Separar HTML/CSS/TS en archivos dedicados
- ✅ `trackBy` en loops
- ✅ Guards funcionales (no class-based)

### Backend

- ✅ **Repository Pattern** obligatorio
- ✅ Controllers → Services → Repositories
- ✅ No acceso directo a BD desde controllers
- ✅ Validaciones con **Zod**
- ✅ DTOs tipados

### Estilos

- ✅ **ESLint** configurado (no warnings permitidos)
- ✅ **Prettier** para formato automático
- ✅ SCSS con variables y mixins
- ✅ Mobile-first responsive

---

## 🧪 Testing

### Escribir Tests

```bash
# Backend (Jest)
# Crear archivo: src/[feature]/[nombre].test.ts
describe('Feature', () => {
  it('should do something', () => {
    expect(result).toBe(expected);
  });
});

# Frontend (Karma/Jasmine)
# Crear archivo: src/app/[feature]/[component].spec.ts
```

### Ejecutar Tests

```bash
# Todos
pnpm run test

# Solo backend
pnpm -C apps/functions test

# Solo frontend
pnpm -C apps/web test

# Con coverage
pnpm -C apps/functions test -- --coverage
```

### Coverage Mínimo

- Statements: **70%**
- Branches: **70%**
- Functions: **70%**
- Lines: **70%**

---

## 🔍 Pull Requests

### Checklist Antes de Crear PR

- [ ] Tests pasan (`pnpm run test`)
- [ ] Lint sin errores (`pnpm run lint`)
- [ ] Build exitoso (`pnpm run build`)
- [ ] Commits siguen Conventional Commits
- [ ] README actualizado si es necesario
- [ ] Tests añadidos para nuevo código

### Template de PR

Usa el template en `.github/pull_request_template.md`:

```markdown
## Qué y por qué

[Descripción del cambio]

## Cambios clave

- Cambio 1
- Cambio 2

## Evidencia

- [ ] Screenshots/GIF si aplica

## Impacto

- [ ] Cambios en Firestore
- [ ] Nuevas variables de entorno

## Calidad

- [ ] Tests añadidos
- [ ] Docs actualizadas
- [ ] Linters pasan
```

### Code Review

Los PRs requieren:

- ✅ Pasar CI/CD (GitHub Actions)
- ✅ Sin conflictos con `main`
- ✅ Aprobación de reviewer
- ✅ Commits squashed si es necesario

---

## 🐛 Reportar Bugs

Usa GitHub Issues con la siguiente información:

1. **Descripción**: ¿Qué está fallando?
2. **Pasos para reproducir**:
   - Paso 1
   - Paso 2
3. **Comportamiento esperado**
4. **Comportamiento actual**
5. **Screenshots** (si aplica)
6. **Entorno**: OS, Node version, Browser

---

## 💡 Sugerir Features

1. Verifica que no exista ya un Issue similar
2. Describe el caso de uso
3. Propón una solución si tienes una en mente
4. Espera feedback antes de implementar

---

## 📚 Recursos

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [OpenAPI Specification](https://swagger.io/specification/)

---

## 🙏 Gracias

Toda contribución es bienvenida! Si tienes dudas, abre un Issue o contacta al equipo.

---

**Happy Coding!** 🚀
