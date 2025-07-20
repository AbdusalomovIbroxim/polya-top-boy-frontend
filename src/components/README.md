# Components Documentation

Этот каталог содержит переиспользуемые компоненты для приложения.

## Структура компонентов

### Navbar.vue
Верхняя панель с заголовком страницы.

**Props:**
- `title` (String) - заголовок панели (по умолчанию: "Fields")

**Использование:**
```vue
<Navbar title="My Page" />
```

### FiltersRow.vue
Строка с фильтрами для поиска.

**Props:**
- `openFilter` (String) - текущий открытый фильтр

**Events:**
- `openRegionModal` - открытие модального окна регионов
- `openTypeModal` - открытие модального окна типов

**Использование:**
```vue
<FiltersRow 
  :openFilter="openFilter"
  @openRegionModal="handleRegionModal"
  @openTypeModal="handleTypeModal"
/>
```

### StadiumCard.vue
Карточка отдельного стадиона.

**Props:**
- `stadium` (Object) - объект стадиона

**Events:**
- `click` - клик по карточке
- `open` - клик по кнопке "Open"

**Использование:**
```vue
<StadiumCard 
  :stadium="stadiumData"
  @click="handleCardClick"
  @open="handleOpen"
/>
```

### StadiumList.vue
Список стадионов с сеткой.

**Props:**
- `stadiums` (Array) - массив стадионов
- `loading` (Boolean) - состояние загрузки

**Events:**
- `stadium-click` - клик по стадиону
- `stadium-open` - открытие стадиона

**Использование:**
```vue
<StadiumList 
  :stadiums="stadiums"
  :loading="loading"
  @stadium-click="handleStadiumClick"
  @stadium-open="handleStadiumOpen"
/>
```

### FilterModal.vue
Универсальное модальное окно для фильтров.

**Props:**
- `isOpen` (Boolean) - открыто ли модальное окно
- `title` (String) - заголовок модального окна
- `items` (Array) - список элементов
- `loading` (Boolean) - состояние загрузки

**Events:**
- `close` - закрытие модального окна
- `select` - выбор элемента

**Использование:**
```vue
<FilterModal
  :isOpen="modalOpen"
  title="Выберите регион"
  :items="regions"
  :loading="loading"
  @close="closeModal"
  @select="selectItem"
/>
```

### Tabbar.vue
Нижняя панель навигации.

**Props:**
- `activeTab` (String) - активная вкладка (по умолчанию: "home")

**Events:**
- `tab-change` - смена вкладки

**Использование:**
```vue
<Tabbar 
  activeTab="home"
  @tab-change="handleTabChange"
/>
```

## Импорт компонентов

Для удобства импорта используйте индексный файл:

```javascript
import { 
  Navbar, 
  FiltersRow, 
  StadiumList, 
  FilterModal, 
  Tabbar 
} from '../components';
```

## Принципы разработки

1. **Переиспользуемость** - каждый компонент должен быть независимым
2. **Props validation** - все props должны иметь валидацию типов
3. **Events** - используйте события для коммуникации с родительскими компонентами
4. **Scoped styles** - стили компонентов должны быть изолированы
5. **Documentation** - каждый компонент должен быть документирован 