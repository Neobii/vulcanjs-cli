const minimist = require('minimist');
const _ = require('lodash');
const chalk = require('chalk');

const recognizedActions = {
  generate: 'generate',
  g: 'generate',
  create: 'create',
  c: 'create',
  remove: 'remove',
  r: 'remove',
  list: 'list',
  l: 'list',
  un: 'unshallow',
  unshallow: 'unshallow',
  start: 'start',
};

const genericProcessor = (args) => {
  const argsToProcess = args.slice(1);
  const action = {
    type: recognizedActions[args[0]],
    args: [],
  };
  if (argsToProcess.length > 0) {
    action.component = argsToProcess[0];
  }
  argsToProcess.shift();
  if (argsToProcess.length > 0) {
    action.args = argsToProcess;
  }
  return action;
};

const createProcessor = (args) => ({
  type: 'create',
  args: args.slice(1),
});

const argsProcessors = {
  generate: genericProcessor,
  remove: genericProcessor,
  list: genericProcessor,
  create: createProcessor,
  start: genericProcessor,
};

function usage () {
  const values = _.uniq(_.values(recognizedActions));
  console.log(chalk.green('\nvulcan usage:'));
  console.log(chalk.grey('\nSynopsis'));
  console.log('  vulcan <action> <object> <...>\n');
  console.log('    <action>   Operation to perform ');
  console.log('    <object>   Asset type (contextual to action)');
  console.log('    <...>      Parameters. If not provided, interactively entered');
  //  console.log(chalk.grey('\nProject run'));
  //  console.log('  vulcan start');
  console.log(chalk.grey('\nProject initialisation'));
  console.log('  vulcan create <appName>');
  // console.log('  vulcan unshallow ');
  console.log(chalk.grey('\nAssets creation'));
  console.log('  vulcan (generate|g) package <packageName>');
  console.log('  vulcan (generate|g) module <packageName> <moduleName>');
  console.log('  vulcan (generate|g) component <packageName> <componentName>');
  console.log('  vulcan (generate|g) route <packageName> <routeName> <routePath>');
  console.log(chalk.grey('\nAssets removal'));
  console.log('  vulcan (remove|r) package');
  console.log('  vulcan (remove|r) module');
  console.log(chalk.grey('\nAssets listing'));
  console.log('  vulcan (list|l) packages');
  process.exit();
}

function getAction () {
  const args = minimist(process.argv.slice(2))._;

  if (!recognizedActions[args[0]]) {
    usage();
  }
  const actionName = recognizedActions[args[0]];
  const actionObj = argsProcessors[actionName](args);
  return actionObj;
}

module.exports = {
  getAction,
};
