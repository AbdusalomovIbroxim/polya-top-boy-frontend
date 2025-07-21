<template>
  <div class="stadium-root">
    <!-- Header -->
    <div class="stadium-header">
      <button class="back-btn" @click="goBack">
        <!-- SVG стрелка -->
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path></svg>
      </button>
      <button class="share-btn">
        <!-- SVG share -->
        <svg width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"></path></svg>
      </button>
    </div>
    <!-- Gallery -->
    <div class="stadium-gallery">
      <div class="gallery-slider">
        <div v-for="(img, idx) in images" :key="img.id" class="gallery-slide" :class="{active: idx === currentImg}">
          <img :src="img.image" alt="stadium" />
        </div>
      </div>
      <div class="gallery-indicators">
        <span v-for="(img, idx) in images" :key="img.id" :class="{active: idx === currentImg}"></span>
      </div>
    </div>
    <!-- Info -->
    <div class="stadium-info">
      <h1 class="stadium-title">{{ stadium.name }}</h1>
      <p class="stadium-desc">{{ stadium.description }}</p>
      <div class="stadium-address">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 256 256"><path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path></svg>
        <span>{{ stadium.address }}</span>
      </div>
      <div class="stadium-map">
        <iframe v-if="stadium.latitude && stadium.longitude" :src="yandexMapSrc" frameborder="0" allowfullscreen></iframe>
        <a v-if="stadium.yandex_map_url" :href="stadium.yandex_map_url" target="_blank" class="map-link">Открыть в Яндекс.Картах</a>
      </div>
      <div class="stadium-price">
        <span>Цена за час:</span>
        <b>{{ stadium.price_per_hour }} сум</b>
      </div>
    </div>
    <!-- Book Now -->
    <div class="book-btn-wrap">
      <button class="book-btn" @click="goToBooking">Book Now</button>
    </div>
    <!-- Reviews -->
    <div class="stadium-reviews">
      <h2>Отзывы</h2>
      <div v-for="review in reviews" :key="review.id" class="review">
        <div class="review-header">
          <img :src="review.avatar" class="review-avatar" />
          <div>
            <div class="review-user">{{ review.user }}</div>
            <div class="review-date">{{ review.date }}</div>
          </div>
          <div class="review-rating">
            <span v-for="n in 5" :key="n" :class="{filled: n <= review.rating}">★</span>
          </div>
        </div>
        <div class="review-text">{{ review.text }}</div>
        <div class="review-likes">
          <span>👍 {{ review.likes }}</span>
          <span>👎 {{ review.dislikes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'StadiumPage',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const stadium = ref({});
    const images = ref([]);
    const currentImg = ref(0);
    const reviews = ref([
      {
        id: 1,
        user: 'Ethan Carter',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5,
        date: '2 weeks ago',
        text: 'Great field, well-maintained and perfect for a friendly game. The lighting was excellent for our evening match.',
        likes: 10,
        dislikes: 2
      },
      {
        id: 2,
        user: 'Olivia Bennett',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 4,
        date: '1 month ago',
        text: 'The field was in good condition, but the parking was a bit limited. Overall, a positive experience.',
        likes: 5,
        dislikes: 1
      }
    ]);

    const yandexMapSrc = ref('');

    async function fetchStadium() {
      const id = route.params.id;
      const { data } = await axios.get(`/sport-venues/${id}/`);
      stadium.value = data;
      images.value = data.images || [];
      if (data.latitude && data.longitude) {
        yandexMapSrc.value = `https://yandex.ru/map-widget/v1/?ll=${data.longitude},${data.latitude}&z=16&pt=${data.longitude},${data.latitude},pm2rdm`;
      }
    }

    function goBack() {
      router.back();
    }
    function goToBooking() {
      router.push({ name: 'booking', params: { id: stadium.value.id } });
    }

    onMounted(fetchStadium);

    return { stadium, images, currentImg, reviews, yandexMapSrc, goBack, goToBooking };
  }
}
</script>

<style src="../assets/css/pages/stadium.css"></style> 