import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
    entry: {
        main: './assets/js/script.js',
        styles: './assets/css/style.scss',
    },
    output: {
        filename: '[name].bundle.js', // create `main.bundle.js`, `css.bundle.js` 
        path: path.resolve(process.cwd(), 'dist'),
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].styles.css', // create `css.styles.css`
        }),
    ],
    devServer: {
        static: path.join(process.cwd(), 'public'),
        compress: true,
        port: 9000,
    },
    mode: 'development',
};
