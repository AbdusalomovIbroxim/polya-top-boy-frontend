<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="region in regions"
        :key="region"
        @click="selectRegion(region)"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        :class="activeFilters.region === region ? 'bg-[#4ddf20] text-white' : 'bg-[#f1f4f0] text-[#131711]'"
      >
        {{ region }}
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="type in types"
        :key="type"
        @click="selectType(type)"
        class="px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        :class="activeFilters.type === type ? 'bg-[#4ddf20] text-white' : 'bg-[#f1f4f0] text-[#131711]'"
      >
        {{ type }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterTabs',
  data() {
    return {
      regions: ['Все', 'Ташкент', 'Самарканд', 'Бухара'],
      types: ['Все', 'Футбол', 'Теннис', 'Баскетбол'],
      activeFilters: {
        region: 'Все',
        type: 'Все'
      }
    }
  },
  methods: {
    selectRegion(region) {
      this.activeFilters.region = region;
      this.emitFilters();
    },
    selectType(type) {
      this.activeFilters.type = type;
      this.emitFilters();
    },
    emitFilters() {
      this.$emit('filter-changed', this.activeFilters);
    }
  }
}
</script> 