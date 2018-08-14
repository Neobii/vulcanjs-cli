const VulcanGenerator = require('../../../lib/VulcanGenerator');

module.exports = class extends VulcanGenerator {
  initializing () {
    this._assert('isVulcan');
    this._assert('hasNonZeroPackages');
  }

  _registerArguments () {
    this._registerOptions(
      'packageName',
      'modelName'
    );
  }

  prompting () {
    if (!this._canPrompt()) { return false; }
    const questions = this._getQuestions(
      'packageNameWithNumModelsList',
      'modelNameList'
    );
    return this.prompt(questions)
      .then((answers) => {
        this.props = {
          packageName: this._finalize('packageName', answers),
          modelName: this._finalize('modelName', answers),
          typeName: this._finalize('typeName', answers),
          collectionName: this._finalize('collectionName', answers),
        };
      });
  }

  _writeFragments () {
    this.fs.copyTpl(
      this.templatePath('fragments.js'),
      this._getPath(
        { isAbsolute: true },
        'model',
        'fragments.js'
      ),
      this.props
    );
  }

  _writeTestFragments () {
    const testProps = {
      ...this.props,
      subjectName: 'fragments',
      subjectPath: `../../../lib/models/${this.props.modelName}/fragments`,
    };
    this.fs.copyTpl(
      this.templatePath('../../templates/generic-test.js'),
      this._getPath(
        { isAbsolute: true },
        'modelTest',
        'fragments.spec.js'
      ),
      testProps
    );
  }

  writing () {
    if (!this._canWrite()) { return; }
    this._writeFragments();
    // this._writeTestFragments();
  }

  end () {
    this._end();
  }
};
