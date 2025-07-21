<template>
  <div class="stadium-list">
    <div v-if="loading" class="stadium-list__loading">Загрузка...</div>
    <div v-else-if="stadiums.length === 0" class="stadium-list__empty">Нет площадок</div>
    <div v-else class="stadium-list__cards">
      <StadiumCard
        v-for="stadium in stadiums"
        :key="stadium.id"
        :stadium="stadium"
        @click="$emit('stadium-click', stadium)"
        @open="$emit('stadium-open', stadium)"
      />
    </div>
  </div>
</template>

<script>
import StadiumCard from './StadiumCard.vue';

export default {
  name: 'StadiumList',
  components: { StadiumCard },
  props: {
    stadiums: { type: Array, required: true },
    loading: { type: Boolean, default: false }
  }
};
</script>

<style>
.stadium-list {
  padding: 24px 0;
}
.stadium-list__loading,
.stadium-list__empty {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin: 40px 0;
}
.stadium-list__cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style> 