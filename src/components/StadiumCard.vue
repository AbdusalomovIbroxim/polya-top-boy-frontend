<template>
  <div class="stadium-card" @click="$emit('click', stadium)">
    <div
      class="stadium-slider"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div class="slider-track" :style="trackStyle">
        <template v-if="images.length">
          <img
            v-for="(img, idx) in images"
            :key="idx"
            :src="img.image || ''"
            class="slider-img"
            :alt="`${stadium.name} photo ${idx + 1}`"
            draggable="false"
          />
        </template>
        <div v-else class="slider-img slider-img-placeholder">Нет фото</div>
      </div>
    </div>
    <div class="stadium-content">
      <div class="stadium-title">{{ stadium.name }}</div>
      <div class="stadium-desc" v-if="stadium.description">{{ stadium.description }}</div>
      <div class="stadium-info-row">
        <div class="stadium-info-left">
          <span class="price">{{ shortPrice(stadium.price_per_hour) }}/час</span>
          <span class="stadium-rating">
            <span class="star">⭐</span>
            4.8
          </span>
        </div>
        <button class="stadium-open-btn" @click.stop="router.push({ name: 'stadium', params: { id: stadium.id } })">
          Открыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({ stadium: Object })
</script>

<style src="../assets/css/components/stadium-card.css"></style> 