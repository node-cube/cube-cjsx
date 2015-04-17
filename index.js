var path = require('path');
var fs = require('fs');
var coffee = require('coffee-script');
var coffeeReactTransform = require('coffee-react-transform');

/**
 * Class JsProcessor
 * @param {Object}   cube     the cube instance
 */
function CjsxProcessor(cube) {
  this.cube = cube;
}
CjsxProcessor.info = {
  type: 'script',
  ext: '.cjsx'
};

CjsxProcessor.prototype = {
  /**
   * process js file
   * @param {Path}     file     the module file relative path, based on cube base
   * @param {Object}   options  {root: path, compress:boolean, sourceMap:boolean, moduleWrap}
   * @param  {Function} callback({err, data:{source, code, sourceMap}})
   */
  process: function (file, options, callback) {
    var code;
    var root = options.root;
    try {
      code = fs.readFileSync(path.join(root, file), 'utf8');
      code = coffeeReactTransform(code);
    } catch (e) {
      // e.message = 'file not found "' + filepath + '"';
      // e.name = 'FILE_NOT_FOUND';
      return callback(e);
    }
    // return origin code if no need to transfer
    if (!options.moduleWrap) {
      return callback(null, {source: code, code: code});
    }
    code = coffee.compile(code, {
      generatedFile: path.basename(file),
      header: true,
      shiftLine: true,
      sourceRoot: '',
      sourceFiles: [path.basename(file) + '?m'],
      sourceMap: options.sourceMap
    });
    if (options.release) {
      file = file.replace(/\.coffee/g, '.js');
      options.qpath = file;
    }
    this.cube.processJsCode.call(this, file, code, options, callback);
  }
};

module.exports = CjsxProcessor;
