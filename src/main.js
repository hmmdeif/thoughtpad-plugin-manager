var subscribe = function (name, localName, callback) {
    if (!callback) {
        callback = localName;
        localName = name;
    }

    this.subscribedEvents.push({"name": name, "callback": callback, localName: localName});
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

unsubscribe = function (name, localName) {
    var i = 0,
        len = this.subscribedEvents.length,
        newSubscribedEvents = [];

    if (!localName) {
        localName = name;
    }

    for (i; i < len; i++) {
        // Find all subscribed events and remove any matching the name
        if (!(this.subscribedEvents[i].name.toLowerCase() === name.toLowerCase() && 
            this.subscribedEvents[i].localName.toLowerCase() === localName.toLowerCase())) {
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