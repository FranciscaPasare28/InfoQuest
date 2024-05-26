module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
    'no-restricted-syntax': 'off',
    'no-param-reassign': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
  },
};
