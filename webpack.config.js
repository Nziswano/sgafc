const path = require('path')
const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')
const CleanWebPackPlugin = require('clean-webpack-plugin')
const combineLoaders = require('webpack-combine-loaders')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const vendorPackages = require('./package.json')
const { CheckerPlugin } = require('awesome-typescript-loader')

const pluginConfig = [
  new HtmlWebpackPlugin(
    {
      title: 'Demo Page',
      template: './src/index.ejs'
    }
  ),
  new CheckerPlugin()
]

const moduleConfigDev = [
  {
    test: /\.html$/,
    loader: 'html-loader'
  },
  {
    test: /\.scss$/,
    exclude: /(node_modules)/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
      { loader: 'postcss-loader' },
      { loader: 'sass-loader' }
    ]
  },
  {
    test: /\.css$/,
    exclude: /(node_modules)/,
    use: [
      { loader: 'style-loader' },
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

const moduleConfigProd = [
  {
    test: /\.html$/,
    loader: 'html-loader'
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: combineLoaders([
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader'
        }
      ])
    })
  },
  {
    test: /\.css$/,
    exclude: /(node_modules)/,
    use: [
      { loader: 'style-loader' },
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
  entry: {
    app: './src/app/main.ts',
    vendor: Object.keys(vendorPackages.dependencies).filter(name => (name !== 'font-awesome' && name !== 'foundation-sites'))
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.html', '.ts', '.tsx', '.js', '.json'],
    alias: {
      '@': path.resolve('src')
    }
  },
  plugins: pluginConfig,
  devServer: serverConfig
}

if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins = (webpackConfig.plugins || []).concat([
    new BabiliPlugin({}),
    new CleanWebPackPlugin(['./dist/assets']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      async: true,
      minChunks: Infinity
    }),
    new StylelintPlugin(
      {syntax: 'scss', emitErrors: false, lintDirtyModulesOnly: true}
    ),
    new UglifyJsPlugin({
      test: /\.js($|\?)/i
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
  webpackConfig.module = { rules: moduleConfigProd }
} else {
  webpackConfig.module = { rules: moduleConfigDev }
  webpackConfig.devtool = 'eval-source-map'
}

module.exports = webpackConfig
