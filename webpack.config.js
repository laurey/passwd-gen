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
      test: "./src/js/test.js",
      // home: resolve(__dirname, 'src/js/home'),
      // test: resolve(__dirname, 'src/js/test'),
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
      splitChunks: {
        cacheGroups: {
          // vendor: {
          //   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          //   name: 'vendor',
          //   chunks: 'all',
          // },
          // commons: {
          //   name: 'commons',
          //   chunks: 'initial',
          //   minChunks: 2
          // },
          styles: {
            name: "styles",
            test: /\.css$/,
            chunks: "all",
            // filename: "js/[name].[hash:10].bundle.js",
            enforce: true,
          },
        },
      },
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
      // hot: false,
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
            devMode
              ? "style-loader"
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: devMode,
                  },
                },
            {
              loader: "css-loader",
            },
            {
              loader: "postcss-loader",
              options: {
                config: {
                  path: resolve(__dirname),
                },
                plugins: [
                  require("autoprefixer")({
                    grid: "autoplace",
                    flexbox: true,
                  }),
                ],
              },
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
            devMode
              ? "style-loader"
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    // you can specify a publicPath here
                    // by default it uses publicPath in webpackOptions.output
                    // publicPath: "../",
                    hmr: devMode,
                  },
                },
            { loader: "css-loader", options: { importLoaders: 1 } },
            {
              loader: "postcss-loader",
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        chunks: ["home"],
        filename: "home.html",
        template: "./src/html/index.html",
      }),
      new HtmlWebpackPlugin({
        title: "Mobile Design",
        chunks: ["test"],
        filename: "test.html",
        template: "./src/html/test.html",
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: devMode ? "[name].[hash:7].css" : "[name].[hash:10].css",
        chunkFilename: devMode ? "[id].[hash:7].css" : "[id].[hash:10].css",
      }),
    ],
  };
};
