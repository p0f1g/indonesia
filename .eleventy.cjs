module.exports = function (config) {

  config.setBrowserSyncConfig({
    port: 3000,
    open: true,
    files: ["build/css/main.css", "build/js/*.js"],
  });

  config.setWatchThrottleWaitTime(100);

  return {
    dir: {
      input: 'src',
      output: 'build',
      includes: 'components',
      layouts: 'layouts',
      data: '_data',
    },
    htmlTemplateEngine: "njk",
    templateFormats: ['md', 'njk'],
  }
};