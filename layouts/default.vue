<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <nav class="sidebar bg-primary text-white p-4" :class="{ open: sidebarOpen }">
      <!-- Close button (mobile) - Header del sidebar en mobile -->
      <div class="sidebar-header d-md-none mb-3">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="mb-0">
            <i class="bi bi-check-circle"></i> CITIAPS
          </h3>
          <button
            @click="sidebarOpen = false"
            class="btn-close-sidebar-x"
            aria-label="Cerrar menú"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      <div class="sidebar-brand mb-4 d-none d-md-block">
        <h3 class="mb-0">
          <i class="bi bi-check-circle"></i> CITIAPS
        </h3>
      </div>

      <ul class="nav flex-column gap-3">
        <li class="nav-item">
          <NuxtLink
            to="/"
            class="nav-link text-white"
            :class="{ active: $route.path === '/' }"
          >
            <i class="bi bi-house"></i> Inicio
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink
            to="/create"
            class="nav-link text-white"
            :class="{ active: $route.path === '/create' }"
          >
            <i class="bi bi-plus-circle"></i> Crear Tarea
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink
            to="/pending"
            class="nav-link text-white"
            :class="{ active: $route.path === '/pending' }"
          >
            <i class="bi bi-list-check"></i> Pendientes
            <span v-if="pendingCount > 0" class="badge bg-success ms-2">
              {{ pendingCount }}
            </span>
          </NuxtLink>
        </li>
        <li class="nav-item">
          <NuxtLink
            to="/completed"
            class="nav-link text-white"
            :class="{ active: $route.path === '/completed' }"
          >
            <i class="bi bi-check-lg"></i> Completadas
            <span v-if="completedCount > 0" class="badge bg-light text-dark ms-2">
              {{ completedCount }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Main Content -->
    <div class="flex-grow-1 d-flex flex-column">
      <!-- Top bar -->
      <header class="navbar bg-primary text-white shadow-sm">
        <div class="container-fluid ps-4 pe-4 d-flex align-items-center justify-content-between">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="btn-menu-toggle d-md-none"
            aria-label="Abrir menú"
          >
            <i class="bi bi-list"></i>
          </button>
          <span class="navbar-brand mb-0 h5 flex-grow-1">
            <i class="bi bi-check-circle"></i> Gestor de Tareas CITIAPS
          </span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-grow-1 bg-light py-4">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const { tasks } = useTasks()
const sidebarOpen = ref(false)

const pendingCount = computed(() => tasks.value.filter(t => !t.completed).length)
const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
</script>

<style scoped>
.layout-container {
  position: relative;
  overflow: hidden;
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background-color: #22c55e !important;
  height: 100vh;
  position: relative;
  overflow-y: auto;
  transition: all 0.3s ease;
}

.sidebar-brand {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8) !important;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white !important;
}

.nav-link.active {
  background-color: rgba(0, 0, 0, 0.2);
  color: white !important;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.badge {
  font-size: 0.75rem;
  padding: 0.35rem 0.6rem;
  white-space: nowrap;
}

.navbar {
  background-color: #22c55e !important;
}

.btn-link {
  padding: 0;
  margin: 0;
}

.btn-menu-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin: 0;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
}

.btn-menu-toggle:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.btn-menu-toggle:active {
  background-color: rgba(255, 255, 255, 0.3);
}

.btn-menu-toggle i {
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  background-color: #f9fafb;
}

.btn-close-sidebar {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.75rem;
  margin: -0.5rem 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 100%;
  border-radius: 0.5rem;
}

.btn-close-sidebar:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: scale(1.1);
}

.btn-close-sidebar:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.sidebar-header {
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
  margin-left: -1rem;
  margin-right: -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.btn-close-sidebar-x {
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.btn-close-sidebar-x:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.15);
}

.btn-close-sidebar-x:active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Desktop - Sidebar siempre visible */
@media (min-width: 769px) {
  .sidebar {
    position: relative;
    transform: translateX(0);
    height: auto;
    min-height: 100vh;
  }

  .btn-close-sidebar {
    display: none !important;
  }

  .btn-link.d-md-none {
    display: none !important;
  }
}

/* Mobile - Sidebar desplegable con overlay */
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  /* Overlay when sidebar is open */
  .sidebar.open::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .flex-grow-1 {
    width: 100%;
  }

  .btn-close-sidebar-x {
    display: flex !important;
  }

  .btn-menu-toggle {
    display: flex !important;
  }
}
</style>
