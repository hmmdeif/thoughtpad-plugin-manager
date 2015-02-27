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
        }).catch(done);
    });

    it("should correctly subscribe to multiple thoughtpad plugins", function (done) {
        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", function *(res) {
            res.contents.should.equal("done");
        });

        co(function *() {
            yield thoughtpad.notify("an-event2");
            done();
        }).catch(done);
    });

    it("should reset all subscriptions on registration", function (done) {
        var count = 0;
        thoughtpad = app.registerPlugins([example1, example2]);

        thoughtpad.subscribe("complete-event2", function *(res) {
            count++;            
        });

        co(function *() {
            yield thoughtpad.notify("an-event2");
            count.should.equal(1);
            done();
        }).catch(done);
    });

    it("should reset config object", function (done) {
        thoughtpad = app.registerPlugins([example1], 'hello');

        co(function *() {
            yield thoughtpad.notify("an-event");
            thoughtpad.config.should.equal('hello');

            thoughtpad = app.registerPlugins([example1]);

            yield thoughtpad.notify("an-event");
            thoughtpad.config.should.eql({});
            done();
        }).catch(done);

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
        }).catch(done);
    });

    it("should unsubscribe to multiple thoughtpad plugins", function (done) {
        var contents = "unsubbed";

        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", function *(res) {
            contents = res.contents;
        });

        thoughtpad.unsubscribe('complete-event2');

        co(function *() {
            yield thoughtpad.notify("an-event2");
            contents.should.equal("unsubbed")
            done();
        }).catch(done);
    });

    it("should unsubscribe to specific thoughtpad plugins", function (done) {
        var contents = "unsubbed";

        thoughtpad = app.registerPlugins([example1, example2]);
        thoughtpad.subscribe("complete-event2", "local", function *(res) {
            contents = res.contents;
        });

        thoughtpad.unsubscribe('complete-event2', 'otherLocal');

        co(function *() {
            yield thoughtpad.notify("an-event2");
            contents.should.equal("done");
            contents = "unsubbed";
            thoughtpad.unsubscribe('complete-event2', 'local');
            yield thoughtpad.notify("an-event2");
            contents.should.equal("unsubbed");
            done();
        }).catch(done);
    });



});