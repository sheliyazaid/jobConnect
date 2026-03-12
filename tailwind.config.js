/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import lineClamp from '@tailwindcss/line-clamp';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        primary: {
          50: '#f6f5f4',
          100: '#f1e9e9',
          200: '#e8dad6',
          300: '#ddc6bf',
          400: '#d0a9a2',
          500: '#c89082',
          600: '#b67260',
          700: '#9d5f52',
          800: '#7d4a40',
          900: '#5a3632',
        },
        secondary: {
          50: '#eaf3f7',
          100: '#d4e7ef',
          200: '#a8cfe3',
          300: '#7cb7d7',
          400: '#509ecb',
          500: '#2986bf',
          600: '#1d6e9f',
          700: '#155985',
          800: '#0f426a',
          900: '#09637e',
        },
        accent: {
          50: '#fef3e8',
          100: '#fce7d0',
          200: '#f9cfa1',
          300: '#f5b872',
          400: '#f2a043',
          500: '#ef8814',
          600: '#d96d0d',
          700: '#b85309',
          800: '#933b06',
          900: '#6d2a04',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2, 6, 23, 0.08)',
      },
    },
  },
  plugins: [
    forms,
    typography,
    lineClamp,
  ],
}