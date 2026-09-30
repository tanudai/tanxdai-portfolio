// The film components live in ../src/film and resolve `react` from wherever they sit.
// Pin every React import to this package's copy so there is exactly one React in the bundle.
import { Config } from '@remotion/cli/config';
import path from 'node:path';

const here = path.resolve('node_modules');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(2); // fanless MacBook: keep renders gentle
// Use the automatic JSX runtime (the loader otherwise infers classic mode, as there is no tsconfig here).
const automaticJsx = rule => ({ ...rule, use: rule.use?.map?.(step => (step?.loader?.includes('esbuild-loader') ? { ...step, options: { ...step.options, jsx: 'automatic' } } : step)) ?? rule.use });
Config.overrideWebpackConfig(config => ({
  ...config,
  module: { ...config.module, rules: config.module.rules.map(rule => (rule && typeof rule === 'object' && Array.isArray(rule.use) ? automaticJsx(rule) : rule)) },
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias || {}),
      react: path.join(here, 'react'),
      'react-dom': path.join(here, 'react-dom'),
    },
  },
}));
