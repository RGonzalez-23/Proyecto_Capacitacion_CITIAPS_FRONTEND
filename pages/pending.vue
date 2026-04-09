<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h1 class="mb-0">
            <i class="bi bi-list-check"></i> Tareas Pendientes
          </h1>
          <span v-if="pendingTasks.length > 0" class="badge bg-warning text-dark" style="font-size: 1rem">
            {{ pendingTasks.length }} pendiente{{ pendingTasks.length !== 1 ? 's' : '' }}
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

        <div v-else-if="pendingTasks.length === 0" class="alert alert-success text-center py-4">
          <i class="bi bi-check-circle-fill" style="font-size: 2rem; margin-bottom: 1rem"></i>
          <p class="lead mb-0">¡No tienes tareas pendientes!</p>
          <small class="text-muted">Excelente trabajo. Mantén así la productividad.</small>
        </div>

        <!-- Tasks List -->
        <div v-else class="row g-3">
          <div v-for="task in pendingTasks" :key="task.id" class="col-12">
            <div class="card card-task border-0 shadow">
              <div class="card-body">
                <div class="row align-items-start">
                  <!-- Task Info -->
                  <div class="col-md-8">
                    <h5 class="card-title fw-bold mb-2">
                      <i class="bi bi-circle-fill" style="font-size: 0.6rem; margin-right: 0.5rem"></i>
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

                  <!-- Actions -->
                  <div class="col-md-4 text-md-end">
                    <div class="btn-group" role="group">
                      <button
                        @click="onComplete(task)"
                        class="btn btn-sm btn-success"
                        title="Marcar como completada"
                      >
                        <i class="bi bi-check-lg"></i> Completar
                      </button>
                      <button
                        @click="onDelete(task)"
                        class="btn btn-sm btn-danger"
                        title="Eliminar tarea"
                      >
                        <i class="bi bi-trash"></i>
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default'
})

const { tasks, isLoading, error, fetchTasks, completeTask, deleteTask } = useTasks()

onMounted(async () => {
  await fetchTasks()
})

const pendingTasks = computed(() => tasks.value.filter(t => !t.completed))

function onComplete(task: any) {
  completeTask(task.id)
}

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
  border-left: 4px solid #22c55e;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card-task:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
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

.btn-group .btn-success {
  background-color: #22c55e;
  border-color: #22c55e;
}

.btn-group .btn-success:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

@media (max-width: 768px) {
  .text-md-end {
    text-align: left !important;
    margin-top: 1rem;
  }
}
</style>
