<template>
  <div class="filters-row">
    <div class="filter-btn" @click="$emit('openRegionModal')">
      Region
      <span :class="['filter-arrow', { open: openFilter === 'region' }]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="#131712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div class="filter-btn" @click="$emit('openTypeModal')">
      Type
      <span :class="['filter-arrow', { open: openFilter === 'type' }]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="#131712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FiltersRow',
  props: {
    openFilter: {
      type: String,
      default: null
    }
  },
  emits: ['openRegionModal', 'openTypeModal']
}
</script>

<style scoped>
.filters-row {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #131712;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #e9ecef;
}

.filter-arrow {
  transition: transform 0.2s ease;
}

.filter-arrow.open {
  transform: rotate(180deg);
}
</style> 