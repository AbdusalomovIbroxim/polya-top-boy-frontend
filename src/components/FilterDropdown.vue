<template>
  <teleport to="body">
    <transition name="dropdown-fade">
      <div v-if="isOpen" class="filter-dropdown-overlay" @mousedown.self="close">
        <div class="filter-dropdown-popup" :style="popupStyle" ref="popup">
          <div class="filter-dropdown-header">
            <span>{{ title }}</span>
            <button class="filter-dropdown-close" @click="close">×</button>
          </div>
          <div v-if="loading" class="filter-dropdown-loading">Загрузка...</div>
          <ul v-else class="filter-dropdown-list">
            <li 
              v-for="item in items" 
              :key="item.id" 
              class="filter-dropdown-list-item" 
              @click="select(item)"
            >
              {{ item.name_ru || item.name }}
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
export default {
  name: 'FilterDropdown',
  props: {
    isOpen: Boolean,
    title: String,
    items: Array,
    loading: Boolean,
    anchor: HTMLElement // DOM-элемент кнопки, под которой открывать
  },
  emits: ['close', 'select'],
  setup(props, { emit }) {
    const popup = ref(null);
    const popupStyle = ref({});

    function close() {
      emit('close');
    }
    function select(item) {
      emit('select', item);
      close();
    }

    function updatePosition() {
      if (props.anchor && popup.value) {
        const rect = props.anchor.getBoundingClientRect();
        popupStyle.value = {
          position: 'fixed',
          top: rect.bottom + 8 + 'px',
          left: rect.left + 'px',
          minWidth: rect.width + 'px',
          zIndex: 3000
        };
      }
    }

    onMounted(() => {
      nextTick(updatePosition);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    });

    watch(() => props.isOpen, (val) => {
      if (val) nextTick(updatePosition);
    });

    return { close, select, popup, popupStyle };
  }
}
</script>

<!-- Стили перенесены в filters-row.css --> 