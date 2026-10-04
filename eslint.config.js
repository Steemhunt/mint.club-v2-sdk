import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  prettier,
  {
    files: ['src/**/*.ts'],
    languageOptions: { parser, parserOptions: { project: './tsconfig.json' } },
    plugins: { '@typescript-eslint': plugin },
    rules: {
      '@typescript-eslint/strict-boolean-expressions': [
        'warn',
        {
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowAny: true,
        },
      ],
    },
  },
];
