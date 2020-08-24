// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const main = {
  mode: 'development',
  target: 'electron-main',
  entry: path.join(__dirname, 'src', 'main'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /.ts?$/,
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: ['ts-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
};

const renderer = {
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  entry: path.join(__dirname, 'src', 'renderer', 'index'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist', 'scripts'),
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: ['ts-loader'],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules'),
        ],
      },
    ],
  },
};

const settings_renderer = {
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  entry: path.join(__dirname, 'src', 'settings_renderer', 'settings'),
  output: {
    filename: 'settings.js',
    path: path.resolve(__dirname, 'dist', 'scripts'),
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        use: ['ts-loader'],
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules'),
        ],
      },
    ],
  },
};

module.exports = [main, renderer, settings_renderer];
