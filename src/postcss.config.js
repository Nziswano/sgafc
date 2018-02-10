module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-cssnext')({browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']})
  ]
}
