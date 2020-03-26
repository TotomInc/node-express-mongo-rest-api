module.exports = {
  extends: ['@totominc/typescript'],

  env: {
    jest: true,
  },

  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: '.',
  },

  settings: {
    'import/resolver': {
      typescript: {
        directory: './tsconfig.json',
      },
    },
  },

  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: false,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'always',
        vueIndentScriptAndStyle: false,
      },
    ],
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
