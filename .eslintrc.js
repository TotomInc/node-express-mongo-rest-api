module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'prettier'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'airbnb-typescript/base',
    'prettier',
  ],

  env: {
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
  },

  rules: {
    'prettier/prettier': ['error'],
  },

  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/ban-ts-ignore': 'off',
        'import/first': 'off',
      }
    },
    {
      files: ['__mocks__/**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'func-names': 'off',
        'no-underscore-dangle': 'off',
      },
    }
  ]
};
