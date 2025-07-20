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

<style src="../assets/css/components/navbar.css"></style> 