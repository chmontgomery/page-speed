var bluebird = require('bluebird');
var psi = bluebird.promisify(require('psi'));
var chalk = require('chalk');
var URL = process.env.PSI_URL; //'https://store.wsj.com'
var MOBILE_THRESHOLD = process.env.PSI_MOBILE_THRESHOLD; //50
var DESKTOP_THRESHOLD = process.env.PSI_DESKTOP_THRESHOLD; //79

bluebird.join(
  psi(URL, {
    nokey: 'true',
    strategy: 'mobile'
  }),
  psi(URL, {
    nokey: 'true',
    strategy: 'desktop'
  })
)
  .spread(function (mobile, desktop) {
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