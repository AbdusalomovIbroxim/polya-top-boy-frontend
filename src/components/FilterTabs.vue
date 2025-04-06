<template>
  <div class="pb-3">
    <div class="flex border-b border-[#dee5dc] px-4 gap-8">
      <a 
        v-for="(tab, index) in tabs" 
        :key="index"
        class="flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4"
        :class="[
          activeTab === index 
            ? 'border-b-[#131711] text-[#131711]' 
            : 'border-b-transparent text-[#6c8764]'
        ]"
        href="#"
        @click.prevent="selectTab(index)"
      >
        <p class="text-sm font-bold leading-normal tracking-[0.015em]">{{ tab }}</p>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterTabs',
  data() {
    return {
      activeTab: 0,
      tabs: ['All', 'Tashkent', 'Favorites']
    }
  },
  methods: {
    selectTab(index) {
      this.activeTab = index;
      this.$emit('tab-changed', this.tabs[index]);
    }
  }
}
</script> 