thoughtpad-plugin-manager
=========================

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

A plugin is a very simple object that must implement a single `init` function where the manager will pass a reference to itself in order for notifications to be passed around the application dynamically. This is to ensure a lightweight solution for custom development where plugins can be dropped in and out with minimum hassle.

## Usage

The manager will return a `subscribe` and `notify` function after registering all plugins that have been passed for initialisation. This allows the application to call any subscribed event with arguments even if it is not being subscribed to.

```JavaScript
var man = require('thoughtpad-plugin-manager');

var thoughtpad = man.registerPlugins([require('thoughtpad-plugin-example')]);
thoughtpad.subscribe("some-callback", function (data) {
    console.log("oh look, some data!"); 
});
thoughtpad.notify("an-event", { data: "some data" });
```

## Example Plugins

```JavaScript
var _thoughtpad;

var init = function (thoughtpad) {
    _thoughtpad = thoughtpad;

    // You should generally subscribe to all the plugin events here
    _thoughtpad.subscribe("an-event", doStuff);
},

doStuff = function *(contents) {
    // Do some stuff here, and once you're done you can optionally notify completion of the 
    // event if it is necessary to do so...
    _thoughtpad.notify("complete-event", "done");
};

module.exports = {
    init: init
};
```

## Tests

Ensure you have globally installed mocha - `npm -g install mocha`. Then you can run:

`mocha --harmony-generators`

Alternatively if you are in a *NIX environment `npm test` will run the tests plus coverage data.

## License

The code is available under the [MIT license](http://deif.mit-license.org/).

[travis-image]: https://img.shields.io/travis/hmmdeif/thoughtpad-plugin-manager/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/hmmdeif/thoughtpad-plugin-manager
[coveralls-image]: https://img.shields.io/coveralls/hmmdeif/thoughtpad-plugin-manager/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/hmmdeif/thoughtpad-plugin-manager?branch=master