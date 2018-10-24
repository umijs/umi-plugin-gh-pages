import { join } from 'path';

export default {
  base: '/test-gh-pages/',
  publicPath: '/test-gh-pages/',
  plugins: [
    join(__dirname, '..', require('../package').main || 'index.js'),
  ],
}
