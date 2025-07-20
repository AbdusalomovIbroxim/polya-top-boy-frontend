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

<script>
export default {
  name: 'ProfilePage',
  props: {
    user: {
      type: Object,
      required: true
    },
    logout: {
      type: Function,
      required: true
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #e9ecef;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 1.2rem;
  font-weight: 600;
  color: #131712;
  margin-bottom: 0.25rem;
}

.full-name {
  font-size: 1rem;
  color: #6d8566;
}

.logout-btn {
  padding: 0.5rem 1rem;
  font-size: 0.95em;
  color: #d33;
  background: none;
  border: 1px solid #d33;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #d33;
  color: white;
}

.profile-content {
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.profile-section {
  padding: 1.5rem;
}

.profile-section h3 {
  margin: 0 0 1rem 0;
  color: #131712;
  font-size: 1.1rem;
  font-weight: 600;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6d8566;
  font-size: 0.95rem;
}

.value {
  color: #131712;
  font-weight: 500;
}

.profile-loading {
  text-align: center;
  padding: 3rem 1rem;
  color: #6d8566;
}

.profile-loading p {
  margin: 0;
  font-size: 1rem;
}
</style> 