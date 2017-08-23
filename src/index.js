#!/usr/bin/env node

const yeoman = require('yeoman-environment');
const parseArgs = require('minimist');

const argsManager = require('./argsManager');

const appGenerator = require.resolve('./generator-vulcanjs/generators/app');
const packageGenerator = require.resolve('./generator-vulcanjs/generators/package');
const modelGenerator = require.resolve('./generator-vulcanjs/generators/model');
const componentGenerator = require.resolve('./generator-vulcanjs/generators/component');
const routeGenerator = require.resolve('./generator-vulcanjs/generators/route');
const remover = require.resolve('./generator-vulcanjs/generators/remove');
const lister = require.resolve('./generator-vulcanjs/generators/list');
const init = require.resolve('./generator-vulcanjs/generators/init');
const start = require.resolve('./generator-vulcanjs/generators/start');
const config = require.resolve('./generator-vulcanjs/generators/config');

const env = yeoman.createEnv();

function runWithOptions (generator, extraOptions, callback) {
  const optionsForGenerators = parseArgs(process.argv.slice(2));
  const finalOptions = {};
  Object.assign(finalOptions, optionsForGenerators, extraOptions);
  return env.run(generator, finalOptions, callback);
}

const action = argsManager.getAction();

const componentNamesToGeneratorRegisters = {
  package: () => { env.register(packageGenerator, 'package'); },
  app: () => { env.register(appGenerator, 'app'); },
  model: () => { env.register(modelGenerator, 'model'); },
  component: () => { env.register(componentGenerator, 'component'); },
  route: () => { env.register(routeGenerator, 'route'); },
  remove: () => { env.register(remover, 'remove'); },
  list: () => { env.register(lister, 'list'); },
  init: () => { env.register(init, 'init'); },
  start: () => { env.register(start, 'start'); },
  config: () => { env.register(config, 'config'); },
};

function registerGenerator (componentName) {
  const registerFn = componentNamesToGeneratorRegisters[componentName];
  registerFn();
}

function run () {
  if (action.type === 'generate') {
    if (action.component === 'package') {
      registerGenerator('package');
      return runWithOptions('package', {
        packageName: action.args[0],
      });
    } else if (action.component === 'model') {
      registerGenerator('model');
      return runWithOptions('model', {
        packageName: action.args[0],
        modelName: action.args[1],
      });
    } else if (action.component === 'component') {
      registerGenerator('component');
      return runWithOptions('component', {
        packageName: action.args[0],
        modelName: action.args[1],
        componentName: action.args[2],
      });
    } else if (action.component === 'route') {
      registerGenerator('route');
      return runWithOptions('route', {
        packageName: action.args[0],
        routeName: action.args[1],
        routePath: action.args[2],
        componentName: action.args[3],
        layoutName: action.args[4],
      });
    }
  } else if (action.type === 'remove') {
    registerGenerator('remove');
    if (action.component === 'package') {
      return runWithOptions('remove', {
        vulcanjsComponent: 'package',
        packageName: action.args[0],
      });
    } else if (action.component === 'model') {
      return runWithOptions('remove', {
        vulcanjsComponent: 'model',
        packageName: action.args[0],
        modelName: action.args[1],
      });
    } else if (action.component === 'route') {
      return runWithOptions('remove', {
        vulcanjsComponent: 'route',
        packageName: action.args[0],
        routeName: action.args[1],
      });
    }
    return runWithOptions('remove');
  } else if (action.type === 'create') {
    registerGenerator('app');
    return runWithOptions('app', {
      appName: action.args[0],
    });
  } else if (action.type === 'list') {
    registerGenerator('list');
    return runWithOptions('list', {
      vulcanjsComponent: action.component,
      packageName: action.args[0],
    });
  } else if (action.type === 'init') {
    registerGenerator('init');
    return runWithOptions('init', {
      vulcanjsComponent: action.component,
    });
  } else if (action.type === 'start') {
    registerGenerator('start');
    return runWithOptions('start', {
    });
  } else if (action.type === 'config') {
    registerGenerator('config');
    return runWithOptions('config', {
    });
  }
}

run();
