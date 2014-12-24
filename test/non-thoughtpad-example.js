var init = function (thoughtpad) {
    thoughtpad.subscribe("an-event3", doStuff);
},

doStuff = function *(contents) {
    yield contents.thoughtpad.notify("complete-event3", "done");
};

module.exports = {
    init: init
};