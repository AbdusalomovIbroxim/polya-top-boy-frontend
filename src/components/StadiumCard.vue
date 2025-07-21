<template>
  <div class="stadium-card-new">
    <div class="stadium-card-img-wrap">
      <img v-if="images.length" :src="images[0].image" class="stadium-card-img" :alt="stadium.name" />
      <div v-else class="stadium-card-img stadium-card-img-placeholder">Нет фото</div>
    </div>
    <div class="stadium-card-content">
      <div class="stadium-card-title">{{ stadium.name }}</div>
      <div class="stadium-card-desc" v-if="stadium.description">{{ stadium.description }}</div>
      <div class="stadium-card-info-row">
        <div class="stadium-card-info-left">
          <span class="stadium-card-price">{{ shortPrice(stadium.price_per_hour) }}/час</span>
          <span class="stadium-card-rating">
            <span class="star">⭐</span>
            4.8
          </span>
        </div>
        <button class="stadium-card-open-btn" @click.stop="router.push({ name: 'stadium', params: { id: stadium.id } })">
          Открыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({ stadium: Object })

const images = computed(() => Array.isArray(props.stadium?.images) ? props.stadium.images : [])

function shortPrice(price) {
  if (!price) return '-';
  const num = Number(price);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + ' млн';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + ' тыс';
  return num.toLocaleString('ru-RU');
}
</script>

<style src="../assets/css/components/stadium-card.css"></style> 