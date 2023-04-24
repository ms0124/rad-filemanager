const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');
module.exports = (env, argv) => {
  const mode = argv.mode;
  let base = {
    mode: argv.mode === 'development' ? 'development' : 'production',
    watch: argv.mode === 'development',
    entry: { index: ['./src/index.tsx'] },
    output: {
      path: path.join(__dirname, '/dist')
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      // extensions: ['.ts', '.tsx', '.js'],
      // // Add support for TypeScripts fully qualified ESM imports.
      // extensionAlias: {
      //   '.js': ['.js', '.ts'],
      //   '.cjs': ['.cjs', '.cts'],
      //   '.mjs': ['.mjs', '.mts']
      // },
      fallback: {
        path: false,
        buffer: false,
        tls: false,
        stream: false
      }
    },
    module: {
      rules: [
        // all files with a `.ts`, `.cts`, `.mts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.(js|[cm]?ts|tsx)$/,
          include: [path.resolve(__dirname, 'src')],

          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                // '@babel/preset-react',
                '@babel/preset-env',
                '@babel/preset-typescript'
              ],
              plugins: [
                '@babel/plugin-transform-typescript',
                ['@babel/plugin-proposal-class-properties', { loose: false }]
              ]
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: true }
            }
          ]
        },
        // { test: /\.([cm]?ts|tsx)$/, loader: 'ts-loader' },
        {
          test: /(\.scss$)|(\.css$)/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpg|gif|ttf|eot|woff2|woff|mp3|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 2000,
                name: 'assets/[hash].[ext]'
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css'
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, '/dist')
      },
      compress: true,
      port: 3000,
      allowedHosts: 'all',
      historyApiFallback: true,
      hot: false,
      // inline: true,
      open: true,
      https: false,
      liveReload: false,
      devMiddleware: {
        writeToDisk: true
      }
    }
  };
  //IF MODE IS PRODUCTION
  if (mode === 'production') {
    base.externals = [
      // nodeExternals(),
      {
        react: {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react'
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs2: 'react-dom',
          commonjs: 'react-dom',
          amd: 'react-dom'
        }
      }
    ];
    base.output = {
      path: __dirname + '/dist',
      filename: 'index.js',
      library: 'index',
      libraryTarget: 'umd'
    };
  }

  return base;
};