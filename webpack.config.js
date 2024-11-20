const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    popup: './popup/popup.js',
    background: './background.js',
    content: './content-scripts/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  chrome: "88"
                }
              }],
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      "path": false,
      "fs": false,
      "os": false,
      "crypto": false
    }
  },
  plugins: [
    new Dotenv({
      systemvars: true,
      safe: false,
      defaults: false,
      path: '.env'
    })
  ],
  optimization: {
    minimize: false
  }
};