<template>
  <div class="stadium-card skeleton">
    <div class="stadium-img skeleton-rect"></div>
    <div class="stadium-content">
      <div class="skeleton-line skeleton-title"></div>
      <div class="skeleton-line skeleton-desc"></div>
      <div class="stadium-info-row">
        <div class="stadium-info">
          <div class="skeleton-line skeleton-info"></div>
          <div class="skeleton-line skeleton-rating"></div>
        </div>
        <div class="skeleton-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StadiumCardSkeleton'
}
</script>

<style scoped>
.skeleton {
  background: #f6f7f8;
  position: relative;
  overflow: hidden;
}
.skeleton-rect {
  background: #e9ecef;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 1rem 1rem 0 0;
}
.skeleton-line {
  height: 16px;
  background: #e9ecef;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  width: 100%;
  animation: skeletonPulse 1.2s infinite ease-in-out;
}
.skeleton-title {
  width: 60%;
  height: 18px;
  margin-bottom: 0.7rem;
}
.skeleton-desc {
  width: 90%;
  height: 14px;
  margin-bottom: 0.7rem;
}
.skeleton-info {
  width: 70%;
  height: 13px;
  margin-bottom: 0.4rem;
}
.skeleton-rating {
  width: 40%;
  height: 13px;
}
.skeleton-btn {
  width: 84px;
  height: 2rem;
  background: #e9ecef;
  border-radius: 0.5rem;
  margin-left: 1rem;
}
@keyframes skeletonPulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style> 