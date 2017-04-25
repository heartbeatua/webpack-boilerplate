var webpack = require('webpack');
var path = require('path');

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SvgStore = require('webpack-svgstore-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';
var hash = isProd ? '.[hash:5]' : '';

module.exports = {

  entry: {
    app: [
      './src/main.js',
      './src/assets/sass/style.scss'
    ]
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name]' + hash + '.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: !isProd
            }
          }, {
            loader: 'postcss-loader'
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: !isProd
            }
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name]' + hash + '.[ext]' + (!isProd ? '?[hash:5]' : '')
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/style' + hash + '.css',
      disable: !isProd
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProd
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new SvgStore({
      svg: {
        style: '',
        class: 'svg-store'
      },
      svgoOptions: {
        plugins: [{
          removeAttrs: {
            attrs: ['fill']
          }
        }]
      },
      prefix: 'icon-'
    }),
    new CopyWebpackPlugin([{
      from: './src/assets/img',
      to: './img'
    }])
  ],

  devtool: !isProd ? 'source-map' : false,

  devServer: {
    contentBase: __dirname
  }

};

if (isProd) {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin());
}