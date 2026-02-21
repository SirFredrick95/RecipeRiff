interface TagColor {
  bg: string;
  text: string;
}

export const colors = {
  cream: '#FFF8F0',
  amber: '#F59E0B',
  amberDeep: '#D97706',
  amberLight: '#FFF3E0',
  sage: '#8BAF7C',
  sageDeep: '#5E8C4A',
  sageLight: '#F0FAF0',
  clay: '#C4956A',
  clayDeep: '#A0724E',
  clayLight: '#F5E6DA',
  charcoal: '#2D2926',
  bark: '#4A3728',
  barkLight: '#8C8480',
  barkLighter: '#B5AFA8',
  white: '#FFFFFF',
  background: '#FFF8F0',
  cardBg: 'rgba(255,255,255,0.7)',
  border: 'rgba(45,41,38,0.08)',
  borderMedium: 'rgba(45,41,38,0.12)',
  danger: '#E74C3C',
} as const;

export const fonts = {
  display: 'DMSerifDisplay',
  body: 'System',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 20,
  card: 16,
} as const;

export const tagColors: Record<string, TagColor> = {
  Baking: { bg: 'rgba(245,158,11,0.12)', text: '#D97706' },
  Dinner: { bg: 'rgba(139,175,124,0.12)', text: '#5E8C4A' },
  Quick: { bg: 'rgba(196,149,106,0.12)', text: '#A0724E' },
  Healthy: { bg: 'rgba(139,175,124,0.12)', text: '#5E8C4A' },
  Dessert: { bg: 'rgba(245,158,11,0.12)', text: '#D97706' },
  Spicy: { bg: 'rgba(231,76,60,0.12)', text: '#E74C3C' },
  Bread: { bg: 'rgba(196,149,106,0.12)', text: '#A0724E' },
  Breakfast: { bg: 'rgba(245,158,11,0.12)', text: '#D97706' },
};

export const recipeGradients: readonly [string, string][] = [
  ['#F6D365', '#FDA085'],
  ['#a8e063', '#56ab2f'],
  ['#C4956A', '#E8D5B7'],
  ['#f5af19', '#f12711'],
  ['#654321', '#A0522D'],
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
];
