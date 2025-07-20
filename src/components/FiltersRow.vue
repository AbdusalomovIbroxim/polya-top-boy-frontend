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
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #e9ecef;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #131712;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.filter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.filter-btn:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  border-color: #6d8566;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(109, 133, 102, 0.15);
}

.filter-btn:hover::before {
  left: 100%;
}

.filter-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-arrow {
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(109, 133, 102, 0.1);
}

.filter-arrow.open {
  transform: rotate(180deg);
  background: rgba(109, 133, 102, 0.2);
}

.filter-btn:hover .filter-arrow {
  background: rgba(109, 133, 102, 0.2);
}
</style> 