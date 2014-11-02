var should = require('should'),
    app = require('./../src/main'),
    example1 = require('./thoughtpad-plugin-example'),
    example2 = require('./thoughtpad-plugin-example'),
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

});