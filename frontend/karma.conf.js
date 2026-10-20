module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['src/tests/**/*.spec.js'],
    preprocessors: { 'src/tests/**/*.spec.js': ['webpack'] },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    reporters: ['progress', 'coverage'],
    coverageReporter: { type: 'html', dir: 'coverage/' }
  });
};
