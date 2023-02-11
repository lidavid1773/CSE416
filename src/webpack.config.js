// const path = require('path');
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const JavaScriptObfuscator = require('webpack-obfuscator');
const Buffer= require("buffer")
// module.exports = {;
//   entry: './src/index.ts',
//   output: {
//     filename: 'crdt.js',
//     path: path.resolve(__dirname, '../server/views/library'),
//   },
//   mode: 'production',
//   resolve: {
//     extensions: ['.ts', '.js', '.json'],
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(ts|js)?$/,
//         use: {
//           loader: 'babel-loader',
//         },
//         exclude: /node_modules/,
//       },    
//     ]
//   },
//   plugins: [
//     new ForkTsCheckerWebpackPlugin(),
//     new HtmlWebpackPlugin({
//       template: 'index.html'
//     }),
//     new JavaScriptObfuscator({
//       rotateStringArray: true
//     })
//   ],
//   performance: {
//     hints: false,
//     maxEntrypointSize: 512000,
//     maxAssetSize: 512000
//   }
// };

// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  devtool: "eval-cheap-source-map",
  entry: "./src/index.js",
  // output: {
  //   path: path.resolve(__dirname, "../server/views/" , "dist"),
  // },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new HtmlWebpackPlugin.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
  }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  resolve: {
        fallback: {
            buffer: require.resolve('buffer/'),
        },
    },
   
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};
