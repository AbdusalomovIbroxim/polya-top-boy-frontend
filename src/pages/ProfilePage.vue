<script setup>
import { useAuth } from '../composables/useAuth';
const { user, logout } = useAuth();

</script>

<template>
  <div class="profile-page">
    <div v-if="user" class="profile-header">
      <div class="user-info">
        <div class="username">@{{ user.username }}</div>
        <div v-if="user.first_name || user.last_name" class="full-name">
          {{ user.first_name }} {{ user.last_name }}
        </div>
      </div>
      <button @click="logout" class="logout-btn">Выйти</button>
    </div>
    <div v-if="user" class="profile-content">
      <div class="profile-section">
        <h3>Информация профиля</h3>
        <div class="info-item">
          <span class="label">ID пользователя:</span>
          <span class="value">{{ user.id }}</span>
        </div>
        <div class="info-item">
          <span class="label">Имя пользователя:</span>
          <span class="value">@{{ user.username }}</span>
        </div>
        <div v-if="user.first_name" class="info-item">
          <span class="label">Имя:</span>
          <span class="value">{{ user.first_name }}</span>
        </div>
        <div v-if="user.last_name" class="info-item">
          <span class="label">Фамилия:</span>
          <span class="value">{{ user.last_name }}</span>
        </div>
        <div v-if="user.language_code" class="info-item">
          <span class="label">Язык:</span>
          <span class="value">{{ user.language_code }}</span>
        </div>
      </div>
    </div>
    <div v-else class="profile-loading">
      <p>Загрузка профиля...</p>
    </div>
  </div>
</template>

<style src="../assets/css/pages/profile.css"></style> 