<template>
  <div class="stadium-card" @click="$emit('click', stadium)">
    <div class="stadium-slider">
      <template v-if="images.length > 0">
        <img
          v-for="(img, idx) in images"
          :key="idx"
          :src="img.image || ''"
          class="slider-img"
          :alt="`${stadium.name} photo ${idx + 1}`"
        />
      </template>
      <div v-else class="slider-img slider-img-placeholder">Нет фото</div>
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
    }
  }
}
</script>

<style src="../assets/css/components/stadium-card.css"></style> 