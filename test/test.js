var TestMod = require('../index');
var expect = require('expect.js');

describe('cube-ejs', function () {
  it('expect info', function () {
    expect(TestMod.info.type).to.be('template');
    expect(TestMod.info.ext).to.be('.ejs');
  });
  it ('expect processor ejs file fine', function (done) {
    require = function () {
      return {};
    };
    var options = {
      release: false,
      moduleWrap: true,
      compress: true,
      qpath: '/test.ejs',
      root: __dirname
    };
    var cube = {
      config: options,
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '",' + JSON.stringify(require) + ',function(module){' + code + ';return module.exports});';
      }
    };
    function Cube(mod, requires, cb) {
      expect(mod).to.be('/test.ejs');
      expect(requires).to.eql(['ejs_runtime']);
      var tpl = cb({});
      expect(tpl({name: 'fishbar'})).to.match(/<div>fishbar<\/div>/);
      done();
    }
    var processor = new TestMod(cube);
    processor.process('/test.ejs', options, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code', 'wraped']);
      expect(res.source).match(/<%= name %>/);
      console.log(res.wraped);
      eval(res.wraped);
    });
  });

  it ('expect processor error ejs file, return error', function (done) {
    require = function () {
      return {};
    };
    var options = {
      release: false,
      moduleWrap: true,
      compress: true,
      qpath: '/test_err.ejs',
      root: __dirname
    };
    var cube = {
      config: options,
      wrapTemplate: function (file, code, require) {
        return 'Cube("' + file + '",' + JSON.stringify(require) + ',function(module){' + code + ';return module.exports});';
      }
    };
    var processor = new TestMod(cube);
    processor.process('/test_err.ejs', options, function (err, res) {
      expect(err).to.be.ok();
      done();
    });
  });
});