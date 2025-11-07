/** @type {import('next').NextConfig} */
const isCI = process.env.GITHUB_ACTIONS === 'true';
const repo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';

module.exports = {
  output: 'export', // 静的出力（GitHub Pages向け）
  basePath: isCI && repo ? `/${repo}` : '',
  assetPrefix: isCI && repo ? `/${repo}/` : '',
  images: { unoptimized: true }, // export時に必要
  trailingSlash: true // GitHub Pagesの相対パス安定化
};
