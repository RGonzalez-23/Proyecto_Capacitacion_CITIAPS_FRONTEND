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
          <div v-for="task in paginatedTasks" :key="task.id" class="col-12">
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
                        <p class="card-text text-muted mb-2" :class="{ 'text-italic': !task.description }">
                          <i v-if="!task.description" class="bi bi-info-circle me-1"></i>
                          {{ task.description || 'Sin descripción dada.' }}
                        </p>

                        <!-- Tags -->
                        <div v-if="task.tagNames && task.tagNames.length > 0" class="mb-2">
                          <span v-for="tagName in task.tagNames" :key="tagName" class="badge me-2" :style="{ backgroundColor: getTagColorByName(tagName) }">
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

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="col-12 mt-4">
            <nav aria-label="Paginación">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button @click="prevPage" class="page-link" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-left"></i> Anterior
                  </button>
                </li>
                <li
                  v-for="page in totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: currentPage === page }"
                >
                  <button @click="goToPage(page)" class="page-link">
                    {{ page }}
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button @click="nextPage" class="page-link" :disabled="currentPage === totalPages">
                    Siguiente <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const { tasks, isLoading, error, fetchTasks, deleteTask, getTagColorByName } = useTasks()
const currentPage = ref(1)
const itemsPerPage = 5

onMounted(async () => {
  await fetchTasks()
})

const completedTasks = computed(() => tasks.value.filter(t => t.completed))

const totalPages = computed(() => Math.ceil(completedTasks.value.length / itemsPerPage))

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return completedTasks.value.slice(start, end)
})

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

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function goToPage(page: number) {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  font-size: 0.85rem;
  padding: 0.375rem 0.625rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

.pagination {
  margin: 0;
}

.pagination .page-link {
  color: #22c55e;
  border-color: #22c55e;
  background-color: white;
}

.pagination .page-link:hover {
  background-color: #f0fdf4;
  color: #16a34a;
  border-color: #16a34a;
}

.pagination .page-item.active .page-link {
  background-color: #22c55e;
  border-color: #22c55e;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #d1d5db;
  border-color: #e5e7eb;
  background-color: #f9fafb;
  cursor: not-allowed;
}

.page-link {
  padding: 0.5rem 0.85rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}
</style>
