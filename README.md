# Личный кабинет продавца с интегрированным AI-ассистентом, который помогает улучшать описания объявлений

## Стек и использованные инструменты

- `React` + `TypeScript`
- `react-router-dom` — роутинг страниц
- `Vite` — сборка
- `Axios` — HTTP-запросы к бэку
- `ESLint` — линтер
- `Material UI` — компоненты интерфейса

## Тестирование

Ссылка на чек-лист и тест-кейсы: 
https://docs.google.com/spreadsheets/d/1CST9JliZyBqV9won_1cl_2uTRlF3VrvbgtG0Q1GKXAk/edit?usp=sharing

## Что реализовано

Клиент включает 3 уникальные страницы и роутинг:
- `/ads` — список объявлений
  - поиск по названию
  - фильтры по категориям и “только требующие доработок”
  - пагинация по 10 объявлений
  - layout переключатель `grid/list`
  - отображение ошибок и загрузки
- `/ads/:id` — просмотр объявления
  - название, цена, дата публикации/редактирования
  - характеристики (зависят от категории)
  - описание
  - блок “Требуются доработки” со списком незаполненных полей
- `/ads/:id/edit` — редактирование объявления
  - форма с категориями/полями
  - валидация обязательных полей
  - сохранение черновика в `localStorage`
  - AI-функции:
    - “Придумать/Улучшить описание”
    - “Узнать рыночную цену”

Дополнительно:
- тема `light/dark` с сохранением в `localStorage`

## localStorage (черновики/состояния)

- Список объявлений (`/ads`) сохраняет настройки фильтрации/пагинации:
  - `client/src/helpers/adsListState.ts`
- Редактирование (`/ads/:id/edit`) сохраняет черновик:
  - ключ формата: `ad-edit-draft:${id}`
  
## Запуск

### AI (LLM) интеграция

AI-функции реализованы на клиенте через локальный Ollama (без внешнего интернета/ключей).

1. Установите Ollama.
2. Загрузите модель:
   ```bash
   ollama pull llama3
   ```
3. Запустите Ollama:
   ```bash
   ollama serve
   ```
4. Подтвердите, что API доступно:
   `http://localhost:11434/api/generate`

### Backend
Перейдите в директорию с кодом сервера:

```bash
cd server
npm i
npm start
```

Сервер будет запущен на `http://localhost:8080`.
Другой порт:

```bash
PORT=8080 npm start
```

### Frontend
В отдельном терминале:

```bash
cd client
npm i
npm run dev
```

По умолчанию клиент обращается к backend по адресу `http://localhost:8080`.

## Самостоятельные решения

- **Расширение ответа `GET /items` полем `id`**: изначально список не содержал `id`, и клиенту приходилось делать дополнительные запросы `GET /items/:id` и сопоставлять элементы вручную. Это приводило к `N+1` запросам и риску неверной навигации при сортировке/фильтрации. Добавление `id` в ответ списка позволило загружать список одной операцией на страницу и сделать переходы предсказуемыми.
- **Корректная обработка CORS preflight для `PUT /items/:id`**: браузер перед `PUT` делает `OPTIONS`. Для гарантированно корректного preflight добавлен хендлер `fastify.options('/*', ...)` в `server/server.ts`, который выставляет `Access-Control-Allow-*` заголовки и возвращает `204` - браузер пропускает дальнейший `PUT`.
- **Обработка гонок запросов**: при быстрых навигациях/перезапросах результаты устаревших запросов игнорируются (хук `useRequestIdGuard`).
- **Плейсхолдеры изображений по категории**: загрузка реальных изображений не требовалась, поэтому используются заглушки.

## Сложности

- **Мигание темы при первой отрисовке**: на момент первого рендера страница могла успеть отобразиться с дефолтной светлой темой. Чтобы убрать это моргание, тема выставляется до запуска JS: в `client/index.html` добавлен inline-script, который читает `localStorage.theme` и сразу задаёт `data-theme`, а также inline-style для fallback-цветов `body`.

## Приложение

<img width="1280" height="676" alt="image" src="https://github.com/user-attachments/assets/090e0e25-0356-4447-bac9-80289b71831e" />

<img width="1280" height="446" alt="image" src="https://github.com/user-attachments/assets/22378ba9-3e94-4e83-a5d3-443128a4aff6" />

<img width="1280" height="579" alt="image" src="https://github.com/user-attachments/assets/70d464ed-6372-4ca6-bfa5-5df2dc37c0ec" />

<img width="1280" height="728" alt="image" src="https://github.com/user-attachments/assets/ebca482f-98b2-4aa5-a131-c61d28085db9" />

<img width="1141" height="534" alt="image" src="https://github.com/user-attachments/assets/e1834349-e756-4bde-afa8-7f93207cdf8a" />

<img width="1280" height="648" alt="image" src="https://github.com/user-attachments/assets/6747ccf0-4fe0-44f8-896b-a70215912d73" />

<img width="1280" height="498" alt="image" src="https://github.com/user-attachments/assets/d7a4a3cd-7992-4105-829a-ae0d1703ae05" />

<img width="1280" height="466" alt="image" src="https://github.com/user-attachments/assets/45d5d9df-1009-4306-9517-ebc077eb8f69" />




