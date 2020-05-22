const webpack = require("webpack");
const { resolve, join } = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const extractCSS = new ExtractTextPlugin("style/[name].[hash:7]-1.css");
const extractLESS = new ExtractTextPlugin("style/[name].[hash:7]-2.css");

let config = {
  mode: "development",
  entry: {
    home: "./src/home.js",
  },
  output: {
    publicPath: "/",
    hashDigestLength: 16,
    filename: "[name].[hash].js",
    path: resolve(__dirname, "dist"),
  },
  devtool: "inline-source-map",
  devServer: {
    publicPath: "/",
    compress: true,
    watchContentBase: true,
    contentBase: join(__dirname, "public"),
  },
  module: {
    rules: [
      {
        test: /\.m?(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        loader: "url-loader",
        options: {
          limit: 8192,
        },
      },
      { test: /\.html$/, use: "html-loader", exclude: /node_modules/ },
      {
        test: /\.less$/,
        use: extractLESS.extract({
          use: [
            {
              loader: "css-loader"
            },
            {
              loader: "less-loader",
              options: {
                prependData: `@env: ${process.env.NODE_ENV};`,
              },
            },
          ],
          fallback: "style-loader",
        }),
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          // use: ["css-loader", "postcss-loader"],
          use: ["css-loader"],
          fallback: "style-loader",
        }),
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // chunks: ["home"],
      filename: "index.html",
      template: "./src/html/index.html",
    }),
    // new HtmlWebpackPlugin({
    //   chunks: ["app"],
    //   filename: "app.html",
    //   template: "src/html/app.html",
    // }),
    // new ExtractTextPlugin("style/[name].[hash].css"),
    extractCSS,
    extractLESS,
  ],
};

module.exports = config;
