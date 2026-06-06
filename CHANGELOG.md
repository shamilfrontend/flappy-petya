# Changelog

## Unreleased

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

- Рекорд не появлялся после игры (пауза, вкладка, Firebase merge)
- Таблица рекордов не мигала «Загрузка...» при наличии локальных данных

### Changed

- Кнопка mute на splash заменена экраном настроек
- `npm run check` теперь запускает `test:coverage` (как CI)
- Клиентская валидация score (1–9999) перед отправкой в Firebase
- Firebase refresh объединяет remote и локальные рекорды

## 1.1.0

### Added

- Звуковые эффекты (Web Audio) с кнопкой mute на splash
- Медали на экране счёта (бронза 10+, серебро 25+, золото 50+)
- Countdown 3-2-1 перед стартом раунда
- Пауза во время игры (кнопка II)
- Haptic feedback через `navigator.vibrate`
- Подсветка «Новый рекорд!» при побитии личного best
- Тесты Firebase app, load-image, расширенное покрытие game.ts
- Coverage gate в CI (пороги 90%/82%)
