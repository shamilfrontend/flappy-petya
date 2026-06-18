# Changelog

## Unreleased

### Added

- Миграции Supabase для упрощённой схемы `players` + `leaderboard_scores`, case-insensitive уникальности имён и чтения имён игроков в leaderboard через RLS
- `supabase/schema.sql` как актуальный baseline схемы с политиками доступа для `anon` и `authenticated`

### Changed

- Клиент полностью переведён на Supabase: auth, storage и синхронизация рекордов теперь работают через `supabase-js`
- Перед стартом раунда автоматически назначается уникальное имя формата `Неопознанный <животное>-<код>`; имя хранится в `sessionStorage` текущей вкладки
- Очередь синхронизации рекордов получила retry/backoff, повтор при `online` и восстановление анонимной сессии при проблемах с RLS
- CI/деплой и env-конфигурация переключены на `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`

### Removed

- Конфигурация и клиентские модули legacy-бэкенда, а также старые backend-rules
- Legacy-UI ручного ввода имени и кнопки внешней авторизации на Splash (`web/src/ui/name-input.ts`, кнопки sign-in/sign-out)

## 2.0.0

### Added

- Playwright E2E smoke-тесты (`npm run test:e2e`) и job `e2e` в CI
- `game-announcer` (`aria-live`) — озвучивание счёта и «Новый рекорд!» для screen readers
- Enter на Splash запускает игру (клавиатурная навигация MVP)
- WebP-ассеты с PNG fallback (`loadImageWithFallback`, `npm run assets:webp`)
- Preload критичных спрайтов в `index.html`
- Детерминированный screen shake (`screen-shake.ts`) вместо `Math.random()`
- Capacitor iOS (`ios/`, `npm run cap:open:ios`, `npm run build:ios`)
- `@capacitor/app` — обработка Android back button (пауза / назад / выход)

### Changed

- PWA Workbox: API leaderboard/auth — `NetworkOnly`, в precache добавлен `webp`
- `VITE_BUILD_TARGET=ios` использует относительные пути (`base: './'`)

## 1.5.0

### Changed

- Рефакторинг `game.ts`: декомпозиция на `game-loop`, `game-renderer`, `game-updater`, `game-auth`, `game-input`, `game-layout`, `screen-handlers/`
- Константы `RESIZE_DEBOUNCE_MS`, `COUNTDOWN_*` перенесены в `config.ts`
- Интерфейс `GameHost` для shared state между модулями

## 1.4.0

### Added

- Персонаж `petyaSplash` на Splash-экране между подзаголовком и табами сложности
- `NameInputOverlay` при пустом имени игрока (например, когда провайдер auth не вернул `displayName`)
- Константа `MAX_PLAYER_NAME_LENGTH` (24) — единый лимит имени в клиенте и server rules

### Changed

- Сообщение об отсутствии Canvas переведено на русский

### Removed

- Неиспользуемый re-export `lib/player-name.ts`

## 1.3.0

### Added

- `MessageOverlay` вместо блокирующих `alert` для ошибок Canvas, ассетов и внешней авторизации
- `Game.destroy()` — снятие rAF, keyboard, resize и pointer listeners
- Таймаут загрузки изображений (`loadImage`, 15 с)
- Глобальный обработчик `unhandledrejection` с логированием
- Сброс `lastFrameTime` при возврате на вкладку (`visibilitychange`)

### Fixed

- UI не блокируется навсегда при ошибке sign-out (`isAwaitingAuth` + `try/finally`)
- Очередь синхронизации рекордов автоматически retry с backoff и при событии `online`
- Коллизия проверяется со всеми трубами, не только с первой

## 1.2.0

### Added

- PWA service worker (vite-plugin-pwa) с кэшированием shell и ассетов
- Клавиатурное управление: Space/Enter — прыжок, P/Escape — пауза
- Подсветка текущего игрока в таблице рекордов
- Capacitor Haptics на нативных платформах (fallback на `navigator.vibrate`)
- Доступность canvas: `role`, `aria-label`, `tabIndex`
- Экран «Настройки» с переключателями звука и вибрации
- Анимации: death tumble, screen shake, пульс countdown
- Индикатор синхронизации лидерборда («Обновление...»)

### Fixed

- Рекорд не появлялся после игры (пауза, вкладка, merge remote и локальных данных)
- Таблица рекордов не мигала «Загрузка...» при наличии локальных данных

### Changed

- Кнопка mute на splash заменена экраном настроек
- `npm run check` теперь запускает `test:coverage` (как CI)
- Клиентская валидация score (1–9999) перед отправкой в leaderboard
- Обновление leaderboard объединяет remote и локальные рекорды

## 1.1.0

### Added

- Звуковые эффекты (Web Audio) с кнопкой mute на splash
- Медали на экране счёта (бронза 10+, серебро 25+, золото 50+)
- Countdown 3-2-1 перед стартом раунда
- Пауза во время игры (кнопка II)
- Haptic feedback через `navigator.vibrate`
- Подсветка «Новый рекорд!» при побитии личного best
- Тесты app-модуля leaderboard, load-image, расширенное покрытие game.ts
- Coverage gate в CI (пороги 90%/82%)
