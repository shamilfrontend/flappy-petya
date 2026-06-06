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

Требуется [Android Studio](https://developer.android.com/studio) и JDK 17+.

```bash
# Сборка web с относительными путями + синхронизация в android/
npm run build:android
npm run cap:sync

# Открыть проект в Android Studio
npm run cap:open:android
```

Сборка APK/AAB — через Android Studio (**Build → Generate App Bundle / APK**).

`build:android` использует `base: './'` — это нужно для локальных ассетов внутри APK.

## Качество кода

```bash
npm run check       # lint + test:run (как в pre-commit)
npm run lint -w flappy-petya-web
npm run test:run -w flappy-petya-web
npm run test:coverage -w flappy-petya-web
```

### Pre-commit (Husky)

После `npm install` при каждом `git commit` автоматически запускаются `lint` и `test:run`.
Обойти проверку в крайнем случае: `git commit --no-verify`.

## GitHub Actions

| Workflow | Триггер | Назначение |
|----------|---------|------------|
| [ci.yml](.github/workflows/ci.yml) | push / PR в `main` | `npm ci` + lint + test + build |
| [deploy-pages.yml](.github/workflows/deploy-pages.yml) | push в `main` | lint + test + сборка и деплой на GitHub Pages |

**Настройка Pages (один раз):** **Settings → Pages → Build and deployment**

- Source: **GitHub Actions**

## Firebase

Переменные окружения — в `web/.env.example`. Для CI — GitHub Secrets с префиксом `VITE_FIREBASE_*`.
Правила Firestore — `firestore.rules` в корне репозитория.

## Код web

```
web/src/
  game/       — игровой цикл и FSM
  entities/   — птица и трубы
  graphics/   — спрайты и отрисовка
  input/      — координаты указателя (mouse + touch)
  lib/        — Firebase, storage, viewport
  ui/         — лоадер, ввод имени
web/public/static/
```
