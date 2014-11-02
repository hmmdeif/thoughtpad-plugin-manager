var _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;
    _thoughtpad.subscribe("an-event", doStuff);
},

doStuff = function *(contents) {
    _thoughtpad.notify("complete-event", "done");
};

module.exports = {
    init: init
};