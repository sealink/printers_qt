import babel from 'rollup-plugin-babel';
import istanbul from 'rollup-plugin-istanbul';
import { nodeResolve } from '@rollup/plugin-node-resolve';

let pkg = require('./package.json');

let plugins = [
  babel({
    exclude: 'node_modules/**',
  }),
  nodeResolve(),
];

if (process.env.BUILD !== 'production') {
  plugins.push(
    istanbul({
      exclude: ['test/**/*', 'node_modules/**/*', 'lib/**/*'],
    })
  );
}

export default {
  input: 'lib/index.js',
  plugins: plugins,
  external: ['regenerator-runtime/runtime'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      name: 'printers-qt',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};
