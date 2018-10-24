
module.exports = function (api, options) {
  const {
    log,
    paths,
  } = api;

  function publish(args) {
    const ghpages = require('gh-pages');
    return new Promise((resolve, reject) => {
      ghpages.publish(paths.outputPath, {
        ...options,
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
