<template>
  <div class="stadium-card" @click="$emit('click', stadium)">
    <div class="stadium-slider"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div class="slider-img-track" :style="trackStyle">
        <img
          v-for="(img, idx) in images"
          :key="idx"
          :src="img.image || ''"
          class="slider-img"
          :alt="`${stadium.name} photo ${idx + 1}`"
        />
        <div v-if="images.length === 0" class="slider-img slider-img-placeholder">Нет фото</div>
      </div>
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
      touchEndX: 0,
      mouseDown: false,
      mouseStartX: 0,
      mouseEndX: 0,
      isDragging: false,
      dragOffset: 0
    }
  },
  computed: {
    images() {
      return Array.isArray(this.stadium.images) ? this.stadium.images : [];
    },
    trackStyle() {
      const count = this.images.length || 1;
      const percent = -this.currentImage * 100;
      let drag = 0;
      if (this.isDragging && this.dragOffset) {
        drag = (this.dragOffset / this.$el.offsetWidth) * 100;
      }
      return {
        width: count * 100 + '%',
        display: 'flex',
        transform: `translateX(calc(${percent}% + ${drag}%) )`,
        transition: this.isDragging ? 'none' : 'transform 0.35s cubic-bezier(.4,0,.2,1)'
      };
    }
  },
  methods: {
    formatPrice(price) {
      if (!price) return '-';
      const num = Math.round(Number(price) * 3000);
      return num.toLocaleString('ru-RU');
    },
    nextImage() {
      if (this.currentImage < this.images.length - 1) {
        this.currentImage++;
      }
    },
    prevImage() {
      if (this.currentImage > 0) {
        this.currentImage--;
      }
    },
    // Touch events
    onTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.isDragging = true;
      this.dragOffset = 0;
    },
    onTouchMove(e) {
      if (!this.isDragging) return;
      this.touchEndX = e.touches[0].clientX;
      this.dragOffset = this.touchEndX - this.touchStartX;
    },
    onTouchEnd() {
      if (!this.isDragging) return;
      const dx = this.touchEndX - this.touchStartX;

      if (Math.abs(dx) > 40) {
        if (dx < 0 && this.currentImage < this.images.length - 1) {
          this.nextImage();
        } else if (dx > 0 && this.currentImage > 0) {
          this.prevImage();
        }
      }

      this.isDragging = false;
      this.dragOffset = 0;
      this.touchStartX = 0;
      this.touchEndX = 0;
    },
    // Mouse events
    onMouseDown(e) {
      this.mouseDown = true;
      this.isDragging = true;
      this.mouseStartX = e.clientX;
      this.dragOffset = 0;
    },
    onMouseMove(e) {
      if (!this.mouseDown || !this.isDragging) return;
      this.mouseEndX = e.clientX;
      this.dragOffset = this.mouseEndX - this.mouseStartX;
    },
    onMouseUp() {
      if (!this.mouseDown || !this.isDragging) return;
      const dx = this.mouseEndX - this.mouseStartX;

      if (Math.abs(dx) > 40) {
        if (dx < 0 && this.currentImage < this.images.length - 1) {
          this.nextImage();
        } else if (dx > 0 && this.currentImage > 0) {
          this.prevImage();
        }
      }

      this.mouseDown = false;
      this.isDragging = false;
      this.dragOffset = 0;
      this.mouseStartX = 0;
      this.mouseEndX = 0;
    }
  }
}
</script>

<style src="../assets/css/components/stadium-card.css"></style> 