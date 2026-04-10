# CITIAPS Frontend

Aplicación web para gestión de tareas con etiquetas, desarrollada con Nuxt 3 y Vue 3.

## Descripción

Frontend de la aplicación gestión de tareas CITIAPS que permite:
- Crear, visualizar, completar y eliminar tareas
- Organizar tareas con etiquetas personalizadas
- Filtrar tareas por etiquetas
- Gestionar colores de etiquetas
- Visualizar tareas pendientes y completadas con paginación

## Estructura del Proyecto

```
Proyecto_Capacitacion_CITIAPS_FRONTEND/
├── app.vue                  # Componente raíz de la aplicación
├── nuxt.config.ts          # Configuración de Nuxt
├── package.json            # Dependencias del proyecto
├── tsconfig.json           # Configuración de TypeScript
├── README.md               # Este archivo
│
├── app/                    # Carpeta de la aplicación
├── components/             # Componentes reutilizables
│   ├── TaskForm.vue        # Formulario para crear tareas
│   ├── TaskList.vue        # Componente para listar tareas
│   └── TagInput.vue        # Selector de etiquetas
│
├── composables/            # Composables (lógica compartida)
│   └── useTasks.ts         # Configuración de API y estado de tareas
│
├── layouts/                # Layouts de la aplicación
│   └── default.vue         # Layout principal con navbar
│
├── pages/                  # Páginas/vistas
│   ├── index.vue           # Página de inicio
│   ├── create.vue          # Vista para crear tareas
│   ├── pending.vue         # Vista de tareas pendientes
│   ├── completed.vue       # Vista de tareas completadas
│   └── tags.vue            # Vista de administración de etiquetas
│
├── plugins/                # Plugins de Nuxt
├── public/                 # Archivos estáticos
│
└── assets/
    └── styles/
        └── bootstrap-override.scss  # Estilos personalizados
```

## Requisitos

- **Node.js** 16.0 o superior
- **npm** (gestor de paquetes)
- **Backend proyecto de capacitación CITIAPS** corriendo en `http://localhost:8080` de preferencia

## Instalación

1. Clona o descarga el proyecto
   ```powershell
   git clone [url-repositorio]
   ```

2. Navega a la carpeta del frontend:
   ```powershell
   cd FRONTEND/Proyecto_Capacitacion_CITIAPS_FRONTEND
   ```

3. Instala las dependencias:
   ```powershell
   npm install
   ```

## Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
# URL base de la API del backend
NUXT_PUBLIC_API_BASE=http://localhost:8080/api
```

## Ejecución

### Servidor de Desarrollo

Ejecuta la aplicación en modo desarrollo:

```powershell
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

### Construcción para Producción

Compila la aplicación para producción:

```powershell
npm run build
```

### Vista Previa de Producción

Visualiza la aplicación compilada localmente:

```powershell
npm run preview
```

## Funcionalidades Principales

### 📝 Gestión de Tareas
- ✅ Crear nuevas tareas con título, descripción y etiquetas
- ✅ Ver tareas pendientes y completadas
- ✅ Marcar tareas como completadas
- ✅ Eliminar tareas
- ✅ Paginación (5 tareas por página)

### 🏷️ Gestión de Etiquetas
- ✅ Crear etiquetas con colores personalizados
- ✅ Eliminar etiquetas
- ✅ Asignar etiquetas a tareas
- ✅ Filtrar tareas por etiqueta

### 🎨 Interfaz de Usuario
- ✅ Diseño responsivo con Bootstrap 5
- ✅ Colores personalizados
- ✅ Navegación intuitiva
- ✅ Mensajes de éxito y error
- ✅ Validación de formularios

## Stack Tecnológico

- **Nuxt 3** - Framework Meta
- **Vue 3** - Composition API
- **TypeScript** - Tipado estático
- **Bootstrap 5** - Estilos CSS
- **Axios/Fetch** - Comunicación API
- **SCSS** - Estilos avanzados

---

**Desarrollado para capacitación de CITIAPS**
