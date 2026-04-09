<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h1 class="mb-0">
            <i class="bi bi-check-circle-fill"></i> Tareas Completadas
          </h1>
          <span v-if="completedTasks.length > 0" class="badge bg-success" style="font-size: 1rem">
            {{ completedTasks.length }} completada{{ completedTasks.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-muted mt-2">Cargando tareas...</p>
        </div>

        <div v-else-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-circle"></i>
          {{ error }}
        </div>

        <div v-else-if="completedTasks.length === 0" class="alert alert-info text-center py-4">
          <i class="bi bi-inbox" style="font-size: 2rem; margin-bottom: 1rem"></i>
          <p class="lead mb-0">Aún no tienes tareas completadas</p>
          <small class="text-muted">Completa tareas desde la vista de pendientes para verlas aquí.</small>
        </div>

        <!-- Tasks List -->
        <div v-else class="row g-3">
          <div v-for="task in completedTasks" :key="task.id" class="col-12">
            <div class="card card-task card-completed border-0 shadow">
              <div class="card-body">
                <div class="row align-items-start">
                  <!-- Task Info -->
                  <div class="col-md-8">
                    <!-- Check Mark with Animation -->
                    <div class="d-flex align-items-start gap-3">
                      <div class="check-mark">
                        <i class="bi bi-check-circle-fill"></i>
                      </div>
                      <div class="flex-grow-1">
                        <h5 class="card-title fw-bold mb-2">
                          {{ task.title }}
                        </h5>
                        <p v-if="task.description" class="card-text text-muted mb-2">
                          {{ task.description }}
                        </p>

                        <!-- Tags -->
                        <div v-if="task.tagNames && task.tagNames.length > 0" class="mb-2">
                          <span v-for="tagName in task.tagNames" :key="tagName" class="badge bg-success me-2">
                            <i class="bi bi-tag"></i> {{ tagName }}
                          </span>
                        </div>

                        <!-- Date -->
                        <small class="text-muted">
                          <i class="bi bi-calendar3"></i>
                          {{ formatDate(task.createdAt) }}
                        </small>
                      </div>
                    </div>
                  </div>

                  <!-- Delete Button -->
                  <div class="col-md-4 text-md-end">
                    <button
                      @click="onDelete(task)"
                      class="btn btn-sm btn-danger"
                      title="Eliminar tarea"
                    >
                      <i class="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

const { tasks, isLoading, error, fetchTasks, deleteTask } = useTasks()

onMounted(async () => {
  await fetchTasks()
})

const completedTasks = computed(() => tasks.value.filter(t => t.completed))

function onDelete(task: any) {
  if (!confirm(`¿Estás seguro de que deseas eliminar "${task.title}"?`)) return
  deleteTask(task.id)
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString('es-ES')
  } catch {
    return d
  }
}
</script>

<style scoped>
h1 {
  color: #22c55e;
  font-weight: 700;
  font-size: 2rem;
}

.card-task {
  border: none;
  border-left: 4px solid #d1d5db;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card-task.card-completed {
  background-color: #f0fdf4;
  border-left-color: #22c55e;
}

.card-task:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.check-mark {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background-color: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  animation: checkBounce 0.6s ease-out;
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.card-title {
  color: #1f2937;
  font-weight: 600;
}

.badge {
  background-color: #22c55e !important;
  font-size: 0.85rem;
  padding: 0.375rem 0.625rem;
}

.btn-danger {
  background-color: #dc2626;
  border-color: #dc2626;
}

.btn-danger:hover {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

@media (max-width: 768px) {
  .text-md-end {
    text-align: left !important;
    margin-top: 1rem;
  }
}
</style>
