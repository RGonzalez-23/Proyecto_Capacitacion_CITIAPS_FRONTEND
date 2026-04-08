<template>
  <main class="py-5">
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-8 mx-auto">
          <div class="d-flex align-items-center mb-4">
            <h1 class="mb-0">
              <i class="bi bi-list-check"></i> Mis Tareas
            </h1>
          </div>
          <TaskForm :onCreated="refresh" />
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8 mx-auto">
          <TaskList />
        </div>
      </div>
    </div>
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
main {
  background-color: #f9fafb;
  min-height: 100vh;
}

h1 {
  color: #22c55e;
  font-weight: 700;
  font-size: 2.5rem;
}
</style>
