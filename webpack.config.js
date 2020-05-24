const webpack = require("webpack");
const { resolve, join } = require("path");
const TerserJSPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = (env) => {
  const devMode = env.prod !== true;

  return {
    mode: devMode ? "development" : "production",
    entry: {
      home: "./src/js/home.js",
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    output: {
      // publicPath: "/",
      // hashDigestLength: 16,
      filename: devMode ? "[name].[hash:7].js" : "[name].[hash:10].js",
      path: resolve(__dirname, "dist"),
    },
    devtool: devMode ? "inline-source-map" : "source-map",
    devServer: {
      // publicPath: "/",
      compress: true,
      watchContentBase: true,
      contentBase: join(__dirname, "dist"),
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
        // { test: /\.html$/, use: "html-loader", exclude: /node_modules/ },
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
              },
            },
            {
              loader: "css-loader",
            },
            {
              loader: "less-loader",
              options: {
                prependData: `@env: ${devMode ? "development" : "production"};`,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it uses publicPath in webpackOptions.output
                // publicPath: "../",
                hmr: devMode,
              },
            },
            { loader: "css-loader", options: { importLoaders: 1 } },
            "postcss-loader",
          ],
          // fallback: "style-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
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
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? "[name].[hash:7].css" : "[name].[hash:10].css",
        chunkFilename: devMode ? "[id].[hash:7].css" : "[id].[hash:10].css",
      }),
    ],
  };
};
