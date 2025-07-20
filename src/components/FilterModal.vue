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

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-popup {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #131712;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6d8566;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: #131712;
}

.modal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-list-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  cursor: pointer;
  transition: background 0.2s ease;
  color: #131712;
}

.modal-list-item:hover {
  background: #f8f9fa;
}

.modal-list-item:last-child {
  border-bottom: none;
}

.modal-list-loading {
  padding: 2rem;
  text-align: center;
  color: #6d8566;
}
</style> 