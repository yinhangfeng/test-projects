import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import memory from 'rollup-plugin-memory';
import nodeResolve from 'rollup-plugin-node-resolve';
import simpleMemory from './plugins/simple-memory';

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'lib/index.js',
  useStrict: true,
  // treeshake: false,
  plugins: [
    // memory 这个插件有问题 path必须设为和entry一致 且contents 需要引用原entry
    // memory({
    //   path: 'xxxx.js',
    //   contents: `module.exports = function() {console.log('xxx/xxx')}`,
    // }),

    simpleMemory({
      modules: {
        'memory-aaa': `//memory-aaa
        import mbbb from 'memory-bbb';

        export default function() {console.log(mbbb)};
        `,
        'memory-bbb': `
        //memory-bbb
        export default {aaa: 1}`,
        'memory-json.json': `{"aaa": 1}`,
      },
    }),
    // nodeResolve({
		// 	main: true
		// }),
    json(),
    commonjs({
      // non-CommonJS modules will be ignored, but you can also
      // specifically include/exclude files
      // include: 'node_modules/**',  // Default: undefined
      // exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],  // Default: undefined

      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      // extensions: [ '.js', '.coffee' ],  // Default: [ '.js' ]

      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false

      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: true,  // Default: true

      // explicitly specify unresolvable named exports
      // (see below for more details)
      namedExports: { './lib/import/a1.js': ['a', 'b' ] },  // Default: undefined

      // sometimes you have to leave require statements
      // unconverted. Pass an array containing the IDs
      // or a `id => boolean` function. Only use this
      // option if you know what you're doing!
      // ignore: [ 'conditional-runtime-dependency' ]
    }),
    // babel(babelrc()),
    // istanbul({
    //   exclude: ['test/**/*', 'node_modules/**/*']
    // })
  ],
  external: external,
  targets: [
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'rollupStarterProject',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    },
    {
      dest: 'dist/rollup-starter-project.cjs.js',
      format: 'cjs',
      sourceMap: true
    },
    {
      dest: 'dist/rollup-starter-project.iife.js',
      format: 'iife',
      moduleName: 'rollupStarterProject',
      sourceMap: true
    }
  ]
};