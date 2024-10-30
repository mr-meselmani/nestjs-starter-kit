/**
 * @type {import("eslint").Linter.Config}
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': ['error'],
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      { selector: 'typeAlias', format: ['PascalCase'] },
      { selector: 'interface', prefix: ['I'], format: ['PascalCase'] },
      { selector: 'typeParameter', format: ['PascalCase'] },
      { selector: 'class', format: ['PascalCase'] },
      {
        selector: 'function',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      { selector: 'enum', format: ['PascalCase', 'UPPER_CASE'] },
      { selector: 'enumMember', format: ['UPPER_CASE'] },
      {
        selector: 'property',
        format: ['camelCase', 'snake_case', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
    ],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    eqeqeq: ['error', 'smart'],
    'no-fallthrough': 'error',
  },
};
