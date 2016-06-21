var bluebird = require('bluebird');
var psi = require('psi');
var chalk = require('chalk');
var URL = process.env.PSI_URL; //'https://my.website.com'
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
  }),
  function (mobile, desktop) {
    var isError = false,
      mobileSpeed = mobile.ruleGroups.SPEED.score,
      desktopSpeed = desktop.ruleGroups.SPEED.score;

    console.log('=== MOBILE ===');
    console.log(chalk.cyan('score:', chalk.yellow(mobileSpeed)));
    console.log(chalk.cyan('pageStats:'), mobile.pageStats);
    console.log('=== DESKTOP ===');
    console.log(chalk.cyan('score:', chalk.yellow(desktopSpeed)));
    console.log(chalk.cyan('pageStats:'), desktop.pageStats);

    if (mobileSpeed < MOBILE_THRESHOLD) {
      console.log(chalk.red('ERROR: mobile score of'), chalk.yellow(mobileSpeed), chalk.red('is below threshold of'), chalk.yellow(MOBILE_THRESHOLD));
      isError = true;
    }
    if (desktopSpeed < DESKTOP_THRESHOLD) {
      console.log(chalk.red('ERROR: desktop score of'), chalk.yellow(desktopSpeed), chalk.red('is below threshold of'), chalk.yellow(DESKTOP_THRESHOLD));
      isError = true;
    }
    if (isError) {
      process.exit(1);
    }
    console.log(chalk.green('PSI scores passed'));
  }
).catch(function (e) {
  console.log(e);
  process.exit(1);
});