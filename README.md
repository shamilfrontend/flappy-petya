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

После добавления нативных плагинов (`@capacitor/haptics`, `@capacitor/app`) выполните `npm run cap:sync` для синхронизации.

## iOS (Capacitor)

Требуется macOS, Xcode и CocoaPods.

```bash
npm run build:ios
npm run cap:sync
npm run cap:open:ios
```

Сборка и публикация — через Xcode.

## Игровые возможности

- 3 уровня сложности (легкий / средний / сложный)
- Локальные рекорды и опциональный Firebase-лидерборд (топ-10)
- Countdown 3-2-1 перед стартом раунда
- Звуковые эффекты и haptic feedback; настройки звука и вибрации в меню «Настройки» на главном экране
- Пауза во время игры (кнопка II или P/Escape)
- Клавиатура: Space/Enter — прыжок
- PWA (манифест, service worker)
- Подсветка своей строки в таблице рекордов
- Медали на экране счёта: бронза (10+), серебро (25+), золото (50+)
- Подсветка «Новый рекорд!» при побитии личного best
- Анимации: падение при смерти, screen shake, пульс countdown

История изменений — [CHANGELOG.md](CHANGELOG.md) (текущая версия **1.3.0**).

## Вне scope

**Оффлайн-режим не нужен и не планируется.** Игра рассчитана на prod с настроенным Firebase (Anonymous Auth, Firestore-лидерборд). Имя игрока хранится в `localStorage`; Firestore используется для синхронизации рейтинга и anti-cheat. Не добавляйте полноценный offline/local режим, UX «вы офлайн» и обход Firebase при отсутствии сети.

## Качество кода

```bash
npm run check          # lint + test:coverage (как в pre-commit и CI)
npm run test:e2e -w flappy-petya-web   # Playwright smoke (нужен build)
npm run assets:webp -w flappy-petya-web  # PNG → WebP в public/static/
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
Правила Firestore — `firestore.rules` в корне репозитория. Их нужно **задеплоить в Firebase**, иначе клиент получит `Missing or insufficient permissions`:

```bash
npm install -g firebase-tools
firebase login
firebase use <project-id>
firebase deploy --only firestore:rules
```

Конфиг CLI — [firebase.json](firebase.json).

### Защита от накрутки рекордов

Без Cloud Functions защита строится на **игровых сессиях** и **Firestore rules**:

1. Перед раундом клиент создаёт `gameSessions/{uid}` с `startedAt: serverTimestamp()` и `status: active`.
2. При game over в `leaderboard/{level}/scores/{uid}` пишутся `score`, `name` и `gameFrames` (кадры только в состоянии `Game`).
3. Rules проверяют: активная сессия, совпадение уровня, минимальное время с начала сессии, диапазон `gameFrames` для счёта.
4. Прямая запись `saveRecord(..., 9999)` из DevTools **не проходит** без ожидания ~5 ч для максимального счёта.

Локальная проверка дублируется в `web/src/lib/storage/score-validation.ts`.
Тесты правил (нужны `firebase-tools` и Java):

```bash
npm run test:rules
```

После деплоя rules **вручную удалите** подозрительные записи в Firebase Console (`leaderboard → hard → scores`).

Опционально: включите [Firebase App Check](https://firebase.google.com/docs/app-check) для web/Android — дополнительный барьер для скриптов вне приложения.

### Anonymous Auth

1. [Firebase Console](https://console.firebase.google.com/) → проект → **Authentication** → **Sign-in method**
2. Включите провайдер **Anonymous** (Status: Enabled)
3. **Authentication** → **Settings** → **Authorized domains** — добавьте `localhost` и домен деплоя (`shamilfrontend.github.io`)

Без включённого Anonymous провайдера инициализация storage падает с `auth/operation-not-allowed`.

Имя игрока вводится в игре (до 30 символов) и сохраняется в `localStorage` (`flappy-petya-player-name`).

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
