<template>
  <div class="stadium-card" @click="$emit('click', stadium)">
    <div class="stadium-slider" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <button v-if="images.length > 1" class="slider-arrow left" @click.stop="prevImage">&#8592;</button>
      <div class="slider-img-wrap">
        <img
          v-if="images.length > 0"
          :src="images[currentImage]?.image || ''"
          class="slider-img"
          :alt="`${stadium.name} photo ${currentImage + 1}`"
        />
        <div v-else class="slider-img slider-img-placeholder">Нет фото</div>
      </div>
      <button v-if="images.length > 1" class="slider-arrow right" @click.stop="nextImage">&#8594;</button>
    </div>
    <div class="stadium-content">
      <p class="stadium-title">{{ stadium.name }}</p>
      <p class="stadium-desc">{{ stadium.description }}</p>
      <div class="stadium-info-row">
        <div class="stadium-info">
          <p>Narxi: {{ formatPrice(stadium.price_per_hour) }} so'm/soat</p>
          <p class="rating">
            <span class="star">⭐</span>
            4.8 (120 reviews)
          </p>
        </div>
        <button class="stadium-open-btn" @click.stop="$emit('open', stadium)">
          <span>Open</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StadiumCard',
  props: {
    stadium: {
      type: Object,
      required: true
    }
  },
  emits: ['click', 'open'],
  data() {
    return {
      currentImage: 0,
      touchStartX: 0,
      touchEndX: 0
    }
  },
  computed: {
    images() {
      return Array.isArray(this.stadium.images) ? this.stadium.images : [];
    }
  },
  methods: {
    formatPrice(price) {
      if (!price) return '-';
      const num = Math.round(Number(price) * 3000);
      return num.toLocaleString('ru-RU');
    },
    prevImage(e) {
      e && e.stopPropagation();
      if (this.currentImage > 0) {
        this.currentImage--;
      } else {
        this.currentImage = this.images.length - 1;
      }
    },
    nextImage(e) {
      e && e.stopPropagation();
      if (this.currentImage < this.images.length - 1) {
        this.currentImage++;
      } else {
        this.currentImage = 0;
      }
    },
    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
    },
    onTouchMove(e) {
      this.touchEndX = e.touches[0].clientX;
    },
    onTouchEnd() {
      const dx = this.touchEndX - this.touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) {
          this.nextImage();
        } else {
          this.prevImage();
        }
      }
      this.touchStartX = 0;
      this.touchEndX = 0;
    }
  }
}
</script>

<style src="../assets/css/components/stadium-card.css"></style> 