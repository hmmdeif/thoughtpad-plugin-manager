var _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;
    _thoughtpad.subscribe("an-event3", doStuff);
},

doStuff = function *(contents) {
    _thoughtpad.notify("complete-event3", "done");
};

module.exports = {
    init: init
};