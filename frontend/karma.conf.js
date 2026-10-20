const webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: ['karma-jasmine', 'karma-webpack', 'karma-chrome-launcher', 'karma-coverage'],
    files: [{ pattern: 'src/tests/**/*.spec.js', watched: false }],
    preprocessors: { 'src/tests/**/*.spec.js': ['webpack'] },

    // Compila JSX y mide cobertura del código real (src/), no de los tests
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { chrome: '100' } }],
                ['@babel/preset-react', { runtime: 'automatic' }]
              ],
              plugins: [['istanbul', { exclude: ['**/tests/**'] }]]
            }
          }
        }]
      },
      plugins: [
        // Fuera de react-scripts "process" no existe en el navegador: se fija a vacío (usa la URL por defecto)
        new webpack.DefinePlugin({ 'process.env.REACT_APP_API_URL': JSON.stringify('') })
      ]
    },

    // Chrome sin interfaz. --no-sandbox es necesario en Docker/CI/root; en tu PC no molesta.
    // Si Karma no encuentra Chrome define la variable CHROME_BIN con la ruta del ejecutable.
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] }
    },

    singleRun: true,
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [{ type: 'html' }, { type: 'text-summary' }]
    }
  });
};
