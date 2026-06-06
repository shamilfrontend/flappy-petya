# Flappy Petya

Клон Flappy Bird на TypeScript и Canvas 2D (Vite).

**Demo:** https://shamilfrontend.github.io/flappy-petya/

## Разработка

```bash
npm install
npm run dev
```

Откройте URL из терминала (обычно http://localhost:5173/flappy-petya/).

## Сборка

```bash
npm run build
```

Артефакты в `dist/`. В репозитории настроен `base: /flappy-petya/` для GitHub Pages.

```bash
npm run preview
```

## GitHub Actions

| Workflow | Триггер | Назначение |
|----------|---------|------------|
| [ci.yml](.github/workflows/ci.yml) | push / PR в `main` | `npm ci` + `npm run build` |
| [deploy-pages.yml](.github/workflows/deploy-pages.yml) | push в `main` | Сборка и деплой на GitHub Pages |

**Настройка Pages (один раз):** **Settings → Pages → Build and deployment**

- Source: **GitHub Actions**

После push в `main` workflow соберёт проект и опубликует demo за 1–2 минуты.

## Структура

```
src/
  game/       — игровой цикл и FSM
  entities/   — птица и трубы
  graphics/   — спрайты и отрисовка цифр
  input/      — координаты указателя (mouse + touch)
  lib/        — сохранение рекорда
public/static/
```
