const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isProduction = process.env.NODE_ENV === 'production';
const productionPluginDefine = isProduction ? [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  })
] : [];
const clientLoaders = isProduction ? productionPluginDefine.concat([
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    },
    sourceMap: false
  })
]) : [];

var commonLoaders = [{
  test: /\.json$/,
  loader: 'json-loader'
}];

const serverConfig = {
  entry: __dirname + '/src/server.js',
  output: {
    path: __dirname + '/dist',
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    publicPath: '/'
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: nodeExternals(),
  plugins: productionPluginDefine,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      // add preset here
      options: {
        presets: ['react'],
      },
    }].concat(commonLoaders)
  }
}

const clientConfig = {
  entry: __dirname + '/src/view/browser.js',
  output: {
    path: __dirname + '/dist/assets',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: clientLoaders,
  module: {
    rules: [
      // React
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["react"],
          },
        }
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
}

// Exclusive css entry and output

// Split postcss entry so we can bundle css without
// explicitly requiring anything in our react files.,
// This way we can avoid adding postcss loaders in the serverConfig

const cssConfig = {
  entry: __dirname + '/src/view/assets/index.css',
  output: {
    path: __dirname + '/dist/assets',
    publicPath: '/',
    filename: 'bundle.css'
  },
  plugins: [new ExtractTextPlugin('bundle.css')],
  module: {
    rules: [
      // Postcss
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader',
          ]
        }),
      },
    ]
  }
}

module.exports = [
  serverConfig,
  clientConfig,
  cssConfig,
];
