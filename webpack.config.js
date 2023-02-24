const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename:"bundle.css"
    }),
    new CopyPlugin({
      patterns: [
          { from: "src/assets", to: "assets" }
      ],
    }),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
};