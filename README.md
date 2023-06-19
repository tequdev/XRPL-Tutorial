# XRP Tutorial

Provides a tutorial on XRP Ledger that is not tied to any specific programming language.

## Installation

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Add new contents

If you create a new page, add page information to `_meta.[lang].json`, and add all language `*. [lang].mdx` files for all languages.

If you cannot translate the `_meta.[lang].json` for other languages, please provide the information in English.

For `*.[lang].mdx` file, please import English content. If you cannot create English content, import the content in the language in which you created the English content.

like

```mdx *.[lang].mdx
import AccountInfo from './AccountInfo.en.mdx'

<AccountInfo />
```

## Internationalization

### Languages already added

Modify `*.[lang].mdx` file.

In particular, untranslated contents are just import of file in other languages.

### Add new language

Add the language to next.config.js.

Language tag cannot be include for underscore. (ex. ❌`en_US` ⭕️`en-US`)

<!-- https://github.com/shuding/nextra/blob/main/packages/nextra/__test__/utils.test.ts -->

```js
module.exports = withNextra({
  i18n: {
    locales: ['en', 'ja'], // ← Add the language here
    defaultLocale: 'en',
  },
})
```

Add the language to theme.config.js.

```js
  i18n: [
    { locale: 'en', text: 'English' },
    { locale: 'ja', text: '日本語' },
    // Add the language here
  ],
```

Create a new \_meta.json,\*.mdx for all correspondence.　Any omissions will result in a 404 error for that page.

If not all pages can be translated, other pages can be imported to temporarily display a different language.
(Recommend importing English content (\*.en.mdx).)

like

```mdx *.[lang].mdx
import AccountInfo from './AccountInfo.en.mdx'

<AccountInfo />
```
