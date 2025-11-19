// eslint.config.js
import js from '@eslint/js' // ESLint core rules for JavaScript
import globals from 'globals' // Predefined global variables
import reactHooks from 'eslint-plugin-react-hooks' // ESLint plugin for React Hooks
import reactRefresh from 'eslint-plugin-react-refresh' // ESLint plugin for React Refresh
import { defineConfig, globalIgnores } from 'eslint/config' // ESLint configuration utilities

// Configuración de ESLint
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
