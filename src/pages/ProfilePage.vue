<script setup>
import { inject } from 'vue';
const user = inject('user');
const logout = inject('logout');
console.log("test: " + user);

</script>

<template>
  <div class="profile-page">
    <div v-if="user && user.value" class="profile-header">
      <div class="user-info">
        <div class="username">@{{ user.value.username }}</div>
        <div v-if="user.value.first_name || user.value.last_name" class="full-name">
          {{ user.value.first_name }} {{ user.value.last_name }}
        </div>
      </div>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>
    <div v-if="user && user.value" class="profile-content">
      <div class="profile-section">
        <h3>Информация профиля</h3>
        <div class="info-item">
          <span class="label">ID пользователя:</span>
          <span class="value">{{ user.value.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">Имя пользователя:</span>
          <span class="value">@{{ user.value.username }}</span>
        </div>
        <div v-if="user.value.first_name" class="info-item">
          <span class="label">Имя:</span>
          <span class="value">{{ user.value.first_name }}</span>
        </div>
        <div v-if="user.value.last_name" class="info-item">
          <span class="label">Фамилия:</span>
          <span class="value">{{ user.value.last_name }}</span>
        </div>
        <div v-if="user.value.language_code" class="info-item">
          <span class="label">Язык:</span>
          <span class="value">{{ user.value.language_code }}</span>
        </div>
      </div>
    </div>
    <div v-else class="profile-loading">
      <p>Загрузка профиля...</p>
    </div>
  </div>
</template>

<style src="../assets/css/pages/profile.css"></style> 