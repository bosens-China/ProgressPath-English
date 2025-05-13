import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { UnoCSSRspackPlugin } from '@unocss/webpack/rspack';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { codeInspectorPlugin } from 'code-inspector-plugin';

export default defineConfig({
  html: {
    title: 'Progresspath English',
    favicon: './src/assets/img/logo.svg',
  },
  plugins: [
    pluginReact(),
    pluginSvgr(),
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
      babelLoaderOptions(opts) {
        opts.plugins?.unshift('babel-plugin-react-compiler');
      },
    }),
  ],
  tools: {
    rspack: {
      plugins: [
        UnoCSSRspackPlugin({
          // options
        }),
        TanStackRouterRspack({ target: 'react', autoCodeSplitting: true }),
        codeInspectorPlugin({
          bundler: 'rspack',
        }),
      ],
    },
  },
  server: {
    port: 3060,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
