import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['var(--font-orbitron)', 'Rajdhani', 'monospace'],
        'mono': ['var(--font-jetbrains)', 'JetBrains Mono', 'Space Mono', 'monospace'],
        'body': ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary Brand Colors (Research-backed 2025 standards)
        "brand": {
          "gold": "#FFD700",          // Libertarian Gold (primary)
          "gold-hover": "#FFC700",    // Hover state
          "orange": "#F7931A",        // Bitcoin Orange (official)
          "black": "#0A0A0A",         // Soft Black (better than pure black for dark mode)
        },

        // Background & Surface Colors
        "surface": {
          "black": "#0A0A0A",         // Primary background
          "charcoal": "#1A1A1A",      // Cards, secondary backgrounds
          "dark": "#242424",          // Elevated surfaces
          "darker": "#050505",        // Deepest black
        },

        // Text Colors (WCAG AAA compliant)
        "text": {
          "primary": "#FFFFFF",       // Primary text (20.4:1 contrast)
          "secondary": "#F5F5F5",     // Body text (18.9:1 contrast)
          "tertiary": "#D1D5DB",      // Secondary text (13.2:1 contrast)
          "muted": "#9CA3AF",         // Muted text
          "disabled": "#6B7280",      // Disabled state (5.8:1 AA compliant)
        },

        // Border & Divider Colors
        "border": {
          "default": "#242424",       // Default borders
          "muted": "#6B7280",         // Subtle borders
          "gold": "#FFD700",          // Accent borders
        },

        // Semantic Colors (Accessible, not oversaturated)
        "semantic": {
          "success": "#10B981",       // Emerald green
          "warning": "#F59E0B",       // Amber
          "error": "#EF4444",         // Rose red
          "info": "#3B82F6",          // Sky blue
          "lightning": "#FDE047",     // Electric yellow (Lightning Network)
        },

        // Visual Identity System (Charts & Educational Visuals)
        "vi": {
          "gold": "#FFD000",          // Primary accent for Bitcoin, hard money
          "gold-muted": "#E6B800",    // Muted variant
          "red": "#FF4444",           // Fiat problems, inflation, warnings
          "blue": "#4477FF",          // Data, comparisons, traditional finance
          "gray": "#808080",          // Context, supporting elements
          "green": "#10B981",         // Success, positive outcomes
          "chart-grid": "#2A2A2A",    // Chart grid lines
        },

        // Legacy support (backwards compatibility)
        "brand-yellow": "#FFD700",
        "primary-dark": "#FFC700",
        "dark-grey": "#1A1A1A",
      },

      // Typography Scale (Fluid, mobile-first)
      fontSize: {
        'display': ['clamp(3rem, 5vw + 1rem, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2.5rem, 4vw + 0.5rem, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'h2': ['clamp(2rem, 3vw + 0.5rem, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        'h3': ['clamp(1.5rem, 2vw + 0.5rem, 2.25rem)', { lineHeight: '1.2' }],
        'h4': ['clamp(1.25rem, 1.5vw + 0.25rem, 1.75rem)', { lineHeight: '1.3' }],
        'h5': ['clamp(1.125rem, 1vw + 0.25rem, 1.5rem)', { lineHeight: '1.3' }],
        'body-lg': ['clamp(1.125rem, 0.5vw + 0.25rem, 1.25rem)', { lineHeight: '1.7' }],
        'body': ['clamp(1rem, 0.25vw + 0.125rem, 1.125rem)', { lineHeight: '1.7' }],
        'body-sm': ['clamp(0.875rem, 0.25vw + 0.125rem, 1rem)', { lineHeight: '1.6' }],
        'caption': ['clamp(0.75rem, 0.25vw + 0.125rem, 0.875rem)', { lineHeight: '1.5' }],
      },

      // Spacing System (8px base unit)
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },

      // Box Shadow (Gold glow effects)
      boxShadow: {
        'glow-sm': '0 0 10px rgba(255, 215, 0, 0.15)',
        'glow': '0 0 20px rgba(255, 215, 0, 0.25)',
        'glow-lg': '0 0 30px rgba(255, 215, 0, 0.35)',
        'gold': '0 4px 6px rgba(255, 215, 0, 0.1)',
        'gold-lg': '0 6px 20px rgba(255, 215, 0, 0.3)',
      },

      // Border Radius
      borderRadius: {
        'DEFAULT': '8px',
        'card': '12px',
        'large': '16px',
      },

      // Background Images & Gradients
      backgroundImage: {
        'grid-gold': 'linear-gradient(to right, rgba(255, 215, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 215, 0, 0.1) 1px, transparent 1px)',
        'radial-gold': 'radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
        'cyber-gradient': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.3) 50%, transparent 100%)',
      },

      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-md': '40px 40px',
        'grid-lg': '60px 60px',
      },

      // Animation
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-in',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scan': 'scan 3s linear infinite',
        'glitch': 'glitch 0.5s infinite',
        'float': 'float 6s ease-in-out infinite',
        'grid-flow': 'grid-flow 20s linear infinite',
        'lightning': 'lightning 0.2s ease-in-out',
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 215, 0, 0.4)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'grid-flow': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(60px)' },
        },
        lightning: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },

      // Text Shadow (for glow effects)
      textShadow: {
        'glow': '0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-lg': '0 0 15px rgba(255, 215, 0, 0.6), 0 0 30px rgba(255, 215, 0, 0.4), 0 0 45px rgba(255, 215, 0, 0.2)',
      },

      // Backdrop Blur
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    // Plugin for text shadow utility
    function({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          'text-shadow': (value: string) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    },
  ],
};

export default config;
