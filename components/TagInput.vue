<template>
  <div class="tag-input">
    <!-- Mostrar tags seleccionados -->
    <div v-if="selectedTags.length > 0" class="mb-3">
      <label class="form-label">Etiquetas seleccionadas</label>
      <div class="selected-tags">
        <span 
          v-for="tagName in selectedTags" 
          :key="tagName" 
          class="badge me-2 mb-2"
          :style="{ backgroundColor: getTagColorByName(tagName) }"
        >
          {{ tagName }}
          <button
            type="button"
            class="btn-close btn-close-white ms-1"
            @click="removeTag(tagName)"
            style="font-size: 0.7rem"
          ></button>
        </span>
      </div>
    </div>

    <!-- Input para buscar/crear tags -->
    <div class="mb-3">
      <label for="tag-search" class="form-label">Agregar etiqueta</label>
      <div class="input-group">
        <input
          id="tag-search"
          v-model="searchInput"
          type="text"
          class="form-control"
          placeholder="Buscar etiqueta..."
          @keyup.enter="!searchOnly && addTag()"
          @input="updateSuggestions"
        />
        <button
          v-if="!searchOnly"
          class="btn btn-success"
          type="button"
          @click="addTag"
          :disabled="!searchInput.trim()"
        >
          <i class="bi bi-plus"></i> Agregar
        </button>
      </div>

      <!-- Sugerencias de tags existentes -->
      <div v-if="suggestions.length > 0" class="suggestions mt-2">
        <small class="text-muted d-block mb-2">Tags disponibles:</small>
        <button
          v-for="suggestion in suggestions"
          :key="suggestion._id"
          type="button"
          class="btn btn-sm me-2 mb-2"
          :style="{ 
            backgroundColor: suggestion.color || '#22ab99',
            color: 'white',
            border: 'none'
          }"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.name }}
        </button>
      </div>

      <!-- Mensaje cuando no hay resultados en modo search-only -->
      <div v-else-if="searchOnly && searchInput.trim()" class="alert alert-warning mt-2 mb-0">
        <i class="bi bi-info-circle"></i>
        <strong>No se encontraron etiquetas.</strong>
        <div class="mt-2">
          <p class="mb-2">¿No encuentras la etiqueta que buscas? Ve a la sección de <strong>Administrar Etiquetas</strong> para crearla.</p>
          <router-link to="/tags" class="btn btn-sm btn-warning">
            <i class="bi bi-tags"></i> Ir a Etiquetas
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Tag {
  _id: string
  name: string
  color?: string
}

interface Props {
  modelValue?: string[]
  searchOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  searchOnly: false
})

const emit = defineEmits<{
  'update:modelValue': [tags: string[]]
}>()

const { allTags, fetchAllTags, getTagColorByName } = useTasks()
const selectedTags = ref<string[]>(props.modelValue)
const searchInput = ref('')

onMounted(async () => {
  await fetchAllTags()
})

const suggestions = computed(() => {
  if (!searchInput.value.trim()) {
    return allTags.value.filter(t => !selectedTags.value.includes(t.name))
  }

  const search = searchInput.value.toLowerCase()
  return allTags.value.filter(
    t => t.name.toLowerCase().includes(search) && !selectedTags.value.includes(t.name)
  )
})

function selectSuggestion(tag: Tag) {
  selectedTags.value.push(tag.name)
  searchInput.value = ''
  emit('update:modelValue', selectedTags.value)
}

async function addTag() {
  // En modo search-only, no permitir crear tags nuevos
  if (props.searchOnly) return

  const tagName = searchInput.value.trim()
  if (!tagName) return

  // Evitar duplicados
  if (selectedTags.value.includes(tagName)) {
    searchInput.value = ''
    return
  }

  selectedTags.value.push(tagName)
  searchInput.value = ''
  emit('update:modelValue', selectedTags.value)
}

function removeTag(tagName: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tagName)
  emit('update:modelValue', selectedTags.value)
}

function updateSuggestions() {
  // Las sugerencias se actualizan automáticamente por el computed
}
</script>

<style scoped>
.tag-input {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #22ab99 !important;
}

.btn-close-white {
  cursor: pointer;
  opacity: 0.7;
}

.btn-close-white:hover {
  opacity: 1;
}

.suggestions {
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

.btn-outline-success:hover {
  background-color: #22ab99;
  border-color: #22ab99;
  color: white !important;
}
</style>
