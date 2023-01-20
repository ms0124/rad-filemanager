module.exports = {
  mode: 'development',
  entry: { serverEntry: ['./src/index.tsx'] },
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
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
