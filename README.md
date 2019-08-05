# umi-plugin-gh-pages

[![NPM version](https://img.shields.io/npm/v/umi-plugin-gh-pages.svg?style=flat)](https://npmjs.org/package/umi-plugin-gh-pages)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-gh-pages.svg?style=flat)](https://npmjs.org/package/umi-plugin-gh-pages)

umi plugin to publish to Github Pages.

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [
    ['umi-plugin-gh-pages', options],
  ],
}
```

## Options

exclude `dir` (default umi config `outputPath`), other options please checkout https://github.com/tschaub/gh-pages#options

## Examples

* https://github.com/sorrycc/test-gh-pages
* https://sorrycc.github.io/test-gh-pages/

## LICENSE

MIT
