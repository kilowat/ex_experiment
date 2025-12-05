import { argv } from 'node:process';
import * as esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import { sassPlugin } from 'esbuild-sass-plugin';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import SvgPlugin from 'esbuild-plugin-svg';
import { htmlPlugin } from '@jgoz/esbuild-plugin-html';
const buildPath = 'dist';
const publicPath = '/';
import { copy } from 'esbuild-plugin-copy';
const
  productionMode = argv.includes('prod'),
  watchMode = argv.includes('watch'),
  servMode = argv.includes('serv'),
  target = 'chrome100,firefox100,safari15'.split(',');

console.log(`${productionMode ? 'prod' : 'dev'} ${watchMode ? 'watch' : 'build'}`);

const build = await esbuild.context({
  entryPoints: [
    './styles/index.scss',
    { out: 'bundle', in: './src/Game.ts' },
  ],

  bundle: true,
  jsxImportSource: 'preact',
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
    'react-dom/test-utils': 'preact/test-utils',
  },
  publicPath: publicPath,
  target,
  metafile: true,
  drop: productionMode ? ['debugger', 'console'] : [],
  logLevel: productionMode ? 'error' : 'info',
  minify: productionMode,
  sourcemap: false,
  outdir: buildPath,
  inject: !productionMode ? ['livereload.js'] : [],
  platform: 'browser',
  entryNames: '[dir]/[name]-[hash]', // Добавляем хеш к имени bundle файла
  assetNames: 'assets/[name]-[hash]',
  write: true,
  tsconfig: 'tsconfig.json',
  // external: ['assets/*'],
  loader: {
    '.svg': 'file',
    '.png': 'file',
    '.jpg': 'file',
    '.gif': 'file',
    '.jpeg': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.ttf': 'file',
    '.ldtk': 'file',
    '.ldtkl': 'file',
    '.ogg': 'file',
  },
  plugins: [
    htmlPlugin({
      template: 'index.html',
      scriptPlacement: 'body-above'
    }),
    sassPlugin({

      watch: true,
      filter: /\.scss$/i,
      type: 'css',
      loadPaths: ['./src/styles'],
    }),
    esbuildPluginTsc({
      force: true,
    }),
    SvgPlugin({
      minify: true,
    }),
    /*
    copy({
      resolveFrom: 'cwd',
      assets: {
        from: ['./assets/*'],
        to: [`${buildPath}/assets`],
      },
      watch: true,
    }),
    */
    clean({
      patterns: [`${buildPath}/**/*`, `!${buildPath}/index.html`],
      cleanOnStartPatterns: ['./prepare'],
      cleanOnEndPatterns: ['./post'],
    })
  ]
});

//!watchMode ?
//clean({
//  patterns: [`${buildPath}/**/*`],
//}) : { name: 'empy', setup: () => null },

if (watchMode) {
  console.log('watching...')
  await build.watch();
} else {
  let t = Date.now()
  console.log('building...')
  await build.rebuild();
  build.dispose();
  console.log('finished in', Date.now() - t, 'ms')
}

if (servMode) {
  const serv = await build.serve({
    servedir: buildPath,
    host: 'localhost',
  });
  if (productionMode) {
    console.log(`http://${serv.host}:${serv.port}`);
  }
}