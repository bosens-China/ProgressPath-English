import config from '../../eslint.config.mjs';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  ...config,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  reactRefresh.configs.recommended,
  reactCompiler.configs.recommended,
  { ignores: ['dist/'] },
];
