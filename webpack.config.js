const webpack = require("webpack")
const path = require("path")

const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const SvgStore = require("webpack-svgstore-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const StyleLintPlugin = require("stylelint-webpack-plugin")

const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin

const dev = process.env.NODE_ENV !== "production"

const hash = dev === false ? ".[hash:5]" : ""
const imgHash = dev ? "?[hash:5]" : ""

const config = {
  entry: {
    app: [
      "./src/main.js",
      "./src/assets/sass/style.scss"
    ]
  },

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: `js/[name]${hash}.js`,
    publicPath: "/"
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader",
            options: {
              sourceMap: dev
            }
          }, {
            loader: "postcss-loader"
          }, {
            loader: "sass-loader",
            options: {
              sourceMap: dev
            }
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        loader: "file-loader",
        options: {
          name: `img/[name]${hash}.[ext]${imgHash}`
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    new StyleLintPlugin({
      syntax: "scss"
    }),
    new ExtractTextPlugin({
      filename: `css/style${hash}.css`,
      disable: dev
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: !dev
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CleanWebpackPlugin(["dist"], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new SvgStore({
      svg: {
        style: "",
        class: "svg-store"
      },
      svgoOptions: {
        plugins: [{
          removeAttrs: {
            attrs: ["fill"]
          }
        }]
      },
      prefix: "icon-"
    }),
    new CopyWebpackPlugin([{
      from: "./src/assets/img",
      to: "./img"
    }])
  ],

  devtool: dev ? "source-map" : false,

  devServer: {
    contentBase: __dirname
  }
}

if (dev === false) {
  config.plugins.push(new UglifyJsPlugin())
}

module.exports = config
