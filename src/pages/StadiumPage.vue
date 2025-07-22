<template>
  <div class="stadium-page" v-if="stadium">
    <div class="stadium-images" v-if="stadium.images && stadium.images.length">
      <img :src="stadium.images[0].image" alt="stadium" class="main-image" />
    </div>
    <h1>{{ stadium.name }}</h1>
    <p class="description">{{ stadium.description }}</p>
    <div class="map-block" v-if="stadium.yandex_map_url">
      <iframe
        :src="stadium.yandex_map_url"
        width="100%"
        height="200"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div class="address-block">
      <span class="icon">📍</span>
      <span>{{ stadium.address }}</span>
    </div>
    <div class="price-block">
      <span>Цена за час: </span>
      <b>{{ stadium.price_per_hour }} сум</b>
    </div>
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

onMounted(async () => {
  const id = route.params.id;
  if (id) {
    try {
      stadium.value = await getSportVenue(id);
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
}
.stadium-images {
  text-align: center;
  margin-bottom: 16px;
}
.main-image {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 12px;
}
.description {
  margin: 16px 0;
  font-size: 1.1em;
}
.map-block {
  margin: 16px 0;
}
.address-block {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 1.05em;
}
.address-block .icon {
  margin-right: 8px;
}
.price-block {
  margin-bottom: 20px;
  font-size: 1.1em;
}
.book-btn {
  background: #36d900;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1.1em;
  cursor: pointer;
  width: 100%;
  margin-top: 16px;
  transition: background 0.2s;
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