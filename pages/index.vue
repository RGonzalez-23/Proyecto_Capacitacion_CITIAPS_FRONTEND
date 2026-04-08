<template>
  <main>
    <h1>Tareas</h1>
    <TaskForm :onCreated="refresh" />
    <TaskList />
  </main>
</template>

<script setup lang="ts">
import TaskForm from '~/components/TaskForm.vue'
import TaskList from '~/components/TaskList.vue'

const { fetchTasks } = useTasks()

onMounted(() => {
  fetchTasks()
})

function refresh() {
  fetchTasks()
}
</script>

<style scoped>
main { max-width: 800px; margin: 24px auto; padding: 12px }
</style>
