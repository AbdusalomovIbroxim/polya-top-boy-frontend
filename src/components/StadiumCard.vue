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

<style scoped>
.stadium-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stadium-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stadium-img {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f8f9fa;
}

.stadium-content {
  padding: 1rem;
}

.stadium-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #131712;
}

.stadium-desc {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #6d8566;
  line-height: 1.4;
}

.stadium-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stadium-info p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: #131712;
}

.stadium-info p:last-child {
  color: #6d8566;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6d8566;
}

.star {
  font-size: 0.9rem;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.stadium-open-btn {
  padding: 0.5rem 1rem;
  background: #131712;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.stadium-open-btn:hover {
  background: #2a2a2a;
}
</style> 