const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
module.exports = {
  mode:'development',
  devtool: 'inline-source-map',
  devServer: {
      contentBase: './dist',
      hot:true
  },
  entry: {
    index:'./src/app.ts'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: { extensions: [ ".js", ".ts"] },
  module:{
    rules:[
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                { targets: { browsers: "last 2 versions" } } // or whatever your project requires
              ],
              "@babel/preset-typescript"
            ],
            plugins: [
              // plugin-proposal-decorators is only needed if you're using experimental decorators in TypeScript
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }]
            ]
          }
        }
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({template:'./src/index.html'}),
    new webpack.NamedModulesPlugin(),
    new copyWebpackPlugin([{
      from:__dirname+'/src/assets',//打包的静态资源目录地址
      to:'./assets' //打包到dist下面的public
  }]),
   new webpack.HotModuleReplacementPlugin()
  ]
}