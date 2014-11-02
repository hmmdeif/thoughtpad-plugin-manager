var co = require('co'),
    subscribedEvents = [];

var subscribe = function (name, callback) {
    subscribedEvents.push({"name": name, "callback": callback});
},

notify = function (name, res) {
    var i = 0,
        len = subscribedEvents.length;

    for (i; i < len; i++) {
        // Find all subscribed events and call them in turn
        if (subscribedEvents[i].name.toLowerCase() === name.toLowerCase()) {
            co(function *() {
                yield subscribedEvents[i].callback(res);
            })();
        } 
    }
},

thoughtpad = {
    subscribe: subscribe,
    notify: notify
},

registerPlugins = function (modules) {
    if (!modules) return;

    var i = 0,
        len = modules.length;

    for (i; i < len; i++) {
        // Initialise all the modules that have been passed
        modules[i].init(thoughtpad);
    }
    return thoughtpad;
};

module.exports = {
    registerPlugins: registerPlugins
};