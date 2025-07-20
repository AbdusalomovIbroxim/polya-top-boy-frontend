<template>
  <div v-if="loading" class="stadium-list">
    <StadiumCardSkeleton v-for="n in 4" :key="n" />
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
import StadiumCardSkeleton from './StadiumCardSkeleton.vue'

export default {
  name: 'StadiumList',
  components: {
    StadiumCard,
    StadiumCardSkeleton
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

<style src="../assets/css/components/stadium-list.css"></style> 