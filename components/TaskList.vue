<template>
  <div class="task-list">
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

    <div v-else-if="tasks.length === 0" class="alert alert-info text-center">
      <i class="bi bi-inbox"></i>
      <p class="mb-0">No hay tareas aún. ¡Crea una nueva!</p>
    </div>

    <div v-else class="row g-3">
      <div v-for="task in tasks" :key="task.id" class="col-12">
        <div
          :class="[
            'card',
            'card-task',
            { 'card-completed': task.completed }
          ]"
        >
          <div class="card-body">
            <div class="row align-items-start">
              <div class="col">
                <h5 :class="['card-title', { 'text-decoration-line-through text-muted': task.completed }]">
                  <i v-if="task.completed" class="bi bi-check-circle-fill text-success me-2"></i>
                  <i v-else class="bi bi-circle me-2"></i>
                  {{ task.title }}
                </h5>
                <p v-if="task.description" :class="['card-text', { 'text-muted': task.completed }]">
                  {{ task.description }}
                </p>
                <small class="text-muted">
                  <i class="bi bi-calendar3"></i>
                  {{ formatDate(task.createdAt) }}
                </small>
              </div>
              <div class="col-auto">
                <div class="btn-group" role="group">
                  <button
                    v-if="!task.completed"
                    @click="onComplete(task)"
                    class="btn btn-sm btn-success"
                    title="Marcar como completada"
                  >
                    <i class="bi bi-check-lg"></i>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { tasks, isLoading, error, completeTask, deleteTask } = useTasks()

function onComplete(task: any) {
  completeTask(task.id)
}

function onDelete(task: any) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return
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

.card-completed {
  background-color: #f9fafb;
  border-left-color: #d1d5db;
}

.card-title {
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-weight: 600;
}

.card-text {
  font-size: 0.95rem;
  line-height: 1.5;
}

.btn-group .btn-success {
  background-color: #22c55e;
  border-color: #22c55e;
}

.btn-group .btn-success:hover {
  background-color: #16a34a;
  border-color: #16a34a;
}

.text-success {
  color: #22c55e !important;
}

.alert-info {
  background-color: #dbeafe;
  border-color: #93c5fd;
  color: #1e40af;
}

.text-muted {
  color: #6b7280;
}
</style>
