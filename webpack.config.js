import path from 'path';
import url from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from "copy-webpack-plugin";


const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default {
    entry: {
        main: './src/client/index.js',
        sendurl: './public/sendurl.js'
      },
    mode: "production",
    devtool: 'cheap-module-source-map',
    output: {
      filename: "js/[name].js",
      path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                      from: path.resolve(__dirname, "public"), 
                      to: "public", 
                },
                { 
                    from: path.resolve(__dirname, "manifest.json"), 
                    to: "manifest.json",
                 },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src/client/index.html"),
            filename: "index.html",
        })
    ],
};