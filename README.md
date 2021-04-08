# umi-plugin-gh-pages

[![NPM version](https://img.shields.io/npm/v/umi-plugin-gh-pages.svg?style=flat)](https://npmjs.org/package/umi-plugin-gh-pages)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-gh-pages.svg?style=flat)](https://npmjs.org/package/umi-plugin-gh-pages)

umi plugin to publish to Github Pages.

## Usage

Configure in `.umirc.js`,

```js
export default {
  ghPages:{
    dir:'dist',
    useCDN: false,
    getCDNUrl:(gitInfo)=>{return 'url'}
    ...gh-pages#PublishOptions
  }
}
```

## ghPages

### dir
exclude `dir` (default umi config `outputPath`), other options please checkout https://github.com/tschaub/gh-pages#options

### useCDN

use CDN in publicPath ,default use [jsdelivr](https://www.jsdelivr.com/) - A free CDN for Open Source.

### getCDNUrl

Custom CDN url.

### Deploy in GitHub pages

config/config.ts

```ts
{
  ghPages: {
    useCDN: true,
  },
}
```

```bash
umi build
```

or

```bash
$GH_PAGES_USE_CDN=true umi build
```

### Deploy in [vercel](https://vercel.com/) （now）

config/config.ts

```ts
{
  ghPages: {
    branch: 'gh-pages',
    silent: true,
    repo: `https://${process.env.GH_TOKEN}@github.com/alitajs/alita-docs.git`,
  },
}
```

set the [environment variables](https://vercel.com/docs/environment-variables) in vercel, with Production.

![image](https://user-images.githubusercontent.com/11746742/110885160-4f264680-8321-11eb-80f7-8cd6275643b8.png)

```
GH_TOKEN=[tokens]( 
https://github.com/settings/tokens)
GH_PAGES_USE_CDN=true
```

run the command

```bash
$ umi build
```

## Examples

* https://github.com/sorrycc/test-gh-pages
* https://sorrycc.github.io/test-gh-pages/
* https://github.com/alitajs/alita-docs

## LICENSE

MIT

## Other

[如何优雅的使用 CDN 优化博客](https://zhuanlan.zhihu.com/p/362871371)
