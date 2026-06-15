import airbnb from 'eslint-config-flat-airbnb';
import tseslint from 'typescript-eslint';

export default [
  ...airbnb({ typescript: true, react: false }),
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'class-methods-use-this': 'off',
      'import/prefer-default-export': 'off',
      'no-plusplus': 'off',
      'no-restricted-syntax': [
        'error',
        'WithStatement',
        'LabeledStatement',
      ],
      'no-void': 'off',
      'no-continue': 'off',
      'no-await-in-loop': 'off',
      'no-alert': 'off',
      'no-console': 'off',
      'default-case': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsFor: ['canvas', 'ctx', 'host'],
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: false },
      ],
    },
  },
  {
    files: ['src/sw.ts'],
    rules: {
      'no-restricted-globals': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/dot-notation': 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.venv-assets/**',
      '../android/**',
      'scripts/**',
    ],
  },
];
