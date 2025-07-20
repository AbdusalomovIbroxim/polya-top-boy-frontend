<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-popup">
      <div class="modal-header">
        <span>{{ title }}</span>
        <button class="modal-close" @click="$emit('close')">×</button>
      </div>
      <div v-if="loading" class="modal-list-loading">Загрузка...</div>
      <ul v-else class="modal-list">
        <li 
          v-for="item in items" 
          :key="item.id" 
          class="modal-list-item" 
          @click="$emit('select', item)"
        >
          {{ item.name_ru || item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'select']
}
</script>

<style src="../assets/css/components/filter-modal.css"></style> 