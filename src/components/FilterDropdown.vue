<template>
  <div class="filter-dropdown-root" ref="dropdownRoot">
    <button
      class="filter-dropdown-btn"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      type="button"
    >
      <span>{{ selectedLabel }}</span>
      <svg class="dropdown-arrow" width="18" height="18" viewBox="0 0 20 20">
        <path d="M6 8l4 4 4-4" stroke="#131712" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    </button>
    <transition name="dropdown-fade">
      <ul
        v-if="isOpen"
        class="filter-dropdown-listbox"
        ref="dropdownList"
      >
        <li
          v-for="item in items"
          :key="item.id || item.value || item"
          :class="['filter-dropdown-option', { selected: isSelected(item) }]"
          @click="select(item)"
        >
          {{ item.name_ru || item.name || item }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: [String, Number, Object], default: '' },
  placeholder: { type: String, default: 'Выбрать...' }
});
const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const dropdownRoot = ref(null);

const selectedLabel = computed(() => {
  if (!props.modelValue || props.modelValue === '' || props.modelValue == null) return props.placeholder;
  const found = props.items.find(
    item => (item.id && item.id === props.modelValue) || (item.value && item.value === props.modelValue) || item === props.modelValue
  );
  return found ? (found.name_ru || found.name || found) : props.placeholder;
});

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function select(item) {
  let value = item.id ?? item.value ?? item;
  emit('update:modelValue', value);
  isOpen.value = false;
}

function isSelected(item) {
  return (
    (item.id && item.id === props.modelValue) ||
    (item.value && item.value === props.modelValue) ||
    item === props.modelValue
  );
}

function handleClickOutside(e) {
  if (dropdownRoot.value && !dropdownRoot.value.contains(e.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(() => props.modelValue, () => {
  // Закрывать дропдаун при смене значения извне
  isOpen.value = false;
});
</script>

<!-- Стили смотри в filters-row.css --> 