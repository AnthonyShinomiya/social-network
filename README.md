# 🧱 Social Network — MVP

Este proyecto es un **MVP experimental** para una red social o plataforma de comunidad, desarrollado con un backend en **Ruby on Rails (API-only)** y un frontend moderno en **Vite + React + TailwindCSS**.

El objetivo es sentar una base **modular, segura y escalable**, enfocada en la autenticación, la comunicación entre servicios y la facilidad de expansión futura.

---

## 🚀 Stack Técnico

### 🧩 Backend (`apps/api`)

- **Ruby on Rails 8.1** (`--api`)
- **Devise** para autenticación con cookies de sesión (JSON API)
- **Rack CORS** configurado para comunicación segura con el frontend
- **PostgreSQL** como base de datos principal

#### Endpoints principales

| Método   | Ruta              | Descripción                 |
| -------- | ----------------- | --------------------------- |
| `POST`   | `/users/sign_in`  | Iniciar sesión              |
| `DELETE` | `/users/sign_out` | Cerrar sesión               |
| `GET`    | `/api/me`         | Retorna usuario autenticado |
| `GET`    | `/api/health`     | Healthcheck simple          |

#### Modelo `User`

| Campo       | Tipo   |
| ----------- | ------ |
| `email`     | string |
| `password`  | string |
| `name`      | string |
| `last_name` | string |

---

### 💻 Frontend (`apps/web`)

- **Vite + React + TypeScript**
- **TailwindCSS** para estilos modernos y consistentes
- **Fetch API** con `credentials: 'include'` para manejo de cookies de sesión
- Arquitectura base lista para escalar con **React Query** o **Context API**

---

## 🧱 Estructura del Proyecto

```
/apps
 ├── /api    → Rails API (backend)
 └── /web    → Vite + React + Tailwind (frontend)
```

---

## ⚙️ Configuración y Ejecución

### 1️⃣ Backend (Rails API)

```bash
cd apps/api
bundle install
rails db:create db:migrate
rails s
```

Variables de entorno opcionales:

```bash
WEB_ORIGIN=http://localhost:5173
```

---

### 2️⃣ Frontend (Vite + React)

```bash
cd apps/web
npm install
npm run dev
```

Por defecto:

- Frontend: **http://localhost:5173**
- Backend: **http://localhost:3000**

---

## 🧠 Próximos Pasos

- [ ] Agregar registro de usuario (`sign_up`)
- [ ] Incorporar React Query para manejo de datos
- [ ] Crear primer modelo de dominio (ej: posts, proyectos, etc.)
- [ ] Añadir tests básicos (RSpec / Vitest)
- [ ] Preparar despliegue (Fly.io / Render + Vercel)

---

## 🧩 Autor

**Anthony Shinomiya**  
Proyecto experimental en desarrollo, enfocado en **arquitectura modular**, **autenticación segura** y una base **escalable para futuras funcionalidades**.

---
