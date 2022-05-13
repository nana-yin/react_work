const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const publicPath = '/'
const buildPath = 'build'

module.exports = {
  mode: 'development',
  entry: './app/index.jsx', // 相对路径
  output: {
    path: path.resolve(__dirname, 'build'), // 打包文件的输出路径
    filename: 'bundle.js', // 打包文件名
    publicPath: publicPath
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.html', // 指定模板路径
      filename: 'index.html' // 指定文件名
    }),
    new ESLintPlugin({
      fix: true,
      extensions: ['js', 'json', 'coffee'],
      exclude: '/node_modules/'
    })
  ],
  devServer: {
    publicPath: publicPath,
    contentBase: path.resolve(__dirname, buildPath),
    inline: true,
    hot: true
  },
  resolve: { // 解析jsx文件
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/, // 配置要处理的文件格式，一般使用正则表达式匹配
        use: {
          loader: 'babel-loader', // 使用的加载器名称
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-react-jsx']
          }
        }
      },
      { // css解析
        test: /\.less$/i,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      { // 图片解析
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false
              // limit: 8192
            }
          }
        ],
        type: 'javascript/auto'
      }
    ]
  }
}
