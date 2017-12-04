import babel from 'rollup-plugin-babel';
import istanbul from 'rollup-plugin-istanbul';

let pkg = require('./package.json');

let plugins = [
  babel({
    exclude: 'node_modules/**',
    plugins: ["external-helpers"]
  })
];

if (process.env.BUILD !== 'production') {
  plugins.push(istanbul({
    exclude: ['test/**/*', 'dist/**/*', 'node_modules/**/*']
  }));
}

export default {
  entry: 'lib/index.js',
  plugins: plugins,
  external: ['node-fetch', 'regenerator-runtime/runtime'],
  globals: {
   'node-fetch': 'fetch',
 },
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'printers-qt',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ]
};
