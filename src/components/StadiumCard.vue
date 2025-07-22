<template>
  <div class="stadium-card" @click="$emit('click')">
    <div
      class="stadium-card__image"
      :style="{ backgroundImage: imageUrl ? `url(${imageUrl})` : '' }"
    ></div>
    <div class="stadium-card__content">
      <div class="stadium-card__title">{{ stadium.name }}</div>
      <div class="stadium-card__desc">{{ stadium.description }}</div>
      <div class="stadium-card__info">
        <div>
          <div class="stadium-card__price">
            Цена: {{ price }}сум/час
            <span v-if="stadium.city">· {{ stadium.city }}</span>
          </div>
        </div>
        <button class="stadium-card__btn" @click.stop="$emit('open')">Открыть</button>
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
  computed: {
    imageUrl() {
      return this.stadium.images && this.stadium.images.length
        ? this.stadium.images[0].image
        : '';
    },
    price() {
      return this.formatPrice(this.stadium.price_per_hour);
    }
  },
  methods: {
    formatPrice(value) {
      if (!value) return '-';
      const num = parseInt(value, 10);
      if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + ' млн';
      if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + ' тыс';
      return num.toLocaleString('ru-RU');
    }
  }
};
</script>

<style>
.stadium-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  background: #fff;
  max-width: 700px;
  width: 90%;
  cursor: pointer;
  transition: box-shadow 0.2s;
  box-sizing: border-box;
}
/* .stadium-card:hover {
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
} */
.stadium-card__image {
  width: 100%;
  height: 200px;
  border-radius: 1rem;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f1f1f1;
  box-sizing: border-box;
}
.stadium-card__content {
  flex: 1;
  /* padding: 16px 20px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.stadium-card__title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #131712;
  margin-bottom: 4px;
}
.stadium-card__desc {
  color: #6d8566;
  font-size: 1rem;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.6em;
}
.stadium-card__info {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}
.stadium-card__price {
  color: #2d4a2d;
  font-size: 1rem;
  margin-bottom: 2px;
}
.stadium-card__address {
  color: #888;
  font-size: 0.95rem;
}
.stadium-card__btn {
  background: #53d22c;
  color: #131712;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.stadium-card__btn:hover {
  background: #3bb01a;
}

</style> 