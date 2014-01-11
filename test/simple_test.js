var assert = require('chai').assert,
    expect = require('chai').expect,
    webdriverjs = require('webdriverjs');
var env = GLOBAL.env = {};
var client = {};

if (env.TRAVIS) {
    client = webdriverjs.remote({ desiredCapabilities: {
                                        browserName: 'chrome',
                                        version: '27',
                                        platform: 'XP',
                                        tags: ['examples'],
                                        name: 'Run single page test using webdriverjs/Selenium.'
                                    },
                                    // for w/o sauce connect
                                    //      host: 'ondemand.saucelabs.com',
                                    //      port: 80,
                                    // use with sauce connect:
                                    host: 'localhost',
                                    port: 4445,
                                    user: env.SAUCE_USERNAME,
                                    key: env.SAUCE_ACCESS_KEY,
                                    logLevel: 'silent'
                                });
}
else
{
    client = webdriverjs.remote({ desiredCapabilities: {browserName: 'chrome'} });
}

describe('Run single page test using webdriverjs/Selenium.', function() {

    before(function(done) {
        // Add a helper command
        client.addCommand('hasText', function(selector, text, callback) {
            this.getText(selector, function(err, result) {
                assert.strictEqual(err, null);
                assert.strictEqual(result, text); // TDD
                expect(result).to.have.string(text); // BDD
            })
            .call(callback);
        });

        client.init()
        .call(done);
    });

    beforeEach(function(done) {
        this.timeout(10000); // some time is needed for the browser start up, on my system 3000 should work, too.
        // Navigate to the URL for each test
        client.url('http://localhost:3000')
        .call(done);
    });

    it('should be able to view the home page', function(done) {
        client.hasText('#title', 'Library')
        .call(done);
    });

    after(function(done) {
        client.end().call(done);
    });

});
