module.exports = {
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // Your TypeScript files extension
      extends: [],
      parserOptions: {
        project: ['./tsconfig.json'], // Specify it only for TypeScript files
      },
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
  ],
};
