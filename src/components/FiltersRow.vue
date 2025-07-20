<template>
  <div class="filters-row">
    <div class="filter-btn" @click="$emit('openRegionDropdown', $event)">
      Region
      <span :class="['filter-arrow', { open: openFilter === 'region' }]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" stroke="#131712" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </div>
    <div class="filter-btn" @click="$emit('openTypeDropdown', $event)">
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
  emits: ['openRegionDropdown', 'openTypeDropdown']
}
</script>

<style src="../assets/css/components/filters-row.css"></style> 