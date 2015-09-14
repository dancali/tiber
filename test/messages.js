var sinon   = require('sinon');
var path    = require('path');
var fs      = require('fs-extra');
var expect  = require('chai/chai').expect;
var tiber   = require('..');

describe('Messages', function () {
  var stdin       = require('mock-stdin').stdin();
  var stub;

  beforeEach(function(done) {
    stub = sinon.stub(config, "homeDir").returns('./tmp/homedir/');
    if (fs.existsSync('./tmp')) {
      // Start off clean
      fs.removeSync('./tmp');
    }
    done();
  });

  afterEach(function(done) {
    stub.restore();
    if (fs.existsSync('./tmp')) {
      // Clean up
      fs.removeSync('./tmp');
    }
    done();
  });

  it('it can send a message', function () {
  });
});
