<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-10 mx-auto">
        <!-- Header -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h1 class="mb-0">
            <i class="bi bi-tags"></i> Administrar Etiquetas
          </h1>
          <span class="badge bg-info" style="font-size: 1rem">
            {{ allTags.length }} etiqueta{{ allTags.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <!-- Create Tag Form -->
        <div class="card card-form mb-5">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <i class="bi bi-plus-circle"></i> Nueva Etiqueta
            </h5>
          </div>
          <div class="card-body">
            <!-- Error Messages -->
            <div v-if="createErrors.length > 0" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
              <i class="bi bi-exclamation-circle"></i>
              <strong>Errores:</strong>
              <ul class="mb-0 mt-2">
                <li v-for="(error, idx) in createErrors" :key="idx">{{ error }}</li>
              </ul>
              <button type="button" class="btn-close" @click="createErrors = []" aria-label="Cerrar"></button>
            </div>

            <!-- Success Message -->
            <div v-if="createSuccess" class="alert alert-success alert-dismissible fade show mb-3" role="alert">
              <i class="bi bi-check-circle"></i>
              {{ createSuccess }}
              <button type="button" class="btn-close" @click="createSuccess = ''" aria-label="Cerrar"></button>
            </div>

            <form @submit.prevent="onCreateTag">
              <div class="row">
                <div class="col-lg-6 mb-3">
                  <label for="tag-name" class="form-label">Nombre <span class="text-danger">*</span></label>
                  <input
                    id="tag-name"
                    v-model="newTagName"
                    type="text"
                    class="form-control"
                    :class="{ 'is-invalid': tagNameError }"
                    placeholder="Ej: Urgente, Trabajo, Personal"
                    maxlength="50"
                    @input="validateTagName"
                  />
                  <div v-if="tagNameError" class="invalid-feedback d-block">
                    {{ tagNameError }}
                  </div>
                  <small class="text-muted d-block mt-1">{{ newTagName.length }}/50 caracteres</small>
                </div>

                <div class="col-lg-6 mb-3">
                  <label for="tag-color" class="form-label">Color (opcional)</label>
                  <div class="input-group">
                    <input
                      id="tag-color"
                      v-model="newTagColor"
                      type="color"
                      class="form-control form-control-color"
                      style="max-width: 60px"
                      title="Elige un color"
                    />
                    <input
                      type="text"
                      class="form-control"
                      :value="newTagColor"
                      readonly
                      placeholder="#22ab99"
                    />
                  </div>
                  <small class="text-muted d-block mt-1">Código hexadecimal: {{ newTagColor }}</small>
                </div>
              </div>

              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="isCreating || !!tagNameError">
                  <i class="bi bi-plus-circle"></i>
                  {{ isCreating ? 'Creando...' : 'Crear Etiqueta' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="text-muted mt-2">Cargando etiquetas...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
          <i class="bi bi-exclamation-circle"></i>
          {{ error }}
          <button type="button" class="btn-close" @click="error = ''" aria-label="Cerrar"></button>
        </div>

        <!-- Empty State -->
        <div v-else-if="allTags.length === 0" class="alert alert-info text-center py-4">
          <i class="bi bi-info-circle" style="font-size: 2rem; margin-bottom: 1rem"></i>
          <p class="lead mb-0">No tienes etiquetas aún</p>
          <small class="text-muted">Crea tu primera etiqueta usando el formulario anterior.</small>
        </div>

        <!-- Tags Grid -->
        <div v-else class="row g-3">
          <div v-for="tag in allTags" :key="tag._id" class="col-md-6 col-lg-4">
            <div 
              class="card card-tag border-0 shadow h-100"
              :style="{ borderTopColor: tag.color || '#22ab99' }"
            >
              <div class="card-body">
                <!-- Tag Header -->
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="d-flex align-items-center gap-2">
                    <div
                      v-if="tag.color"
                      class="tag-color-dot"
                      :style="{ backgroundColor: tag.color, borderColor: tag.color }"
                      :title="tag.color"
                    ></div>
                    <div v-else class="tag-color-dot" style="backgroundColor: #d1d5db; borderColor: #9ca3af"></div>
                    <h5 class="card-title fw-bold mb-0">{{ tag.name }}</h5>
                  </div>
                  <button
                    @click="deleteTag(tag._id)"
                    class="btn btn-sm btn-danger"
                    :disabled="isDeleting === tag._id"
                    title="Eliminar etiqueta"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>

                <!-- Tag Info -->
                <div class="tag-info">
                  <div class="mb-2">
                    <small class="text-muted d-block">
                      <i class="bi bi-calendar3"></i>
                      {{ formatDate(tag.createdAt) }}
                    </small>
                  </div>

                  <!-- Task Count -->
                  <div class="task-count-badge">
                    <span class="badge" :style="{ backgroundColor: tag.color || '#22ab99' }">
                      <i class="bi bi-check-circle"></i>
                      {{ getTaskCountForTag(tag._id) }} tarea{{ getTaskCountForTag(tag._id) !== 1 ? 's' : '' }}
                    </span>
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
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const base = config.public.apiBase

const { allTags, tasks, fetchAllTags, fetchTasks, isLoading, error } = useTasks()
const newTagName = ref('')
const newTagColor = ref('#22ab99')
const isCreating = ref(false)
const isDeleting = ref<string | null>(null)
const createErrors = ref<string[]>([])
const createSuccess = ref('')
const tagNameError = ref('')

onMounted(async () => {
  await fetchAllTags()
  await fetchTasks()
})

function validateTagName() {
  const trimmed = newTagName.value.trim()
  if (!trimmed) {
    tagNameError.value = 'El nombre es requerido'
  } else if (trimmed.length < 2) {
    tagNameError.value = 'El nombre debe tener al menos 2 caracteres'
  } else if (allTags.value.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) {
    tagNameError.value = 'Esta etiqueta ya existe'
  } else {
    tagNameError.value = ''
  }
}

async function onCreateTag() {
  createErrors.value = []
  validateTagName()

  if (tagNameError.value) {
    createErrors.value.push(tagNameError.value)
    return
  }

  isCreating.value = true
  try {
    const response = await $fetch(`${base}/tags`, {
      method: 'POST',
      body: {
        name: newTagName.value.trim(),
        color: newTagColor.value
      }
    })

    createSuccess.value = 'Etiqueta creada exitosamente'
    newTagName.value = ''
    newTagColor.value = '#22ab99'
    
    await fetchAllTags()
    
    setTimeout(() => {
      createSuccess.value = ''
    }, 3000)
  } catch (err: any) {
    const message = err.data?.message || err.message || 'Error al crear la etiqueta'
    createErrors.value.push(message)
  } finally {
    isCreating.value = false
  }
}

async function deleteTag(tagId: string) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta etiqueta? Se removera de todas las tareas.')) {
    return
  }

  isDeleting.value = tagId
  try {
    await $fetch(`${base}/tags/${tagId}`, {
      method: 'DELETE'
    })

    await Promise.all([fetchAllTags(), fetchTasks()])
  } catch (err: any) {
    const message = err.data?.message || err.message || 'Error al eliminar la etiqueta'
    createErrors.value.push(message)
  } finally {
    isDeleting.value = null
  }
}

function getTaskCountForTag(tagId: string): number {
  return tasks.value.filter(task => 
    task.tags && task.tags.includes(tagId)
  ).length
}

function formatDate(d: string | undefined) {
  if (!d) return 'N/A'
  try {
    return new Date(d).toLocaleString('es-ES')
  } catch {
    return d
  }
}
</script>

<style scoped>
h1 {
  color: #22ab99;
  font-weight: 700;
  font-size: 2rem;
}

.card-form {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-form .card-header {
  background-color: #22ab99 !important;
  border-bottom: 3px solid #1a8873;
}

.form-label {
  font-weight: 500;
  color: #1f2937;
}

.form-control:focus,
textarea:focus {
  border-color: #22ab99;
  box-shadow: 0 0 0 0.2rem rgba(34, 171, 153, 0.25);
}

.form-control.is-invalid:focus {
  border-color: #dc2626;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.25);
}

.invalid-feedback {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.btn-primary {
  background-color: #22ab99;
  border-color: #22ab99;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1a8873;
  border-color: #1a8873;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.alert {
  border: none;
  border-left: 4px solid;
}

.alert-danger {
  background-color: #fee2e2;
  border-left-color: #dc2626;
  color: #991b1b;
}

.alert-success {
  background-color: #dcfce7;
  border-left-color: #22ab99;
  color: #166534;
}

.alert-info {
  background-color: #dbeafe;
  border-left-color: #0ea5e9;
  color: #0c4a6e;
}

.card-tag {
  border: none;
  border-top: 5px solid #22ab99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%);
}

.card-tag:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-3px);
}

.card-title {
  color: #1f2937;
  font-weight: 600;
  font-size: 1.1rem;
}

.tag-color-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid currentColor;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.tag-info {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.task-count-badge {
  margin-top: 0.75rem;
}

.badge {
  font-size: 0.85rem;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  border-radius: 0.375rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-danger {
  background-color: #dc2626;
  border-color: #dc2626;
}

.btn-danger:hover:not(:disabled) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-control-color {
  height: 40px;
  cursor: pointer;
}

.input-group .form-control-color {
  padding: 0.375rem;
}

@media (max-width: 768px) {
  h1 {
    font-size: 1.5rem;
  }

  .col-lg-4 {
    flex: 0 0 100%;
  }
}
</style>
