import image from 'rollup-plugin-img';

export default {
  entry: 'src/index.tsx',
  dest: 'dist/index.js',
  plugins: [
    image({
      limit: 10000
    })
  ]
};