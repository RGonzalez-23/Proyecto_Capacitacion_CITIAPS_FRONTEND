<template>
  <div class="card card-form mb-4">
    <div class="card-header bg-primary text-white">
      <h5 class="mb-0">
        <i class="bi bi-plus-circle"></i> Nueva Tarea
      </h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="title-input" class="form-label">Título <span class="text-danger">*</span></label>
          <input
            id="title-input"
            v-model="title"
            type="text"
            class="form-control"
            placeholder="Ingrese el título de la tarea"
            required
          />
        </div>
        <div class="mb-3">
          <label for="description-input" class="form-label">Descripción</label>
          <textarea
            id="description-input"
            v-model="description"
            class="form-control"
            rows="3"
            placeholder="Ingrese una descripción (opcional)"
          ></textarea>
        </div>

        <!-- TagInput Component -->
        <div class="mb-3">
          <label class="form-label">Etiquetas</label>
          <TagInput v-model="selectedTags" />
        </div>

        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting">
            <i class="bi bi-plus-circle"></i>
            {{ isSubmitting ? 'Creando...' : 'Crear Tarea' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ onCreated?: () => void }>()
const title = ref('')
const description = ref('')
const selectedTags = ref<string[]>([])
const isSubmitting = ref(false)

const { createTask } = useTasks()

async function onSubmit() {
  if (!title.value.trim()) return

  isSubmitting.value = true
  try {
    await createTask({
      title: title.value,
      description: description.value,
      tags: selectedTags.value
    })
    title.value = ''
    description.value = ''
    selectedTags.value = []
    if (props.onCreated) props.onCreated()
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.card-form {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-form .card-header {
  background-color: #22c55e !important;
  border-bottom: 3px solid #16a34a;
}

.form-label {
  font-weight: 500;
  color: #1f2937;
}

.form-control:focus,
.form-control:focus,
textarea:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.25);
}

.btn-primary {
  background-color: #22c55e;
  border-color: #22c55e;
}

.btn-primary:hover:not(:disabled) {
  background-color: #16a34a;
  border-color: #16a34a;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
