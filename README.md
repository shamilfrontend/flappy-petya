# Flappy Petya

Клон Flappy Bird на TypeScript и Canvas 2D (Vite). Монорепозиторий: **web** (браузер + PWA) и **android** (Capacitor).

**Demo:** https://shamilfrontend.github.io/flappy-petya/

## Структура

```
web/        — Vite-приложение (игра, Supabase, тесты)
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
- Supabase-лидерборд (топ-10)
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

**Оффлайн-режим не нужен и не планируется.** Игра рассчитана на prod с настроенным Supabase (Anonymous Auth, Postgres-лидерборд). Имя игрока назначается автоматически и хранится только в пределах открытой вкладки (`sessionStorage`), Supabase используется для синхронизации рейтинга. Не добавляйте полноценный offline/local режим, UX «вы офлайн» и обход Supabase при отсутствии сети.

## Качество кода

```bash
npm run check          # lint (как в pre-commit и CI)
npm run assets:webp -w flappy-petya-web  # PNG → WebP в public/static/
npm run lint -w flappy-petya-web
```

### Pre-commit (Husky)

После `npm install` при каждом `git commit` автоматически запускается `lint`.
Обойти проверку в крайнем случае: `git commit --no-verify`.

## GitHub Actions

| Workflow | Триггер | Назначение |
|----------|---------|------------|
| [ci.yml](.github/workflows/ci.yml) | push / PR в `main` | `npm ci` + lint + build |
| [deploy-pages.yml](.github/workflows/deploy-pages.yml) | push в `main` | lint + сборка и деплой на GitHub Pages |

**Настройка Pages (один раз):** **Settings → Pages → Build and deployment**

- Source: **GitHub Actions**

## Supabase

Переменные окружения — в `web/.env.example`. Для CI — GitHub Secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

SQL схема и RLS политики лежат в `supabase/schema.sql`. Миграции — в `supabase/migrations/`.

После обновления кода примените новые миграции в Supabase (SQL Editor или `supabase db push`).

### Схема данных

Используется структура из трёх таблиц:

1. `players` — `user_id`, `name`.
2. `leaderboard_scores` — `user_id`, `level`, `score`.
3. `game_sessions` — активная игровая сессия на уровень (`started_at`, `status`).

Запись в `leaderboard_scores` возможна **только** через RPC `submit_leaderboard_score` (прямой upsert из клиента заблокирован). Перед игрой клиент вызывает `start_game_session`, после — отправляет `score` и `game_frames` на серверную валидацию.

Имя игрока уникально глобально (без учёта регистра), один игрок имеет один рекорд на уровень.

Подозрительные записи можно удалять в панели Supabase в таблице `leaderboard_scores` (например, накрученные до применения миграции).

### Anonymous Auth

1. В Supabase проекте включите **Anonymous Sign-Ins** в разделе Auth Providers.
2. Используйте только publishable/anon ключ в клиенте (`VITE_SUPABASE_ANON_KEY`).

Без включенного anonymous входа инициализация storage не сможет получить `uid`.

При входе в игру пользователь получает случайное имя формата `Неопознанный <животное>`.
Имя сохраняется только пока открыта текущая вкладка (`sessionStorage`), но при полном закрытии вкладки назначается новое имя.
Перед стартом раунда имя проверяется на уникальность среди всех пользователей Supabase (без учёта регистра).

## Код web
```
web/src/
  game/       — игровой цикл и FSM
  entities/   — птица и трубы
  graphics/   — спрайты и отрисовка
  input/      — pointer, haptic feedback
  audio/      — звуковые эффекты (Web Audio)
  lib/        — Supabase, storage, viewport
  ui/         — лоадер, сообщения
web/public/static/
```
