var sinon   = require('sinon');
var path    = require('path');
var fs      = require('fs-extra');
var expect  = require('chai/chai').expect;
var tiber   = require('..');

describe('Configuration', function () {
  var config = tiber.config;
  var stub;

  beforeEach(function(done) {
    stub = sinon.stub(config, "apiDir").returns('./test/tmp/apidir/');
    if (fs.existsSync('./test/tmp')) {
      // Start off clean
      fs.removeSync('./test/tmp');
    }
    done();
  });

  afterEach(function(done) {
    stub.restore();
    if (fs.existsSync('./test/tmp')) {
      // Clean up
      fs.removeSync('./test/tmp');
    }
    done();
  });

  it('is aware if api dir is missing', function () {
    expect(config.isTiberApi()).to.be.notOk;
  });

  it('can identify a valid api dir', function () {
    fs.mkdirsSync(config.apiDir());
    fs.writeFileSync(path.join(config.apiDir(), 'tiber.yaml'), "", 'utf8');
    expect(config.isTiberApi()).to.be.ok;
  });

});
