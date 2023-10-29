import path from 'path';
import url from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from "copy-webpack-plugin";


const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default {
    entry: "./main.js",
    mode: "production",
    devtool: 'cheap-module-source-map',
    output: {
      filename: "js/[name].js",
      path: path.resolve(__dirname, "dist")
    },
    entry: './src/client/index.js', // Your entry point for the application
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
            template: path.resolve(__dirname, "index.html"),
            filename: "index.html",
            // inject: "body",
        })
    ],
    // resolve: {
    //     extensions: ['.js', '.jsx'], // Allows you to import files without specifying their extensions
    // },
    // devServer: {
    //     contentBase: path.join(__dirname, 'dist'),
    //     port: 3000, // Set the port you want to use
    // },
};
