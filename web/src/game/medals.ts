export const MEDAL_TYPES = {
  None: 'none',
  Bronze: 'bronze',
  Silver: 'silver',
  Gold: 'gold',
} as const;

export type MedalType = (typeof MEDAL_TYPES)[keyof typeof MEDAL_TYPES];

const MEDAL_THRESHOLDS = [
  { minScore: 50, medal: MEDAL_TYPES.Gold },
  { minScore: 25, medal: MEDAL_TYPES.Silver },
  { minScore: 10, medal: MEDAL_TYPES.Bronze },
] as const;

export function getMedal(score: number): MedalType {
  const match = MEDAL_THRESHOLDS.find(({ minScore }) => score >= minScore);
  return match?.medal ?? MEDAL_TYPES.None;
}

export const MEDAL_LABELS: Record<MedalType, string> = {
  [MEDAL_TYPES.None]: '',
  [MEDAL_TYPES.Bronze]: 'Бронза',
  [MEDAL_TYPES.Silver]: 'Серебро',
  [MEDAL_TYPES.Gold]: 'Золото',
};
