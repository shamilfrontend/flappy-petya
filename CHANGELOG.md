# Changelog

## Unreleased

### Added

- PWA service worker (vite-plugin-pwa) с кэшированием shell и ассетов
- Клавиатурное управление: Space/Enter — прыжок, P/Escape — пауза
- Подсветка текущего игрока в таблице рекордов
- Capacitor Haptics на нативных платформах (fallback на `navigator.vibrate`)
- Доступность canvas: `role`, `aria-label`, `tabIndex`
- Экран «Настройки» с переключателями звука и вибрации

### Changed

- Кнопка mute на splash заменена экраном настроек
- `npm run check` теперь запускает `test:coverage` (как CI)

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
