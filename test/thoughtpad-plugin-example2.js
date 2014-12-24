var init = function (thoughtpad) {
    thoughtpad.subscribe("an-event2", doStuff);
},

doStuff = function *(contents) {
    yield contents.thoughtpad.notify("complete-event2", "done");
};

module.exports = {
    init: init
};