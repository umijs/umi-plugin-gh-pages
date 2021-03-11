import { IApi } from '@umijs/types';
import ghpages from 'gh-pages';

export default (api: IApi) => {
  const {
    paths,
    logger
  } = api;
  api.describe({
    key: 'ghPages',
    config: {
      schema(joi) {
        return joi.object();
      },
    },
  });
  function publish(args: any) {
    const { dir, ...ghpagesArgs } = api.config.ghPages || {};
    return new Promise((resolve, reject) => {
      ghpages.publish(dir || paths.absOutputPath, {
        ...ghpagesArgs,
        ...args,
      }, (err: any) => {
        if (err) {
          return reject(err);
        }
        // @ts-ignore
        resolve();
      });
    });
  }

  api.registerCommand({
    name: 'gh-pages',
    description: 'Publish to Github pages',
    details: 'umi gh-pages [Options]',
    fn: ({ args }) => {
      logger.profile('gh-pages');
      publish(args).then(() => {
        logger.profile('gh-pages');
        logger.info('Published to Github pages');
      }).catch(e => {
        logger.error(e);
      });
    }
  });
}
// , {
//   description: 'Publish to Github pages',
//   usage: 'umi gh-pages [Options]',
// }