/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        // Minecraft-inspired color palette
        minecraft: {
          grass: '#7CB342',
          dirt: '#8D6E63',
          stone: '#9E9E9E',
          cobblestone: '#757575',
          wood: '#8D6E63',
          diamond: '#4FC3F7',
          emerald: '#4CAF50',
          gold: '#FFD700',
          iron: '#CFD8DC',
          redstone: '#F44336',
          lapis: '#2196F3',
          obsidian: '#212121',
          netherrack: '#8D4E85',
          endstone: '#FFF9C4',
          water: '#2196F3',
          lava: '#FF5722',
        },
        primary: {
          50: '#e8f5e8',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
          950: '#0d4f14',
        },
        secondary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
          950: '#0a3d91',
        },
        accent: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
          950: '#d84315',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          950: '#0f0f0f',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'minecraft-grass': 'linear-gradient(135deg, #7CB342 0%, #689F38 100%)',
        'minecraft-dirt': 'linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%)',
        'minecraft-stone': 'linear-gradient(135deg, #9E9E9E 0%, #757575 100%)',
        'minecraft-sky': 'linear-gradient(135deg, #87CEEB 0%, #4FC3F7 100%)',
        'minecraft-night': 'linear-gradient(135deg, #1A237E 0%, #0D47A1 100%)',
        'card-light': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        'card-dark': 'linear-gradient(145deg, #424242 0%, #616161 100%)',
        'sidebar-light': 'linear-gradient(180deg, #8D6E63 0%, #6D4C41 100%)',
        'sidebar-dark': 'linear-gradient(180deg, #212121 0%, #424242 100%)',
        'pixelated': 'repeating-conic-gradient(#000 0% 25%, transparent 0% 50%) 50% / 20px 20px',
      },
      boxShadow: {
        'professional': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'professional-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'professional-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeInDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        slideInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)'
          }
        }
      }
    },
  },
  plugins: [],
}
