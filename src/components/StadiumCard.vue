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
      <div
        class="slider-track"
        :style="{
          ...trackStyle,
          width: images.length ? images.length * 100 + '%' : '100%'
        }"
      >
        <img
          v-for="(img, idx) in images"
          :key="idx"
          :src="img.image || ''"
          class="slider-img"
          :alt="`${stadium.name} photo ${idx + 1}`"
          draggable="false"
        />
      </div>
      <div class="slider-indicators">
        <span v-for="(img, idx) in images" :key="idx" :class="['slider-indicator', { active: idx === currentImage }]" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({ stadium: Object })

const images = computed(() => Array.isArray(props.stadium?.images) ? props.stadium.images : [])
const currentImage = ref(0)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentImage.value * 100}%)`,
  transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)'
}))

function shortPrice(price) {
  if (!price) return '-';
  const num = Number(price);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace('.0', '') + ' млн';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + ' тыс';
  return num.toLocaleString('ru-RU');
}

// Свайп/drag logic
let dragStartX = 0
let dragCurrentX = 0
let isDragging = false
let dragOffset = 0
let mouseDown = false
let touchStartX = 0
let touchStartY = 0
let isHorizontalSwipe = null
let hasSwiped = false

function onTouchStart(e) {
  dragStartX = e.touches[0].clientX;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  isDragging = true;
  isHorizontalSwipe = null;
  dragOffset = 0;
  hasSwiped = false;
}
function onTouchMove(e) {
  if (!isDragging) return;
  const x = e.touches[0].clientX;
  const y = e.touches[0].clientY;
  const dx = x - touchStartX;
  const dy = y - touchStartY;
  if (isHorizontalSwipe === null) {
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      isHorizontalSwipe = Math.abs(dx) > Math.abs(dy);
    }
  }
  if (isHorizontalSwipe === false) {
    isDragging = false;
    dragOffset = 0;
    return;
  }
  dragCurrentX = x;
  dragOffset = dragCurrentX - dragStartX;
}
function onTouchEnd() {
  if (!isDragging || hasSwiped) return;
  const dx = dragCurrentX - dragStartX;
  if (Math.abs(dx) > 40) {
    if (dx < 0 && currentImage.value < images.value.length - 1) currentImage.value++;
    else if (dx > 0 && currentImage.value > 0) currentImage.value--;
    hasSwiped = true;
  }
  isDragging = false;
  dragOffset = 0;
  dragStartX = 0;
  dragCurrentX = 0;
}
function onMouseDown(e) {
  mouseDown = true;
  isDragging = true;
  dragStartX = e.clientX;
  dragOffset = 0;
  hasSwiped = false;
}
function onMouseMove(e) {
  if (!mouseDown || !isDragging) return;
  dragCurrentX = e.clientX;
  dragOffset = dragCurrentX - dragStartX;
}
function onMouseUp() {
  if (!mouseDown || !isDragging || hasSwiped) return;
  const dx = dragCurrentX - dragStartX;
  if (Math.abs(dx) > 40) {
    if (dx < 0 && currentImage.value < images.value.length - 1) currentImage.value++;
    else if (dx > 0 && currentImage.value > 0) currentImage.value--;
    hasSwiped = true;
  }
  mouseDown = false;
  isDragging = false;
  dragOffset = 0;
  dragStartX = 0;
  dragCurrentX = 0;
}
</script>

<style src="../assets/css/components/stadium-card.css"></style> 