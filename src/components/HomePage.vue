<template>
  <div class="relative flex size-full min-h-screen flex-col bg-white justify-between group/design-root overflow-x-hidden pb-20" style='font-family: Lexend, "Noto Sans", sans-serif;'>
    <div>
      <AppHeader />
      <FilterTabs @tab-changed="filterChanged" />
      
      <StadiumCard 
        v-for="stadium in filteredStadiums" 
        :key="stadium.id" 
        :stadium="stadium" 
      />
    </div>
    
    <NavigationBar />
  </div>
</template>

<script>
import AppHeader from './Header.vue'
import FilterTabs from './FilterTabs.vue'
import StadiumCard from './StadiumCard.vue'
import NavigationBar from './NavigationBar.vue'

export default {
  name: 'HomePage',
  components: {
    AppHeader,
    FilterTabs,
    StadiumCard,
    NavigationBar,
  },
  data() {
    return {
      activeFilter: 'All',
      stadiums: [
        {
          id: 1,
          name: 'Бунёдкор',
          location: 'Ташкент, Узбекистан',
          price: '$100',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png',
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 2, 
          name: 'Миллий',
          location: 'Ташкент, Узбекистан',
          price: '$80',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 3,
          name: 'Пахтакор',
          location: 'Ташкент, Узбекистан', 
          price: '$90',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 4,
          name: 'Локомотив',
          location: 'Ташкент, Узбекистан',
          price: '$85',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 5,
          name: 'Джар',
          location: 'Андижан, Узбекистан',
          price: '$70',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 6,
          name: 'Андижан',
          location: 'Андижан, Узбекистан',
          price: '$65',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 7,
          name: 'Насаф',
          location: 'Карши, Узбекистан',
          price: '$75',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 8,
          name: 'Карши',
          location: 'Карши, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 9,
          name: 'Навбахор',
          location: 'Наманган, Узбекистан',
          price: '$70',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 10,
          name: 'Наманган',
          location: 'Наманган, Узбекистан',
          price: '$65',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 11,
          name: 'Согдиана',
          location: 'Джизак, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 12,
          name: 'Джизак',
          location: 'Джизак, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 13,
          name: 'Металлург',
          location: 'Бекабад, Узбекистан',
          price: '$65',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 14,
          name: 'Бекабад',
          location: 'Бекабад, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 15,
          name: 'Динамо',
          location: 'Самарканд, Узбекистан',
          price: '$70',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 16,
          name: 'Самарканд',
          location: 'Самарканд, Узбекистан',
          price: '$65',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 17,
          name: 'Кызылкум',
          location: 'Навои, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 18,
          name: 'Навои',
          location: 'Навои, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 19,
          name: 'Нефтчи',
          location: 'Фергана, Узбекистан',
          price: '$65',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 20,
          name: 'Фергана',
          location: 'Фергана, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 21,
          name: 'Бухара',
          location: 'Бухара, Узбекистан',
          price: '$65',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 22,
          name: 'Ситора',
          location: 'Бухара, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 23,
          name: 'Хорезм',
          location: 'Ургенч, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 24,
          name: 'Ургенч',
          location: 'Ургенч, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 25,
          name: 'Сурхан',
          location: 'Термез, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 26,
          name: 'Термез',
          location: 'Термез, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 27,
          name: 'Нукус',
          location: 'Нукус, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 28,
          name: 'Каракалпак',
          location: 'Нукус, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 29,
          name: 'Гулистан',
          location: 'Гулистан, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 30,
          name: 'Сырдарья',
          location: 'Гулистан, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 31,
          name: 'Зарафшан',
          location: 'Зарафшан, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 32,
          name: 'Горняк',
          location: 'Зарафшан, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 33,
          name: 'Алмалык',
          location: 'Алмалык, Узбекистан',
          price: '$60',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 34,
          name: 'АГМК',
          location: 'Алмалык, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 35,
          name: 'Ангрен',
          location: 'Ангрен, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 36,
          name: 'Шахтер',
          location: 'Ангрен, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 37,
          name: 'Чирчик',
          location: 'Чирчик, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 38,
          name: 'Химик',
          location: 'Чирчик, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 39,
          name: 'Коканд',
          location: 'Коканд, Узбекистан',
          price: '$55',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 40,
          name: 'Шелковик',
          location: 'Коканд, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 41,
          name: 'Маргилан',
          location: 'Маргилан, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 42,
          name: 'Атлас',
          location: 'Маргилан, Узбекистан',
          price: '$45',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 43,
          name: 'Каттакурган',
          location: 'Каттакурган, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 44,
          name: 'Спартак',
          location: 'Каттакурган, Узбекистан',
          price: '$45',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 45,
          name: 'Денау',
          location: 'Денау, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 46,
          name: 'Сурхан-2',
          location: 'Денау, Узбекистан',
          price: '$45',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 47,
          name: 'Шахрисабз',
          location: 'Шахрисабз, Узбекистан',
          price: '$50',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 48,
          name: 'Касри',
          location: 'Шахрисабз, Узбекистан',
          price: '$45',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        },
        {
          id: 49,
          name: 'Китаб',
          location: 'Китаб, Узбекистан',
          price: '$45',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/bf42910d-1163-453d-b7ba-c82c2460c2af.png'
          ]
        },
        {
          id: 50,
          name: 'Насаф-2',
          location: 'Китаб, Узбекистан',
          price: '$40',
          images: [
            'https://cdn.usegalileo.ai/sdxl10/38c3a894-c363-4b69-9216-296887b19919.png'
          ]
        }
      ]
    }
  },
  computed: {
    filteredStadiums() {
      if (this.activeFilter === 'All') {
        return this.stadiums;
      } else if (this.activeFilter === 'Tashkent') {
        return this.stadiums.filter(stadium => stadium.location.includes('Tashkent'));
      } else if (this.activeFilter === 'Favorites') {
        // В реальном приложении здесь будет логика для избранных стадионов
        return [];
      }
      return this.stadiums;
    }
  },
  methods: {
    filterChanged(filter) {
      this.activeFilter = filter;
    }
  }
}
</script> 