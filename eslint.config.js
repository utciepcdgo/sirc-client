import eslint from '@eslint/js';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser, // Use Vue parser for `.vue` files
      parserOptions: {
        parser: typescriptParser, // TypeScript parser inside Vue `<script setup>`
        extraFileExtensions: ['.vue'],
      },
      globals: {
        console: 'readonly',
        alert: 'readonly',
      },
    },
    plugins: {
      vue, // Vue plugin
      '@typescript-eslint': typescript, // TypeScript plugin
      prettier: eslintPluginPrettier, // Prettier plugin
    },
    settings: {
      'vue/setup-compiler-macros': true, // Support `defineProps()` and `defineEmits()`
    },
    rules: {
      ...eslint.configs.recommended.rules, // Base ESLint recommended rules
      ...typescript.configs.recommended.rules, // TypeScript recommended rules
      ...vue.configs['vue3-recommended'].rules, // Vue 3 recommended rules
      ...eslintConfigPrettier.rules, // Disable ESLint rules that conflict with Prettier
      'prettier/prettier': 'error', // Enforce Prettier formatting
      'arrow-body-style': ['error', 'as-needed'], // Force one-liner arrow functions
      'padding-line-between-statements': [
        'error',
        { blankLine: 'never', prev: 'block-like', next: 'return' }, // Prevents empty lines inside functions
      ],
    },
  },
  {
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.{j,t}s?(x)'],
    languageOptions: {
      env: {
        jest: true, // Enable Jest environment for test files
      },
    },
  },
];
