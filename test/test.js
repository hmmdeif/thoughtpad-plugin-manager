var should = require('should'),
    app = require('./../src/main'),
    thoughtpad;

describe("registering plugins", function () {
    it("should require thoughtpad plugin", function () {
        var contents = require("./package.json");

        thoughtpad = app.registerPlugins(contents);
        thoughtpad.subscribe("complete-event", function *(res) {
            res.should.equal("done");
        });

        thoughtpad.notify("an-event");
    });

    it("should require multiple thoughtpad plugins", function () {
        var contents = require("./package.json");

        thoughtpad = app.registerPlugins(contents);
        thoughtpad.subscribe("complete-event2", function *(res) {
            res.should.equal("done");
        });

        thoughtpad.notify("an-event2");
    });

    it("should not require non-thoughtpad plugins", function () {
        var contents = require("./package.json");

        thoughtpad = app.registerPlugins(contents);
        thoughtpad.subscribe("complete-event3", function *(res) {
            true.should.be.false; // Should never get here
        });

        thoughtpad.notify("an-event3");
    });
});