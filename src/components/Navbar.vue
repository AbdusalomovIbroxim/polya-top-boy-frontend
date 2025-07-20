<template>
  <div class="navbar">
    <h2 class="navbar-title">{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    title: {
      type: String,
      default: 'Fields'
    }
  }
}
</script>

<style scoped>
.navbar {
  padding: 1.25rem 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-bottom: 2px solid #e9ecef;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
}

.navbar::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #6d8566, transparent);
}

.navbar-title {
  margin: 0;
  color: #131712;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #131712 0%, #6d8566 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}
</style> 