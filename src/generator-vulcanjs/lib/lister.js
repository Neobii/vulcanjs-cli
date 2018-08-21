/**
 * List and count elements of the application (packages, modules, routes etc.)
 */
const fs = require('fs');
const path = require('path');
const pathFinder = require('./path-finder');
const chalk = require('chalk');

function isDirectory (dirPath) {
  return fs.lstatSync(dirPath).isDirectory();
}
function isNotPrivate (dirName) {
  return !/^_/.test(dirName);
}
function listFolders (dirPath) {
  try {
    const folderContent = fs.readdirSync(dirPath);
    const folders = folderContent.filter((folderName) => isDirectory(path.join(dirPath, folderName)));
    const validFolders = folders.filter(isNotPrivate);
    return validFolders;
  } catch (err) {
    console.log(chalk.red(`Could not find or open folder ${dirPath}`));
    console.log(err);
    return [];
  }
}

function setup (generatorSetup) {
  const getPath = pathFinder.setup(generatorSetup);

  function listPackages () {
    const appPackagesPath = getPath({ isAbsolute: true }, 'packages');
    const folders = listFolders(appPackagesPath);
    return folders;
  }
  function listModules (pkgName) {
    const packageModulesPath = pathFinder.findModules(generatorSetup, { isAbsolute: true }, pkgName);
    return listFolders(packageModulesPath);
  }
  function listAllModules () {
    const packageNames = listPackages();
    return packageNames.reduce((allModules, packageName) => [...allModules, ...listModules(packageName)], []);
  }
  function listPackagesWithNbModules () {
    const packages = listPackages();
    return packages.map((pkgName) => ({
      name: pkgName,
      numModels: listFolders(pathFinder.findModules(generatorSetup, { isAbsolute: true }, pkgName)),
    }));
  }

  function countRoutes (pkgName) {
    const packageRoutesPath = pathFinder.findRoutes(generatorSetup, { isAbsolute: true }, pkgName);
    // TODO: handle errors if the filename has been modified
    try {
      const fileContent = fs.readFileSync(packageRoutesPath, { encoding: 'utf-8' });
      const routesCount = (fileContent.match(/addRoute\(/g) || []).length;
      return routesCount;
    } catch (err) {
      console.log(chalk.red(`Could not find or open routes definition for package ${pkgName}`));
      console.log(err);
      return -1;
    }
  }
  function countModules (pkgName) {
    return listModules(pkgName).length;
  }

  function packageExists (pkgName) {
    const packageNames = listPackages();
    return packageNames.includes(pkgName);
  }

  function moduleExists (pkgName, modelName) {
    const moduleNames = listModules(pkgName);
    return moduleNames.includes(modelName);
  }

  return {
    listModules,
    listAllModules,
    listPackages,
    listPackagesWithNbModules,
    countRoutes,
    countModules,
    packageExists,
    moduleExists,
  };
}

module.exports = { setup }
  ;
