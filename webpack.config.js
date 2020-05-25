const path = require("path");
const fs = require("fs");
const glob = require("glob");
const webpack = require("webpack");
const imgmin = require("imagemin-pngquant");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const inProduction = process.env.NODE_ENV === "production";

const PATHS = {
  src: path.join(__dirname, "src"),
};

module.exports = {
  entry: {
    app: ["./src/main.js", "./src/main1.scss", "./src/main.css"],
    vendor: "jquery",
  },
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "[name].[chunkhash].js",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.png|jpe?g|gif$/,
        use: [
          {
            loader: "url-loader",
            options: { limit: 0, name: "images/[name].[hash].[ext]" },
          },
          {
            loader: "img-loader",
            options: {
              plugins: [
                imgmin({
                  floyd: 0.5,
                  speed: 2,
                }),
              ],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new PurgecssPlugin({
      paths: glob.sync(`index.html`, { nodir: true }),
      minimize: inProduction,
    }),
    new webpack.LoaderOptionsPlugin({ minimize: inProduction }),
    new CleanWebpackPlugin(),
    function () {
      this.plugin("done", (stats) => {
        fs.writeFileSync(
          path.join(__dirname, "dist", "mainfest.json"),
          JSON.stringify(stats.toJson().assetsByChunkName, null, 2)
        );
      });
    },
  ],
};

if (inProduction) {
  module.exports["optimization"] = { minimize: true };
}
