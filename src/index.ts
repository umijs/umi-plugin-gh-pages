import { IApi } from '@umijs/types';
import { execa } from '@umijs/utils';
import ghpages from 'gh-pages';
import hostedGitInfo from 'hosted-git-info';
import fetch from 'node-fetch';
import semver from 'semver';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

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

  const useCDN = api.userConfig?.ghPages?.useCDN || process.env.GH_PAGES_USE_CDN === 'true';

  const defaultGetCDNUrl = (gitInfo: any) => {
    return `https://cdn.jsdelivr.net/gh/${gitInfo?.user}/${gitInfo?.project}@${gitInfo?.tag}/`
  }

  if (useCDN) {
    // 自动打 tag 的情况，默认修改 publicPath
    api.modifyDefaultConfig(async (memo) => {
      const { getCDNUrl = defaultGetCDNUrl } = api.config?.ghPages || {};
      const gitInfo = await getGitInfo();
      return {
        ...memo,
        publicPath: getCDNUrl(gitInfo),
      };
    });
  }

  const getGitInfo = async () => {
    const { version, repository } = api.pkg;
    if (!repository) {
      logger.error(`Please set the repository in package.json`);
      process.exit(1);
    }
    // git 要先提交
    const gitStatus = execa.sync('git', ['status', '--porcelain']).stdout;
    if (gitStatus.length) {
      logger.profile('publish');
      logger.error(`Your git status is not clean. Aborting.`);
      process.exit(1);
    }
    // {
    //   type: "github",
    //   domain: "github.com",
    //   user: "npm",
    //   project: "hosted-git-info"
    // }
    const gitInfo = hostedGitInfo.fromUrl(repository?.url || repository);
    const data = await fetch(`https://api.github.com/repos/${gitInfo?.user}/${gitInfo?.project}/tags`).then(res => res.json());
    const versions = data.sort(function (v1: any, v2: any) {
      return semver.compare(v2.name, v1.name);
    });
    // 该仓库从未设置 tag
    const latestTag = versions[0]?.name || '0.0.1';
    let newTag = latestTag;
    if (semver.lt(latestTag, version)) {
      newTag = version;
    } else {
      newTag = semver.inc(latestTag, 'patch')
    }
    return { ...gitInfo, tag: newTag };
  }

  const publish = async () => {
    logger.profile('publish');
    const { dir, getCDNUrl, ...ghpagesArgs } = api.config?.ghPages || {};
    // 要先执行 build
    if (!existsSync(paths.absOutputPath as any)) {
      logger.profile('publish');
      logger.error(`Please execute the command 'umi build' first`);
      process.exit(1);
    }
    let tag = ghpagesArgs.tag;

    if (useCDN) {
      const gitInfo = await getGitInfo();
      tag = gitInfo?.tag;
      logger.info('git tag:', tag);
    }
    // @ts-ignore
    ghpages.publish(dir || paths.absOutputPath, {
      ...ghpagesArgs,
      tag
    }, (err: any) => {
      if (err) {
        logger.profile('publish');
        logger.error(err);
        // 如果发生错误，执行中断
        process.exit(1);
      }
      logger.profile('publish');
      logger.info('Published to Github pages');
    });
  }
  api.registerCommand({
    name: 'gh-pages',
    description: 'Publish to Github pages',
    details: 'umi gh-pages [Options]',
    fn: ({ args }) => {
      publish();
    }
  });

  api.onBuildComplete(({ err }) => {
    //@ts-ignore
    if (!err && !existsSync(join(paths.absOutputPath!, "404.html"))) {
      // 如果没有 404 则复制一下 index
      copyFileSync(
        join(paths.absOutputPath!, "index.html"),
        join(paths.absOutputPath!, "404.html")
      );
    }

    if (useCDN) {
      publish();
    }
  });
}
