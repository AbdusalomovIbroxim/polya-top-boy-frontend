<template>
  <div v-if="loading" class="stadium-list">
    <div class="loading">Загрузка...</div>
  </div>
  <div v-else class="stadium-list">
    <StadiumCard 
      v-for="stadium in stadiums" 
      :key="stadium.id" 
      :stadium="stadium"
      @click="handleStadiumClick"
      @open="handleStadiumOpen"
    />
  </div>
</template>

<script>
import StadiumCard from './StadiumCard.vue'

export default {
  name: 'StadiumList',
  components: {
    StadiumCard
  },
  props: {
    stadiums: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['stadium-click', 'stadium-open'],
  methods: {
    handleStadiumClick(stadium) {
      this.$emit('stadium-click', stadium)
    },
    handleStadiumOpen(stadium) {
      this.$emit('stadium-open', stadium)
    }
  }
}
</script>

<style src="@/assets/css/home.css">

.loading {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #6d8566;
  font-size: 1rem;
}
</style> 