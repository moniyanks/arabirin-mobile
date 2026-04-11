const js = require('@eslint/js')
const tseslint = require('typescript-eslint')
const prettierConfig = require('eslint-config-prettier')
const globals = require('globals')

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'web-build/**',
      'coverage/**',
      'ios/**',
      'android/**',
      'package-lock.json'
    ]
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      'no-empty': 'error'
    }
  },

  {
    files: ['eslint.config.js', 'metro.config.js', 'babel.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },

  {
    files: ['app/_layout.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },

  prettierConfig
]