<template>
  <div class="skeleton" :class="[`skeleton-${type}`, { 'skeleton-animated': animated }]">
    <div class="skeleton-content"></div>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    type: {
      type: String,
      default: 'text',
      validator: value => ['text', 'title', 'avatar', 'card', 'button', 'image'].includes(value)
    },
    animated: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 4px;
}

.skeleton-animated::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.skeleton-text {
  height: 16px;
  width: 100%;
}

.skeleton-title {
  height: 24px;
  width: 60%;
}

.skeleton-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.skeleton-card {
  height: 120px;
  width: 100%;
  border-radius: 8px;
}

.skeleton-button {
  height: 40px;
  width: 120px;
  border-radius: 6px;
}

.skeleton-image {
  height: 200px;
  width: 100%;
  border-radius: 8px;
}
</style> 