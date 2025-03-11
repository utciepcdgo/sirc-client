module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 4,
  useTabs: true,
  trailingComma: 'es5',
  printWidth: 80,
  arrowParens: 'always',
  bracketSameLine: true,
  overrides: [
    {
      files: ['*.ts', '*.js', '*.vue'],
      options: {
        bracketSameLine: true, // Keep single-line functions inline
      },
    },
  ],
};
