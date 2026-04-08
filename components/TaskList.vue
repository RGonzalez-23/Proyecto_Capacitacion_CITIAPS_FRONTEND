<template>
  <div>
    <div v-if="isLoading">Cargando tareas...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul>
      <li v-for="task in tasks" :key="task.id" :class="{ completed: task.completed }">
        <div>
          <strong>{{ task.title }}</strong>
          <p>{{ task.description }}</p>
          <small>{{ formatDate(task.createdAt) }}</small>
        </div>
        <div class="actions">
          <button @click="onComplete(task)" :disabled="task.completed">Marcar completa</button>
          <button @click="onDelete(task)">Eliminar</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const { tasks, isLoading, error, completeTask, deleteTask } = useTasks()

function onComplete(task: any) {
  completeTask(task.id)
}
function onDelete(task: any) {
  if (!confirm('¿Eliminar tarea?')) return
  deleteTask(task.id)
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleString()
  } catch {
    return d
  }
}
</script>

<style scoped>
.completed { opacity: 0.6; text-decoration: line-through }
.actions { display: flex; gap: 8px }
.error { color: red }
</style>
