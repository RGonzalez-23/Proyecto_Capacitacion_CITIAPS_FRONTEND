<template>
  <form @submit.prevent="onSubmit" class="task-form">
    <div>
      <label>Título</label>
      <input v-model="title" required />
    </div>
    <div>
      <label>Descripción</label>
      <input v-model="description" />
    </div>
    <button type="submit">Crear tarea</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ onCreated?: () => void }>()
const title = ref('')
const description = ref('')

const { createTask } = useTasks()

async function onSubmit() {
  if (!title.value) return
  await createTask({ title: title.value, description: description.value })
  title.value = ''
  description.value = ''
  if (props.onCreated) props.onCreated()
}
</script>

<style scoped>
.task-form { display: flex; gap: 8px; align-items: center }
.task-form input { padding: 6px }
</style>
