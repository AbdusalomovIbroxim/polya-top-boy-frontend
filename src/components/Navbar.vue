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
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.navbar-title {
  margin: 0;
  color: #131712;
  font-size: 1.5rem;
  font-weight: 600;
}
</style> 