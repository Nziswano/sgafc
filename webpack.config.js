const path = require('path')
const BabiliPlugin = require('babili-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pluginConfig = [
  new HtmlWebpackPlugin(
    {
      title: 'Demo Page',
      template: './src/index.html'
    }
  )
]

const moduleConfig = [
  {
    test: /\.scss$/,
    exclude: /(node_modules)/,
    use: [
      { loader: 'css-loader' },
      { loader: 'postcss-loader' },
      { loader: 'sass-loader' }
    ]
  },
  {
    test: /\.css$/,
    exclude: /(node_modules)/,
    use: [
      { loader: 'css-loader' },
      { loader: 'postcss-loader' }
    ]
  },
  {
    test: /\.js$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader'
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules)/,
    use: [
      { loader: 'babel-loader' },
      { loader: 'awesome-typescript-loader' }
    ]
  },
  {
    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    exclude: /(node_modules)/,
    loader: 'url-loader?limit=100000'
  }
]

const serverConfig = {
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  open: false,
  port: 9000
}

const webpackConfig = {
  entry: './src/app/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': path.resolve('src')
    }
  },
  plugins: pluginConfig,
  module: { rules: moduleConfig },
  devServer: serverConfig
}
/*
module.exports.plugins = (module.exports.plugins || []).concat([
*/

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new BabiliPlugin({})
  ])
} else {
  webpackConfig.devtool = 'eval-source-map'
}

module.exports = webpackConfig
