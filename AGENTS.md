# Mapa Mus MITM - Internal Management Panel (Next.js)

Este documento define la arquitectura, convenciones de codificación, integración con Supabase y TypeScript, y directrices técnicas específicas para el subproyecto del panel de administración interno de **Mapa Mus**.

---

## 🖥️ Descripción General
El subproyecto **MapaMus-MITM** es un panel web de gestión interna diseñado para que administradores de alto nivel puedan auditar, revisar, modificar y dar de baja torneos del ecosistema global de Mapa Mus.

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14.1.0 (App Router)
- **Routing:** App Router (`src/app/`)
- **Estilos:** Tailwind CSS v3.4.1 (con PostCSS y Autoprefixer)
- **Mapas:** `@vis.gl/react-google-maps` (Integración avanzada con la API de Google Maps)
- **Manejo de Base de Datos:** `@supabase/supabase-js` con `@supabase/auth-helpers-nextjs`
- **Iconografía:** `lucide-react`
- **Lenguaje:** TypeScript 5.3.3

---

## 📁 Estructura del Proyecto
- **`src/app/`**: Rutas y layouts del App Router (ej: `/panel`, `/login`, etc.).
- **`src/components/`**: Componentes reutilizables de React (ej: formularios de edición, visualizadores de mapas).
- **`src/lib/`**: Lógica de integración y utilidades del servidor:
  - `supabase.ts`: Instancia del cliente de Supabase para operaciones en cliente.
  - `supabaseServer.ts`: Instancia especial con permisos elevados.
  - `actions.ts`: Server Actions del panel de administración.
- **`src/types/`**: Definiciones de tipos manuales:
  - `index.ts`: Esquemas y tipos manuales para torneos, premios, contactos e información de registro.
- **`src/middleware.ts`**: Middleware global de Next.js para gestionar redirecciones de rutas protegidas y validar la sesión con Supabase Auth.

---

## ⚙️ Integración con Supabase y TypeScript

### ⚠️ Uso Obligatorio del Servidor MCP para el Esquema
- **PROHIBIDO** basar el desarrollo en esquemas o tablas hardcodeadas en la documentación.
- **Servidor MCP de Supabase:** Para consultar la estructura real de cualquier tabla (columnas, tipos, claves primarias/foráneas y restricciones), utiliza siempre las herramientas del servidor **MCP de Supabase** configurado para este repositorio (`.gemini/settings.json`).

### 1. Arquitectura de Clientes Dual de Supabase
El proyecto utiliza dos clientes independientes de Supabase según el contexto de ejecución y nivel de permisos requeridos:

- **Cliente Público (`src/lib/supabase.ts`):** 
  Se inicializa con la URL de Supabase y la clave pública del cliente (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Respeta el Row Level Security (RLS) y se utiliza para llamadas generales en el navegador.
  ```typescript
  import { supabase } from '@/lib/supabase';
  ```

- **Cliente de Servidor / Admin (`src/lib/supabaseServer.ts`):**
  Se inicializa con la URL de Supabase y la clave secreta del servidor (`SUPABASE_SECRET_KEY`). **Bypassea el RLS** y posee permisos elevados. Debe ser usado **únicamente en Server Actions o API Routes** en entornos controlados de backend para que los administradores modifiquen cualquier registro del sistema.
  ```typescript
  import { supabaseServer } from '@/lib/supabaseServer';
  ```

### 2. Consumo y Manejo de Tipos (`src/types/index.ts`)
A diferencia de la aplicación web principal, este proyecto utiliza tipado de dominio definido a mano en `src/types/index.ts`.
- **Tipos Centrales:** `Tournament`, `Prize`, `Contact`, `RegistrationInfo` y `TournamentStatus`.
- **Estructuración:** Los componentes e integraciones de servidor consumen directamente estas interfaces:
  ```typescript
  import { Tournament, Prize } from '@/types';
  ```

### 3. Server Actions y Limpieza de Formularios (`src/lib/actions.ts`)
- **Control de campos vacíos:** Al enviar formularios de edición de torneos, los strings vacíos (`""`) deben convertirse recursivamente a `null` mediante la función utilitaria `cleanObject(obj)` en `src/lib/actions.ts` antes de persistir en Supabase.
- **Formato de Retorno:** Todas las Server Actions deben capturar los errores de base de datos y retornar un objeto con el formato `{ success: boolean, error?: string }` para que la UI pueda manejar el estado de carga y error cómodamente.

---

## 📏 Reglas y Convenciones de Código

### Naming & Estilo
- **Componentes React:** PascalCase (ej: `TournamentEditForm.tsx`).
- **Archivos de Utilidades/Acciones:** kebab-case o camelCase según convención establecida en `src/lib` (ej: `supabaseServer.ts`, `actions.ts`).
- **Variables y Funciones:** camelCase (ej: `updateTournament`, `cleanObject`).
- **Idioma:** Todo el código (variables, funciones, componentes, commits, comentarios de código, etc.) debe estar escrito **estrictamente en inglés**.

### Enrutamiento y Renderizado (Next.js 14)
- **Componentes de Servidor (Server Components):** Úsalos por defecto para reducir el JavaScript cargado en el cliente y mejorar el rendimiento de carga inicial.
- **Componentes de Cliente (Client Components):** Añade la directiva `'use client'` únicamente cuando necesites interacciones del navegador (ej: manejadores de eventos en formularios o llamadas a Google Maps).
- **Control de Sesión (Auth):** El acceso al panel interno debe validarse en `src/middleware.ts` interceptando las rutas protegidas a través de la sesión de Supabase Auth.

---

## 🔍 Verificación de Calidad
Antes de proponer o completar una tarea en el panel interno:
1. Ejecuta `npm run lint` o `next lint` para asegurar que el proyecto no posea advertencias de sintaxis o fallos estructurales de Next.js.
2. Comprueba que no existan errores de tipado de TypeScript.
3. Valida que las operaciones que afecten la base de datos se ejecuten de forma segura usando el cliente idóneo (`supabaseServer` en acciones críticas y `supabase` para llamadas de lectura públicas).
