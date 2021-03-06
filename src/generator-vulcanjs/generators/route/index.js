const VulcanGenerator = require('../../lib/VulcanGenerator');
const ast = require('../../lib/ast');

module.exports = class extends VulcanGenerator {
  initializing() {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments() {
    this._registerOptions(
      'packageName',
      'routeName',
      'routePath',
      'componentName',
      'layoutName'
    );
  }

  prompting() {
    if (!this._canPrompt()) { return false; }
    const argsAndQuestions = [
      { arg: 'packageName', question: 'packageNameList' },
      { arg: 'routeName' },
      { arg: 'routePath' },
      { arg: 'componentName' },
      { arg: 'layoutName' },
    ];
    const questions = argsAndQuestions.reduce((currentQuestions, { arg, question }) => {
      if (this._needArg(arg)) {
        const questionName = question || arg;
        return [...currentQuestions, ...this._getQuestions(questionName)];
      }
      return currentQuestions;
    }, []);
    return this.prompt(questions)
      .then((answers) => {
        this.props = {
          packageName: this._finalize('packageName', answers),
          componentName: this._finalize('componentName', answers),
          routeName: this._finalize('raw', 'routeName', answers),
          routePath: this._finalize('raw', 'routePath', answers),
          layoutName: this._finalize('raw', 'layoutName', answers),
          addRouteStatement: this._finalize('addRouteStatement', answers),
        };
      });
  }

  _updateRoutes() {
    const routesPath = this._getPath(
      { isAbsolute: true },
      'routes'
    );

    const fileText = this.fs.read(routesPath);
    const fileTextWithWithImport = ast.appendCode(
      fileText,
      this.props.addRouteStatement
    );
    this.fs.write(
      routesPath,
      fileTextWithWithImport
    );
  }

  configuring() {
    if (!this._canConfigure()) { }
  }

  writing() {
    if (!this._canWrite()) { return; }
    this._updateRoutes();
  }

  end() {
    this._end();
  }
};
