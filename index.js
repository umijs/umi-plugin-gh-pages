
module.exports = function (api) {
  const {
    log,
    paths,
    userConfig
  } = api;
  api.describe({
    key: 'ghPages',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });
  function publish(args) {
    const ghpages = require('gh-pages');
    const { dir, ...ghpagesArgs } = userConfig.ghPages;
    return new Promise((resolve, reject) => {
      ghpages.publish(dir || paths.outputPath, {
        ...ghpagesArgs,
        ...args,
      }, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  api.registerCommand('gh-pages', {
    description: 'Publish to Github pages',
    usage: 'umi gh-pages [Options]',
  }, (args = {}) => {
    log.pending('Publishing...');
    publish(args).then(() => {
      log.success('Published to Github pages');
    }).catch(e => {
      log.error(e);
    });
  });
}
