import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F4EF',
        ink: { DEFAULT: '#111013', soft: '#2A282E' },
        gold: { DEFAULT: '#F0BC00', bright: '#FEEA59', deep: '#B87500', tint: '#FFF4D6' },
        neutralx: { secondary: '#6B6A70', muted: '#A6A5AB' },
        hairline: '#E7E6E1',
        hover: '#F0EFEA',
        success: { DEFAULT: '#1F9D55', tint: '#E6F6EC' },
        danger: { DEFAULT: '#D93D3D', tint: '#FDECEC' },
        warning: { DEFAULT: '#B87500', tint: '#FFF4D6' },
        info: { DEFAULT: '#111013', tint: '#F0EFEA' },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-hero': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'page-title': ['28px', { lineHeight: '36px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'card-title': ['16px', { lineHeight: '24px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'kpi': ['32px', { lineHeight: '40px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'table-body': ['13px', { lineHeight: '18px', letterSpacing: '-0.005em', fontWeight: '500' }],
        'table-header': ['11px', { lineHeight: '16px', letterSpacing: '0.06em', fontWeight: '600' }],
        'badge': ['12px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '600' }],
        'codex': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      borderRadius: { card: '20px', field: '12px', panel: '16px' },
      boxShadow: {
        level1: '0 1px 2px rgba(17,16,19,0.04)',
        level2: '0 4px 16px -2px rgba(17,16,19,0.08)',
        level3: '0 12px 32px -8px rgba(17,16,19,0.18)',
        focus: '0 0 0 3px rgba(240,188,0,0.3)',
      },
      spacing: { gutter: '1.25rem', margin: '2rem' },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'none' } },
        'slide-in': { '0%': { opacity: '0', transform: 'translateX(-6px)' }, '100%': { opacity: '1', transform: 'none' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: {
        'fade-up': 'fade-up .35s cubic-bezier(.22,1,.36,1) both',
        'slide-in': 'slide-in .25s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
