var _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;
    _thoughtpad.subscribe("an-event2", doStuff);
},

doStuff = function *(contents) {
    yield _thoughtpad.notify("complete-event2", "done");
};

module.exports = {
    init: init
};