var path = require('path');
module.exports = {
    context: __dirname,
    entry: {
        'vanilla': './vanilla.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/react-worker-dom/dist'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0',
        }]
    },
    externals: [
    ],
    resolve: {
        alias: {
        }
    },
};
