module.exports = {
  printWidth: 120,
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: [require('prettier-plugin-md-nocjsp')],
  overrides: [
    {
      files: ['*.md', 'README'],
      options: {
        parser: 'markdown-nocjsp',
        quickFix: true,
      },
    },
    {
      files: ['*.mdx'],
      options: {
        parser: 'mdx-nocjsp',
        quickFix: true,
      },
    },
  ],
}
