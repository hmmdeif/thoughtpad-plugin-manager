thoughtpad-plugin-manager
=========================

[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

A plugin is a very simple object that must implement a single `init` function where the manager will pass a reference to itself in order for notifications to be passed around the application dynamically. This is to ensure a lightweight solution for custom development where plugins can be dropped in and out with minimum hassle.

## Usage

The manager will return a `subscribe` and `notify` function after registering all plugins that have been passed for initialisation. This allows the application to call any subscribed event with arguments even if it is not being subscribed to.

If you pass a string to the `notify` data object, then it wil be converted to an object and the string can be found in `data.contents`. This is because the thoughtpad object is added locally to your data object so you can use the config files and notify functions.

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
var init = function (thoughtpad) {

    // You should generally subscribe to all the plugin events here
    thoughtpad.subscribe("an-event", doStuff);
},

doStuff = function *(obj) {
    // The thoughtpad obj will get added to whatever you pass in
    obj.thoughtpad.notify("complete-event", "done");
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

[travis-image]: https://img.shields.io/travis/thoughtpad/thoughtpad-plugin-manager/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/thoughtpad/thoughtpad-plugin-manager
[coveralls-image]: https://img.shields.io/coveralls/thoughtpad/thoughtpad-plugin-manager/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/thoughtpad/thoughtpad-plugin-manager?branch=master