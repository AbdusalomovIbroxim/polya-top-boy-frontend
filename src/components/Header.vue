<template>
  <div class="flex items-center bg-white p-4 pb-2 justify-between">
    <!-- Back button -->
    <button 
      v-if="showBackButton" 
      @click="handleBack"
      class="text-[#131711] p-2 -ml-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
      </svg>
    </button>
    <div v-else class="w-10"></div>

    <h2 class="text-[#131711] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
      {{ title }}
    </h2>

    <div class="flex w-10 items-center justify-end">
      <slot name="actions">
        <button 
          v-if="showSettings"
          @click="handleSettings"
          class="text-[#131711] p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'Футбольные поля'
    },
    showBackButton: {
      type: Boolean,
      default: false
    },
    showSettings: {
      type: Boolean,
      default: false
    },
    backRoute: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleBack() {
      if (this.backRoute) {
        this.$router.push(this.backRoute)
      } else {
        this.$router.back()
      }
    },
    handleSettings() {
      this.$router.push('/profile/settings')
    }
  }
}
</script> 