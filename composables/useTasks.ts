import { ref } from 'vue'

interface Tag {
  _id: string
  name: string
  color?: string
  createdAt?: string
}

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  tags: string[]
  tagNames: string[]
  createdAt: string
}

const tasks = ref<Task[]>([])
const allTags = ref<Tag[]>([])
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

  async function fetchAllTags() {
    error.value = null
    try {
      const res = await $fetch(`${base}/tags`)
      allTags.value = res as Tag[]
    } catch (err: any) {
      error.value = err.message || String(err)
      throw err
    }
  }

  async function createTask(payload: { title: string; description: string; tags?: string[] }) {
    error.value = null
    try {
      const body = {
        title: payload.title,
        description: payload.description,
        tags: payload.tags || []
      }
      const created = await $fetch(`${base}/tasks`, {
        method: 'POST',
        body
      })
      await fetchTasks()
      return created
    } catch (err: any) {
      error.value = err.message || String(err)
      throw err
    }
  }

  async function createTag(name: string, color?: string) {
    error.value = null
    try {
      const body = { name, color: color || '' }
      const created = await $fetch(`${base}/tags`, {
        method: 'POST',
        body
      })
      await fetchAllTags()
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

  async function deleteTag(id: string) {
    error.value = null
    try {
      await $fetch(`${base}/tags/${id}`, {
        method: 'DELETE'
      })
      await fetchAllTags()
      await fetchTasks()
    } catch (err: any) {
      error.value = err.message || String(err)
      throw err
    }
  }

  return {
    tasks,
    allTags,
    isLoading,
    error,
    fetchTasks,
    fetchAllTags,
    createTask,
    createTag,
    completeTask,
    deleteTask,
    deleteTag
  }
}
