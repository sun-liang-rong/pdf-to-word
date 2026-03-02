import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/contexts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          light: '#6D28D9',
          dark: '#4C1D95',
        },
        background: {
          DEFAULT: 'var(--background)',
          light: 'var(--background-light)',
          dark: 'var(--background)',
          card: 'var(--background-card)',
          elevated: '#1F2937',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--foreground-muted)',
          subtle: '#6B7280',
        },
        accent: {
          cyan: 'var(--accent-cyan)',
          pink: 'var(--accent-pink)',
          emerald: 'var(--accent-emerald)',
          amber: '#F59E0B',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#0b1120',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(124, 58, 237, 0.3)' },
          '50%': { borderColor: 'rgba(124, 58, 237, 0.6)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.3), 0 10px 20px -2px rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(124, 58, 237, 0.4)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.5)',
        'glow-xl': '0 0 60px rgba(124, 58, 237, 0.6)',
        'neon': '0 0 10px rgba(124, 58, 237, 0.8), 0 0 20px rgba(124, 58, 237, 0.6), 0 0 30px rgba(124, 58, 237, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(124, 58, 237, 0.1)',
        'card-hover': '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(124, 58, 237, 0.2)',
        'primary': '0 4px 20px rgba(124, 58, 237, 0.4)',
        'primary-lg': '0 8px 30px rgba(124, 58, 237, 0.5)',
        'cyan': '0 0 20px rgba(6, 182, 212, 0.4)',
        'emerald': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(91, 33, 182, 0.05) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'primary-gradient-hover': 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
        'surface-gradient': 'linear-gradient(135deg, rgba(26, 31, 53, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
        'surface-gradient-hover': 'linear-gradient(135deg, rgba(26, 31, 53, 0.9) 0%, rgba(17, 24, 39, 1) 100%)',
      },
      borderColor: {
        primary: 'rgba(124, 58, 237, 0.3)',
        'primary-light': 'rgba(124, 58, 237, 0.2)',
        'primary-dark': 'rgba(124, 58, 237, 0.5)',
        surface: 'rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
