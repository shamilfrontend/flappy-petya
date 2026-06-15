export const THEME = {
  skyTop: '#8ED4EA',
  skyBottom: '#C5EAF5',
  cloud: 'rgba(255, 255, 255, 0.6)',
  ground: '#E8DCC8',
  groundStripe: '#66CFC8',
  obstacle: '#00A196',
  obstacleCap: '#007A72',
  outline: '#2A2A2A',
  accent: '#00A196',
  panel: '#FFF8F0',
  panelBorder: '#D4C4B0',
  text: '#FFFFFF',
} as const;

/** Цвета окружения, меняющиеся по мере набора очков (смена времени суток). */
export interface Palette {
  skyTop: string;
  skyBottom: string;
  cloud: string;
  hillFar: string;
  hillNear: string;
  obstacleLight: string;
  obstacle: string;
  obstacleDark: string;
  obstacleCap: string;
  ground: string;
  groundDark: string;
  groundStripe: string;
  grass: string;
  grassDark: string;
  sun: string;
  moon: string;
  star: string;
}

const DAY: Palette = {
  skyTop: '#8ED4EA',
  skyBottom: '#C5EAF5',
  cloud: 'rgba(255, 255, 255, 0.7)',
  hillFar: '#A6D9C2',
  hillNear: '#7FC6A6',
  obstacleLight: '#2CC2B5',
  obstacle: '#00A196',
  obstacleDark: '#007A72',
  obstacleCap: '#00897F',
  ground: '#E8DCC8',
  groundDark: '#D8C9AE',
  groundStripe: '#66CFC8',
  grass: '#7FC36B',
  grassDark: '#5DA64C',
  sun: '#FFE3A0',
  moon: '#EEF2FF',
  star: '#FFFFFF',
};

const DUSK: Palette = {
  skyTop: '#F6A96B',
  skyBottom: '#FBD9A3',
  cloud: 'rgba(255, 240, 220, 0.65)',
  hillFar: '#C79A8F',
  hillNear: '#9E7368',
  obstacleLight: '#E0805A',
  obstacle: '#C45F3C',
  obstacleDark: '#963F26',
  obstacleCap: '#A84B2E',
  ground: '#D8B68C',
  groundDark: '#C29A6E',
  groundStripe: '#E08A5A',
  grass: '#9C8246',
  grassDark: '#7C6534',
  sun: '#FFC56B',
  moon: '#F2ECDA',
  star: '#FFF4D6',
};

const NIGHT: Palette = {
  skyTop: '#1B2A4A',
  skyBottom: '#43577E',
  cloud: 'rgba(210, 220, 240, 0.45)',
  hillFar: '#2E3F63',
  hillNear: '#3C4F77',
  obstacleLight: '#4C6FA8',
  obstacle: '#33518A',
  obstacleDark: '#223A66',
  obstacleCap: '#2A4476',
  ground: '#4A4660',
  groundDark: '#3A374E',
  groundStripe: '#6E6A92',
  grass: '#3E5A52',
  grassDark: '#2E443E',
  sun: '#FFE3A0',
  moon: '#EEF2FF',
  star: '#FFFFFF',
};

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parseColor(color: string): Rgba {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  }

  const match = color.match(/rgba?\(([^)]+)\)/);
  if (match) {
    const parts = match[1].split(',').map((part) => parseFloat(part.trim()));
    return {
      r: parts[0] ?? 0,
      g: parts[1] ?? 0,
      b: parts[2] ?? 0,
      a: parts[3] ?? 1,
    };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

/** Линейная интерполяция между двумя цветами (поддерживает hex и rgba). */
export function lerpColor(from: string, to: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const a = parseColor(from);
  const b = parseColor(to);

  const r = Math.round(a.r + (b.r - a.r) * clamped);
  const g = Math.round(a.g + (b.g - a.g) * clamped);
  const bl = Math.round(a.b + (b.b - a.b) * clamped);
  const al = a.a + (b.a - a.a) * clamped;

  return `rgba(${r}, ${g}, ${bl}, ${Number(al.toFixed(3))})`;
}

function lerpPalette(from: Palette, to: Palette, t: number): Palette {
  const keys = Object.keys(from) as (keyof Palette)[];
  const result = {} as Palette;

  for (const key of keys) {
    result[key] = lerpColor(from[key], to[key], t);
  }

  return result;
}

/** Очки, при которых окружение полностью переходит к следующему пресету. */
const DUSK_SCORE = 15;
const NIGHT_SCORE = 30;
const paletteCache = new Map<number, Palette>();

/** Возвращает палитру окружения для текущего счёта с плавным переходом. */
export function getPalette(score: number): Palette {
  const normalizedScore = Math.max(0, Math.trunc(score));
  const cached = paletteCache.get(normalizedScore);
  if (cached) {
    return cached;
  }

  if (normalizedScore <= 0) {
    return DAY;
  }

  if (normalizedScore < DUSK_SCORE) {
    const palette = lerpPalette(DAY, DUSK, normalizedScore / DUSK_SCORE);
    paletteCache.set(normalizedScore, palette);
    return palette;
  }

  if (normalizedScore < NIGHT_SCORE) {
    const palette = lerpPalette(
      DUSK,
      NIGHT,
      (normalizedScore - DUSK_SCORE) / (NIGHT_SCORE - DUSK_SCORE),
    );
    paletteCache.set(normalizedScore, palette);
    return palette;
  }

  return NIGHT;
}

/** Степень «ночи» от 0 (день) до 1 (ночь) для прозрачности небесных тел и атмосферы. */
export function getNightFactor(score: number): number {
  if (score <= DUSK_SCORE) {
    return 0;
  }

  if (score >= NIGHT_SCORE) {
    return 1;
  }

  return (score - DUSK_SCORE) / (NIGHT_SCORE - DUSK_SCORE);
}

export const DEFAULT_PALETTE = DAY;
