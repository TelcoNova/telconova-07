# TelcoNova - Sistema de Asignaciones

Sistema de gestión de asignaciones técnicas siguiendo principios SOLID y Clean Architecture.

## 🚀 Características

- **Autenticación segura** con bloqueo de cuenta tras intentos fallidos
- **Gestión de órdenes** con separación entre pendientes y asignadas
- **Selección inteligente de técnicos** con filtros avanzados
- **Asignación/Reasignación** con capacidad de deshacer
- **Modo oscuro/claro** persistente
- **Arquitectura escalable** con principios SOLID
- **Responsive design** mobile-first
- **Accesibilidad** completa (WCAG AA)

## 🏗️ Arquitectura

### Clean Architecture + SOLID Principles

```
src/
├── components/          # UI Components (React)
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   ├── orders/         # Order-specific components
│   └── technicians/    # Technician-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # Business logic layer
│   ├── api/           # API client and configuration
│   ├── auth/          # Authentication service
│   └── repositories/  # Data access layer
├── store/              # Global state management (Zustand)
├── models/             # TypeScript interfaces and types
└── assets/            # Static assets
```

### Patrones Implementados

- **Repository Pattern**: Encapsula el acceso a datos
- **Factory Pattern**: Creación de clientes API
- **Strategy Pattern**: Filtros dinámicos
- **Command Pattern**: Acciones de asignación con deshacer
- **Observer Pattern**: Estado global reactivo
- **Composition Pattern**: Componentes reutilizables

## 🛠️ Tecnologías

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, shadcn/ui, Lucide React
- **Estado**: Zustand
- **Consultas**: TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library (configurado)

## 📦 Instalación

### Prerrequisitos

- Node.js >= 16
- npm o yarn

### Desarrollo Local

```bash
# Clonar repositorio
git clone https://github.com/R1A2H1L1/EV10P7F2.git
cd EV10P7F2

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de Entorno

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api  # URL del backend Java
VITE_NODE_ENV=development
```

## 🔧 Comandos

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo (puerto 8080)
npm run build           # Build para producción
npm run preview         # Preview del build
npm run type-check      # Verificación de tipos TypeScript

# Testing
npm run test            # Ejecutar tests
npm run test:watch      # Tests en modo watch
npm run test:coverage   # Tests con coverage

# Linting y Formato
npm run lint            # ESLint
npm run lint:fix        # Corregir errores de lint automáticamente
```

## 🔐 Credenciales de Prueba

```
Email: supervisor@example.com
Contraseña: Admin123.
```

### Política de Seguridad

- **Máximo 3 intentos fallidos** antes del bloqueo
- **Bloqueo de 15 minutos** tras superar el límite
- **Validación client-side y server-side**
- **Tokens JWT** para autenticación (mock en desarrollo)

## 🎯 Casos de Uso

### 1. Login Seguro
- Validación de formato de email y contraseña
- Bloqueo temporal tras intentos fallidos
- Mensajes claros de estado de autenticación

### 2. Gestión de Órdenes
- **Vista separada**: Pendientes (izquierda) y Asignadas (derecha)
- **Búsqueda**: Por número de orden, servicio o descripción
- **Creación**: Modal para nuevas órdenes
- **Scroll independiente** en cada lista

### 3. Selección de Técnicos
- **Filtros avanzados**: Zona, especialidad, carga, disponibilidad
- **Búsqueda**: Por nombre, email o teléfono (debounce 300ms)
- **Ordenamiento**: Por carga de trabajo (menor primero)
- **Indicadores visuales**: Disponibilidad y carga

### 4. Asignación Inteligente
- **Validación**: No asignar técnicos con carga 5/5
- **Actualización automática**: Carga de trabajo en tiempo real
- **Reasignación**: Transferir entre técnicos con historial
- **Persistencia**: Cambios guardados en localStorage

## 🌐 Integración con Backend

### Backend Java Spring Boot

- **Repositorio**: https://github.com/R1A2H1L1/EV10P7F2.git
- **Puerto**: 8080 (por defecto)
- **Documentación API**: Swagger disponible en `/swagger-ui.html`

### Endpoints Principales

```
Authentication:
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/verify

Technicians:
GET    /api/technicians
POST   /api/technicians
PUT    /api/technicians/{id}
DELETE /api/technicians/{id}

Orders:
GET    /api/orders
POST   /api/orders
PUT    /api/orders/{id}
POST   /api/orders/assign
DELETE /api/orders/{id}
```

### Configuración de Desarrollo

```bash
# Backend (Java Spring Boot)
git clone https://github.com/R1A2H1L1/EV10P7F2.git backend
cd backend
./mvnw spring-boot:run

# Frontend (Este proyecto)
npm run dev
```

## 🚀 Despliegue

### Vercel (Frontend)

```bash
# Build local
npm run build

# Deploy a Vercel
npx vercel --prod
```

### Variables de Entorno en Producción

```bash
VITE_API_BASE_URL=https://your-backend-api.herokuapp.com/api
VITE_NODE_ENV=production
```

### Heroku (Backend Java)

```bash
# Desde el repositorio del backend
heroku create telconova-api
git push heroku main
```

## 🧪 Testing

### Estructura de Tests

```
src/
├── components/
│   └── __tests__/      # Tests de componentes
├── services/
│   └── __tests__/      # Tests de servicios
├── hooks/
│   └── __tests__/      # Tests de hooks
└── __tests__/          # Tests de integración
```

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests e2e (Playwright)
npm run test:e2e
```

### Escenarios de Test

- ✅ Login con credenciales válidas/inválidas
- ✅ Bloqueo de cuenta tras intentos fallidos
- ✅ Filtrado y búsqueda de técnicos
- ✅ Asignación y reasignación de órdenes
- ✅ Persistencia en localStorage
- ✅ Navegación y routing
- ✅ Modo oscuro/claro
- ✅ Responsive design
- ✅ Accesibilidad

## 📊 Métricas y Calidad

### SonarCloud Integration

```bash
# Análisis de código
npm run sonar
```

### Métricas Objetivo

- **Cobertura de tests**: >80%
- **Bugs**: 0
- **Vulnerabilidades**: 0
- **Code Smells**: <10
- **Duplicación**: <5%

## 🔧 Desarrollo

### Git Flow

```bash
# Feature branch
git checkout -b feature/nueva-funcionalidad
git commit -m "feat: agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Pull Request a main
# CI/CD automático con GitHub Actions
```

### Estructura de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato
refactor: refactorización de código
test: agregar o actualizar tests
chore: tareas de mantenimiento
```

## 👥 Equipo y Roles

### Desarrolladores Frontend
- Implementar nuevas features siguiendo Clean Architecture
- Mantener cobertura de tests >80%
- Seguir principios SOLID en componentes React

### QA (Quality Assurance)
```bash
# Tests manuales
npm run dev
# Seguir checklist en /docs/qa-checklist.md

# Tests automatizados
npm run test:all
```

### BD (Base de Datos)
- Conectar APIs del repositorio de services
- Implementar migraciones de datos
- Optimizar consultas de performance

### Scrum Master
```bash
# Métricas del proyecto
npm run analyze
npm run lighthouse
```

### Integradores de Plataformas
```bash
# Deploy automático
git push origin main  # Vercel deploy automático
heroku create app-name  # Backend deployment
```

## 📚 Documentación Adicional

- [Arquitectura Detallada](./docs/architecture.md)
- [Guía de Componentes](./docs/components.md)
- [API Integration](./docs/api-integration.md)
- [Checklist QA](./docs/qa-checklist.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

- **Issues**: GitHub Issues
- **Documentación**: `/docs` folder
- **Wiki**: GitHub Wiki
- **Discusiones**: GitHub Discussions

---

**TelcoNova Team** © 2025