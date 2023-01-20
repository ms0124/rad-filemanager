const TerserPlugin = require('terser-webpack-plugin');
module.exports = (env, argv) => {
  return {
    mode: argv.mode === 'development' ? 'development' : 'production',
    watch: argv.mode === 'development',
    entry: { index: ['./src/index.tsx'] },
    output: {
      path: __dirname + '/dist'
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      // Add support for TypeScripts fully qualified ESM imports.
      extensionAlias: {
        '.js': ['.js', '.ts'],
        '.cjs': ['.cjs', '.cts'],
        '.mjs': ['.mjs', '.mts']
      }
    },
    module: {
      rules: [
        // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
        {
          test: /(\.scss$)|(\.css$)/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader'
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin()
      ]
    }
  };
};
