# Flappy Petya

Клон Flappy Bird на TypeScript и Canvas 2D (Vite). Монорепозиторий: **web** (браузер + PWA) и **android** (Capacitor).

**Demo:** https://shamilfrontend.github.io/flappy-petya/

## Структура

```
web/        — Vite-приложение (игра, Firebase, тесты)
android/    — Android-проект (Capacitor)
```

## Разработка (web)

```bash
npm install
npm run dev
```

Откройте URL из терминала (обычно http://localhost:5173/flappy-petya/).

## Сборка web (GitHub Pages)

```bash
npm run build
```

Артефакты в `web/dist/`. Для Pages настроен `base: /flappy-petya/`.

```bash
npm run preview -w flappy-petya-web
```

## Android (Capacitor)

Требуется [Android Studio](https://developer.android.com/studio) и JDK 21+ (см. `android/app/capacitor.build.gradle`).

```bash
# Сборка web с относительными путями + синхронизация в android/
npm run build:android
npm run cap:sync

# Открыть проект в Android Studio
npm run cap:open:android
```

Сборка APK/AAB — через Android Studio (**Build → Generate App Bundle / APK**).

`build:android` использует `base: './'` — это нужно для локальных ассетов внутри APK.

После добавления `@capacitor/haptics` выполните `npm run cap:sync` для синхронизации нативного плагина.

## Игровые возможности

- 3 уровня сложности (легкий / средний / сложный)
- Локальные рекорды и опциональный Firebase-лидерборд (топ-10)
- Countdown 3-2-1 перед стартом раунда
- Звуковые эффекты и haptic feedback; настройки звука и вибрации в меню «Настройки» на главном экране
- Пауза во время игры (кнопка II или P/Escape)
- Клавиатура: Space/Enter — прыжок
- PWA с offline-кэшем ассетов (service worker)
- Подсветка своей строки в таблице рекордов
- Медали на экране счёта: бронза (10+), серебро (25+), золото (50+)
- Подсветка «Новый рекорд!» при побитии личного best
- Анимации: падение при смерти, screen shake, пульс countdown

История изменений — [CHANGELOG.md](CHANGELOG.md) (текущая версия **1.2.0**).

## Качество кода

```bash
npm run check          # lint + test:coverage (как в pre-commit и CI)
npm run lint -w flappy-petya-web
npm run test:run -w flappy-petya-web
npm run test:coverage -w flappy-petya-web
```

### Pre-commit (Husky)

После `npm install` при каждом `git commit` автоматически запускаются `lint` и `test:coverage` (с порогами покрытия).
Обойти проверку в крайнем случае: `git commit --no-verify`.

## GitHub Actions

| Workflow | Триггер | Назначение |
|----------|---------|------------|
| [ci.yml](.github/workflows/ci.yml) | push / PR в `main` | `npm ci` + lint + test:coverage + build |
| [deploy-pages.yml](.github/workflows/deploy-pages.yml) | push в `main` | lint + test:coverage + сборка и деплой на GitHub Pages |

**Настройка Pages (один раз):** **Settings → Pages → Build and deployment**

- Source: **GitHub Actions**

## Firebase

Переменные окружения — в `web/.env.example`. Для CI — GitHub Secrets с префиксом `VITE_FIREBASE_*`.
Правила Firestore — `firestore.rules` в корне репозитория.

### Google Sign-In

1. [Firebase Console](https://console.firebase.google.com/) → проект → **Authentication** → **Sign-in method**
2. Включите провайдер **Google** (Status: Enabled)
3. Укажите support email и сохраните
4. **Authentication** → **Settings** → **Authorized domains** — добавьте `localhost` и домен деплоя

Без включённого Google провайдера вход падает с `auth/operation-not-allowed`.

## Код web

```
web/src/
  game/       — игровой цикл и FSM
  entities/   — птица и трубы
  graphics/   — спрайты и отрисовка
  input/      — pointer, haptic feedback
  audio/      — звуковые эффекты (Web Audio)
  lib/        — Firebase, storage, viewport
  ui/         — лоадер, ввод имени
web/public/static/
```
