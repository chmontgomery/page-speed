var bluebird = require('bluebird');
var psi = bluebird.promisify(require('psi'));
var chalk = require('chalk');
var URL = 'https://store.wsj.com';
var MOBILE_THRESHOLD = 50;
var DESKTOP_THRESHOLD = 79;

bluebird.settle([
  psi(URL, {
    nokey: 'true',
    strategy: 'mobile'
  }),
  psi(URL, {
    nokey: 'true',
    strategy: 'desktop'
  })
])
  .then(function (results) {
    var mobile = results[0].value();
    var desktop = results[1].value();
    var isError = false;

    console.log('=== MOBILE ===');
    console.log(chalk.cyan('score:', chalk.yellow(mobile.score)));
    console.log(chalk.cyan('pageStats:'), mobile.pageStats);
    console.log('=== DESKTOP ===');
    console.log(chalk.cyan('score:', chalk.yellow(desktop.score)));
    console.log(chalk.cyan('pageStats:'), desktop.pageStats);

    if (mobile.score < MOBILE_THRESHOLD) {
      console.log(chalk.red('ERROR: mobile score below threshold of', chalk.yellow(MOBILE_THRESHOLD)));
      isError = true;
    }
    if (desktop.score < DESKTOP_THRESHOLD) {
      console.log(chalk.red('ERROR: desktop score below threshold of', chalk.yellow(DESKTOP_THRESHOLD)));
      isError = true;
    }
    if (isError) {
      process.exit(1);
    }
    console.log(chalk.green('PSI scores passed'));
  })
  .catch(function (e) {
    console.log(e);
    process.exit(1);
  });