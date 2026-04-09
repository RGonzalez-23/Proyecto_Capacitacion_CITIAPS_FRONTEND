<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center mb-4">
          <h1 class="mb-0">
            <i class="bi bi-plus-circle"></i> Crear Nueva Tarea
          </h1>
        </div>

        <!-- Instructions -->
        <div class="alert alert-info mb-4">
          <i class="bi bi-lightbulb"></i>
          <strong>Consejo:</strong> Completa todos los campos para crear una tarea. Puedes agregar múltiples etiquetas
          para organizarla mejor.
        </div>

        <!-- Task Form -->
        <TaskForm :onCreated="onTaskCreated" />

        <!-- Recent Tasks Preview -->
        <div v-if="recentTasks.length > 0" class="card card-form mt-5">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-clock-history"></i> Tareas Recientes
            </h5>
          </div>
          <div class="card-body">
            <div v-for="task in recentTasks" :key="task.id" class="d-flex justify-content-between align-items-center pb-3 border-bottom">
              <div class="flex-grow-1">
                <h6 class="mb-1">{{ task.title }}</h6>
                <small v-if="task.tagNames.length > 0" class="text-muted">
                  <span v-for="tag in task.tagNames" :key="tag" class="badge bg-success me-1">
                    {{ tag }}
                  </span>
                </small>
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
import TaskForm from '~/components/TaskForm.vue'

definePageMeta({
  layout: 'default'
})

const { tasks, fetchTasks } = useTasks()

onMounted(async () => {
  await fetchTasks()
})

const recentTasks = computed(() => {
  return tasks.value.slice(0, 5)
})

function onTaskCreated() {
  fetchTasks()
}
</script>

<style scoped>
h1 {
  color: #22c55e;
  font-weight: 700;
  font-size: 2rem;
}

.card-form {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-form .card-header {
  background-color: #22c55e !important;
  border-bottom: 3px solid #16a34a;
}
</style>
