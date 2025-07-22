<template>
  <div class="stadium-page" v-if="stadium">
    <div class="gallery-block" v-if="stadium.images && stadium.images.length">
      <img :src="activeImage" alt="stadium" class="main-image" />
      <div class="gallery-thumbs">
        <img
          v-for="img in stadium.images"
          :key="img.id"
          :src="img.image"
          :alt="'thumb-' + img.id"
          :class="['thumb', { active: img.image === activeImage }]"
          @click="activeImage = img.image"
        />
      </div>
    </div>
    <h1 class="stadium-title">{{ stadium.name }}</h1>
    <div class="info-row">
      <span class="price">{{ formatPrice(stadium.price_per_hour) }} сум/час</span>
      <span class="address"><span class="icon">📍</span>{{ stadium.address }}</span>
    </div>
    <div class="map-block" v-if="stadium.yandex_map_url">
      <iframe
        :src="stadium.yandex_map_url"
        width="100%"
        height="200"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <p class="description">{{ stadium.description }}</p>
    <button class="book-btn">Забронировать</button>
  </div>
  <div v-else class="stadium-loading">Загрузка...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getSportVenue } from '../api/fields';

const route = useRoute();
const stadium = ref(null);
const activeImage = ref('');

function formatPrice(value) {
  if (!value) return '-';
  const num = parseInt(value, 10);
  if (num >= 1000000) return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + ' млн';
  if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + ' тыс';
  return num.toLocaleString('ru-RU');
}

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    try {
      stadium.value = await getSportVenue(id);
      if (stadium.value.images && stadium.value.images.length) {
        activeImage.value = stadium.value.images[0].image;
      }
    } catch (e) {
      stadium.value = null;
    }
  }
});
</script>

<style scoped>
.stadium-page {
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
}
.gallery-block {
  margin-bottom: 18px;
}
.main-image {
  width: 100%;
  max-height: 260px;
  object-fit: cover;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  margin-bottom: 10px;
  background: #f1f1f1;
}
.gallery-thumbs {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.thumb {
  width: 60px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  border: 2px solid transparent;
  transition: border 0.2s, opacity 0.2s;
}
.thumb.active {
  opacity: 1;
  border: 2px solid #36d900;
}
.stadium-title {
  font-size: 1.5em;
  font-weight: 700;
  margin: 10px 0 8px 0;
  color: #131712;
}
.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  margin-bottom: 10px;
  font-size: 1.08em;
}
.price {
  color: #36d900;
  font-weight: 600;
}
.address {
  color: #6d8566;
  display: flex;
  align-items: center;
}
.address .icon {
  margin-right: 6px;
}
.map-block {
  margin: 18px 0 10px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.description {
  margin: 18px 0 10px 0;
  font-size: 1.1em;
  color: #222;
  line-height: 1.5;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 12px 16px;
}
.book-btn {
  background: #36d900;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 14px 24px;
  font-size: 1.1em;
  cursor: pointer;
  width: 100%;
  margin-top: 18px;
  transition: background 0.2s;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(54,217,0,0.07);
}
.book-btn:hover {
  background: #28a700;
}
.stadium-loading {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}
</style> 