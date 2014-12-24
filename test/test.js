var should = require('should'),
    app = require('./../src/main'),
    example1 = require('./thoughtpad-plugin-example'),
    example2 = require('./thoughtpad-plugin-example2'),
    fs = require('co-fs'),
    co = require('co'),
    thoughtpad;

describe("registering plugins", function () {
    it("should correct subscribe to thoughtpad events", function (done) {
        thoughtpad = app.registerPlugins([example1]);
        thoughtpad.subscribe("complete-event", function *(res) {
            res.contents.should.equal("done");
        });

        co(function *() {
            yield thoughtpad.notify("an-event");
            done();
        })();
    });

    it("should correctly subscribe to multiple thoughtpad plugins", function (done) {
        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", function *(res) {
            res.contents.should.equal("done");
        });

        co(function *() {
            yield thoughtpad.notify("an-event2");
            done();
        })();
    });

    it("should reset all subscriptions on registration", function (done) {
        var count = 0;
        thoughtpad = app.registerPlugins([example1, example2]);

        thoughtpad.subscribe("complete-event2", function *(res) {
            count++;
            count.should.equal(1);
        });

        co(function *() {
            yield thoughtpad.notify("an-event2");
            done();
        })();
    });

    it("should reset config object", function (done) {
        thoughtpad = app.registerPlugins([example1]);
        thoughtpad.config = 'hello';

        thoughtpad.subscribe("complete-event", function *(res) {
            thoughtpad.config.should.equal('hello');
        });

        co(function *() {
            yield thoughtpad.notify("an-event");
        })();

        thoughtpad = app.registerPlugins([example1]);
        thoughtpad.subscribe("complete-event", function *(res) {
            (undefined === thoughtpad.config).should.be.true;
        });

        co(function *() {
            yield thoughtpad.notify("an-event");
            done();
        })();

    });

    it("should yield once all the subscribers have completed", function (done) {
        var count = 0,
            filename = __dirname + '/file.js';

        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", function *(res) {
            res.contents.should.equal("done");
            count++;
        });

        thoughtpad.subscribe("complete-event", function *(res) {            
            res.contents.should.equal("done");            
            yield fs.writeFile(filename, "text");
            yield fs.unlink(filename);           
            count++;  
        });

        co(function *() {
            yield thoughtpad.notify("an-event");
            yield thoughtpad.notify("an-event2");
            count.should.equal(3);
            done();
        })();
    });


});