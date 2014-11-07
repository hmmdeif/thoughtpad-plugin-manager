var should = require('should'),
    app = require('./../src/main'),
    example1 = require('./thoughtpad-plugin-example'),
    example2 = require('./thoughtpad-plugin-example2'),
    fs = require('co-fs'),
    co = require('co'),
    thoughtpad;

describe("registering plugins", function () {
    it("should correct subscribe to thoughtpad events", function () {
        thoughtpad = app.registerPlugins([example1]);
        thoughtpad.subscribe("complete-event", function *(res) {
            res.should.equal("done");
        });

        thoughtpad.notify("an-event");
    });

    it("should correctly subscribe to multiple thoughtpad plugins", function () {
        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", function *(res) {
            res.should.equal("done");
        });

        thoughtpad.notify("an-event2");
    });

    it("should reset all subscriptions on registration", function () {
        var count = 0;
        thoughtpad = app.registerPlugins([example1, example2]);

        thoughtpad.subscribe("complete-event2", function *(res) {
            count++;
            count.should.equal(1);
        });

        thoughtpad.notify("an-event2");
    });

    it("should yield once all the subscribers have completed", function (done) {
        var count = 0,
            filename = __dirname + '/file.js';

        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", function *(res) {
            res.should.equal("done");
            count++;
        });

        thoughtpad.subscribe("complete-event", function *(res) {            
            res.should.equal("done");            
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