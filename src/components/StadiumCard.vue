<template>
  <div class="stadium-card" @click="$emit('click', stadium)">
    <div class="stadium-img" :style="{ backgroundImage: 'url(' + (stadium.images?.[0]?.image || '') + ')' }"></div>
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