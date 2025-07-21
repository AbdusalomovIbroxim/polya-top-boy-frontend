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
        <div class="stadium-info">
          <div class="stadium-price">
            <span class="label">Цена:</span>
            <span class="value" :title="formatPrice(stadium.price_per_hour) + ' сум/час'">
              {{ formatPrice(stadium.price_per_hour) }} сум/час
            </span>
          </div>
          <div class="stadium-rating">
            <span class="star">⭐</span>
            <span>4.8 (120)</span>
          </div>
        </div>
        <button class="stadium-open-btn" @click.stop="$emit('open', stadium)">
          Открыть
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StadiumCard',
  props: {
    stadium: { type: Object, required: true }
  },
  emits: ['click', 'open'],
  data() {
    return {
      currentImage: 0,
      dragStartX: 0,
      dragCurrentX: 0,
      isDragging: false,
      dragOffset: 0,
      mouseDown: false
    }
  },
  computed: {
    images() {
      return Array.isArray(this.stadium.images) ? this.stadium.images : [];
    },
    trackStyle() {
      // const count = this.images.length || 1;
      const percent = -this.currentImage * 100;
      let drag = 0;
      if (this.isDragging && this.dragOffset) {
        drag = (this.dragOffset / this.$el.offsetWidth) * 100;
      }
      return {
        // width: count * 100 + '%',
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
    // Touch
    onTouchStart(e) {
      this.dragStartX = e.touches[0].clientX;
      this.isDragging = true;
      this.dragOffset = 0;
    },
    onTouchMove(e) {
      if (!this.isDragging) return;
      this.dragCurrentX = e.touches[0].clientX;
      const dx = this.dragCurrentX - this.dragStartX;
      if ((this.currentImage === 0 && dx > 0) || (this.currentImage === this.images.length - 1 && dx < 0)) {
        this.dragOffset = 0;
      } else {
        this.dragOffset = dx;
      }
    },
    onTouchEnd() {
      if (!this.isDragging) return;
      const dx = this.dragCurrentX - this.dragStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0 && this.currentImage < this.images.length - 1) this.nextImage();
        else if (dx > 0 && this.currentImage > 0) this.prevImage();
      }
      this.isDragging = false;
      this.dragOffset = 0;
      this.dragStartX = 0;
      this.dragCurrentX = 0;
    },
    // Mouse
    onMouseDown(e) {
      this.mouseDown = true;
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.dragOffset = 0;
    },
    onMouseMove(e) {
      if (!this.mouseDown || !this.isDragging) return;
      this.dragCurrentX = e.clientX;
      const dx = this.dragCurrentX - this.dragStartX;
      if ((this.currentImage === 0 && dx > 0) || (this.currentImage === this.images.length - 1 && dx < 0)) {
        this.dragOffset = 0;
      } else {
        this.dragOffset = dx;
      }
    },
    onMouseUp() {
      if (!this.mouseDown || !this.isDragging) return;
      const dx = this.dragCurrentX - this.dragStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0 && this.currentImage < this.images.length - 1) this.nextImage();
        else if (dx > 0 && this.currentImage > 0) this.prevImage();
      }
      this.mouseDown = false;
      this.isDragging = false;
      this.dragOffset = 0;
      this.dragStartX = 0;
      this.dragCurrentX = 0;
    }
  }
}
</script>

<style src="../assets/css/components/stadium-card.css"></style> 