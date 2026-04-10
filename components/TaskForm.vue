<template>
  <div class="card card-form mb-4">
    <div class="card-header bg-primary text-white">
      <h5 class="mb-0">
        <i class="bi bi-plus-circle"></i> Nueva Tarea
      </h5>
    </div>
    <div class="card-body">
      <!-- Error Messages -->
      <div v-if="errors.length > 0" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
        <i class="bi bi-exclamation-circle"></i>
        <strong>Errores de validación:</strong>
        <ul class="mb-0 mt-2">
          <li v-for="(error, idx) in errors" :key="idx">{{ error }}</li>
        </ul>
        <button type="button" class="btn-close" @click="errors = []" aria-label="Cerrar"></button>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mb-3" role="alert">
        <i class="bi bi-check-circle"></i>
        {{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Cerrar"></button>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label for="title-input" class="form-label">Título <span class="text-danger">*</span></label>
          <input
            id="title-input"
            v-model="title"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': titleError }"
            placeholder="Ingrese el título de la tarea"
            maxlength="100"
            @input="validateTitle"
          />
          <div v-if="titleError" class="invalid-feedback d-block">
            {{ titleError }}
          </div>
          <small class="text-muted d-block mt-1">{{ title.length }}/100 caracteres</small>
        </div>

        <div class="mb-3">
          <label for="description-input" class="form-label">Descripción (opcional)</label>
          <textarea
            id="description-input"
            v-model="description"
            class="form-control"
            rows="3"
            placeholder="Ingrese una descripción (opcional)"
            maxlength="500"
          ></textarea>
          <small class="text-muted d-block mt-1">{{ description.length }}/500 caracteres</small>
        </div>

        <!-- TagInput Component -->
        <div class="mb-3">
          <label class="form-label">Etiquetas <span class="text-danger">*</span></label>
          <TagInput v-model="selectedTags" search-only />
          <div v-if="!selectedTags || selectedTags.length === 0" class="alert alert-warning mt-2 mb-0">
            <i class="bi bi-exclamation-triangle"></i>
            <strong>Se requiere mínimo una etiqueta.</strong>
            <div class="mt-2">
              <p class="mb-2">Si no encuentras una etiqueta adecuada, ve a la sección <strong>Administrar Etiquetas</strong> para crearla.</p>
              <router-link to="/tags" class="btn btn-sm btn-warning">
                <i class="bi bi-plus-circle"></i> Crear etiqueta
              </router-link>
            </div>
          </div>
        </div>

        <div class="d-grid gap-2">
          <button type="submit" class="btn btn-primary btn-lg" :disabled="isSubmitting || !!titleError || !selectedTags || selectedTags.length === 0">
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
const errors = ref<string[]>([])
const successMessage = ref('')
const titleError = ref('')

const { createTask } = useTasks()

function validateTitle() {
  const trimmed = title.value.trim()
  if (!trimmed) {
    titleError.value = 'El título es requerido'
  } else if (trimmed.length < 3) {
    titleError.value = 'El título debe tener al menos 3 caracteres'
  } else {
    titleError.value = ''
  }
}

async function onSubmit() {
  errors.value = []
  validateTitle()

  if (titleError.value) {
    errors.value.push(titleError.value)
    return
  }

  if (!title.value.trim()) {
    errors.value.push('El título no puede estar vacío')
    return
  }

  if (!selectedTags.value || selectedTags.value.length === 0) {
    errors.value.push('Debes seleccionar al menos una etiqueta para la tarea')
    return
  }

  isSubmitting.value = true
  try {
    await createTask({
      title: title.value.trim(),
      description: description.value.trim(),
      tags: selectedTags.value
    })
    successMessage.value = '✓ Tarea creada exitosamente'
    title.value = ''
    description.value = ''
    selectedTags.value = []
    
    // Scroll hacia arriba para mostrar el mensaje de éxito
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    if (props.onCreated) props.onCreated()
  } catch (error: any) {
    errors.value.push(error.message || 'Error al crear la tarea')
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
  box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.25);
}

.form-control.is-invalid,
textarea.is-invalid {
  border-color: #dc2626;
}

.form-control.is-invalid:focus,
textarea.is-invalid:focus {
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

.alert-danger .btn-close {
  filter: invert(0.4);
}

.alert-success {
  background-color: #dcfce7;
  border-left-color: #22ab99;
  color: #166534;
}

.alert-success .btn-close {
  filter: invert(0.4);
}
</style>
