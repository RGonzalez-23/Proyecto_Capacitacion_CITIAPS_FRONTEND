<template>
  <div class="container py-5">
    <div class="row h-100 align-items-center">
      <div class="col-lg-8 mx-auto">
        <!-- Welcome Hero -->
        <div class="card border-0 shadow-lg mb-5">
          <div class="card-body p-5 text-center">
            <div class="welcome-icon mb-4">
              <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: #22c55e"></i>
            </div>
            <h1 class="display-4 fw-bold mb-3">
              ¡Bienvenido a CITIAPS!
            </h1>
            <p class="lead text-muted mb-4">
              Tu gestor de tareas personal para mantener tu productividad al máximo.
              Organiza tus tareas, asigna etiquetas y sigue tu progreso.
            </p>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="row g-4 mb-5">
          <div class="col-md-6">
            <NuxtLink to="/create" class="card card-action border-0 shadow h-100">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-plus-circle-fill" style="font-size: 2.5rem; color: #22c55e"></i>
                </div>
                <h5 class="card-title fw-bold">Crear Nueva Tarea</h5>
                <p class="card-text text-muted">
                  Agrega una nueva tarea a tu lista con título, descripción y etiquetas.
                </p>
                <div class="mt-3">
                  <span class="badge bg-success">Empezar</span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div class="col-md-6">
            <NuxtLink to="/pending" class="card card-action border-0 shadow h-100">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-list-check" style="font-size: 2.5rem; color: #16a34a"></i>
                </div>
                <h5 class="card-title fw-bold">Tareas Pendientes</h5>
                <p class="card-text text-muted">
                  Revisa todas tus tareas pendientes por completar.
                </p>
                <div class="mt-3">
                  <span class="badge bg-warning text-dark">
                    {{ pendingCount }} tareas
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <NuxtLink to="/completed" class="card card-action border-0 shadow h-100">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-check-circle-fill" style="font-size: 2.5rem; color: #4ade80"></i>
                </div>
                <h5 class="card-title fw-bold">Tareas Completadas</h5>
                <p class="card-text text-muted">
                  Visualiza todas las tareas que ya completaste.
                </p>
                <div class="mt-3">
                  <span class="badge bg-success">
                    {{ completedCount }} completadas
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>

          <div class="col-md-6">
            <NuxtLink to="/tags" class="card card-action border-0 shadow h-100">
              <div class="card-body text-center p-4">
                <div class="feature-icon mb-3">
                  <i class="bi bi-tags" style="font-size: 2.5rem; color: #0ea5e9"></i>
                </div>
                <h5 class="card-title fw-bold">Administrar Etiquetas</h5>
                <p class="card-text text-muted">
                  Crea y organiza tus etiquetas personalizadas para mejor control.
                </p>
                <div class="mt-3">
                  <span class="badge bg-info">{{ allTags.length }} etiquetas</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Stats -->
        <div class="card border-0 shadow mt-5">
          <div class="card-body p-4">
            <h6 class="card-title fw-bold mb-3">Resumen</h6>
            <div class="row text-center">
              <div class="col-4">
                <div class="stat-box">
                  <div class="stat-number text-success">{{ totalCount }}</div>
                  <small class="text-muted">Total de tareas</small>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-box">
                  <div class="stat-number text-warning">{{ pendingCount }}</div>
                  <small class="text-muted">Pendientes</small>
                </div>
              </div>
              <div class="col-4">
                <div class="stat-box">
                  <div class="stat-number text-success">{{ completedCount }}</div>
                  <small class="text-muted">Completadas</small>
                </div>
              </div>
            </div>
            <div class="progress mt-3" style="height: 8px">
              <div
                v-if="totalCount > 0"
                class="progress-bar"
                :style="{
                  width: ((completedCount / totalCount) * 100) + '%',
                  backgroundColor: '#22c55e'
                }"
              ></div>
              <div
                v-if="totalCount > 0"
                class="progress-bar"
                :style="{
                  width: ((pendingCount / totalCount) * 100) + '%',
                  backgroundColor: '#fbbf24'
                }"
              ></div>
            </div>
            <small class="text-muted d-block mt-2">
              {{ completedPercentage }}% completado
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

const { tasks, allTags, fetchTasks, fetchAllTags } = useTasks()

onMounted(async () => {
  await fetchTasks()
  await fetchAllTags()
})

const pendingCount = computed(() => tasks.value.filter(t => !t.completed).length)
const completedCount = computed(() => tasks.value.filter(t => t.completed).length)
const totalCount = computed(() => tasks.value.length)
const completedPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})
</script>

<style scoped>
.card-action {
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.card-action:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2) !important;
  color: inherit;
}

.feature-icon {
  display: inline-block;
}

.stat-box {
  padding: 1rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
}

.welcome-icon {
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
