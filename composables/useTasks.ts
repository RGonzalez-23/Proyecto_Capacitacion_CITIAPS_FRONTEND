import { ref } from 'vue'

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  createdAt: string
}

const tasks = ref<Task[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useTasks() {
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  async function fetchTasks() {
    isLoading.value = true
    error.value = null
    try {
      const res = await $fetch(`${base}/tasks`)
      tasks.value = res as Task[]
    } catch (err: any) {
      error.value = err.message || String(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(payload: { title: string; description: string }) {
    error.value = null
    try {
      const created = await $fetch(`${base}/tasks`, {
        method: 'POST',
        body: payload,
      })
      // push and refresh
      await fetchTasks()
      return created
    } catch (err: any) {
      error.value = err.message || String(err)
      throw err
    }
  }

  async function completeTask(id: string) {
    error.value = null
    try {
      await $fetch(`${base}/tasks/${id}/complete`, {
        method: 'PUT'
      })
      await fetchTasks()
    } catch (err: any) {
      error.value = err.message || String(err)
      throw err
    }
  }

  async function deleteTask(id: string) {
    error.value = null
    try {
      await $fetch(`${base}/tasks/${id}`, {
        method: 'DELETE'
      })
      await fetchTasks()
    } catch (err: any) {
      error.value = err.message || String(err)
      throw err
    }
  }

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    completeTask,
    deleteTask
  }
}
