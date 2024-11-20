const path = require('path');

module.exports = {
  entry: {
    popup: './popup/popup.js',
    background: './background.js',
    content: './content-scripts/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
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
              '@babel/preset-env',
              ['@babel/preset-react', {
                runtime: 'automatic'
              }]
            ],
            plugins: [
              'transform-react-jsx'
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
      "fs": false
    }
  }
};