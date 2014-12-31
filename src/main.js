var co = require('co');

var subscribe = function (name, callback) {
    this.subscribedEvents.push({"name": name, "callback": callback});
},

notify = function *(name, res) {
    var i = 0,
        len = this.subscribedEvents.length;

    if (typeof res === "string") {
        res = {
            contents: res
        };
    } else {
        if (res === undefined || typeof res !== 'object') {
          res = {};
        }
    }
    res.thoughtpad = this;

    for (i; i < len; i++) {
        // Find all subscribed events and call them in turn
        if (this.subscribedEvents[i].name.toLowerCase() === name.toLowerCase()) {
            yield this.subscribedEvents[i].callback(res);
        } 
    }
},

unsubscribe = function (name) {
    var i = 0,
        len = this.subscribedEvents.length,
        newSubscribedEvents = [];

    for (i; i < len; i++) {
        // Find all subscribed events and remove any matching the name
        if (this.subscribedEvents[i].name.toLowerCase() !== name.toLowerCase()) {
            newSubscribedEvents.push(this.subscribedEvents[i]);
        }
    }
    this.subscribedEvents = newSubscribedEvents;
},

thoughtpad = {
    subscribe: subscribe,
    notify: notify,
    unsubscribe: unsubscribe,
    subscribedEvents: []
},

registerPlugins = function (modules, config) {
    if (!modules) return;

    var i = 0,
        len = modules.length;

    thoughtpad.subscribedEvents = [];
    thoughtpad.config = config || {};

    for (i; i < len; i++) {
        // Initialise all the modules that have been passed
        modules[i].init(thoughtpad);
    }
    return thoughtpad;
};

module.exports = {
    registerPlugins: registerPlugins
};