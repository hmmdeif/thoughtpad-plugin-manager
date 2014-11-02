thoughtpad-plugin-manager
=========================

The main interface for all thoughtpad plugins

A plugin is a very simple object that must implement a single `init` function where the manager will pass a reference to itself in order for notifications to be passed around the application dynamically. This is to ensure a lightweight solution for custom development where plugins can be dropped in and out with minimum hassle.

## Usage

The manager will return a `subscribe` and `notify` function after registering all plugins once the contents of a `package.json` file has been passed as the argument. This allows the application to call any subscribed event with arguments even if it is not being subscribed to.

```JavaScript
var man = require('thoughtpad-plugin-manager');

var thoughtpad = man.registerPlugins(require('./package.json'));
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

`npm test`

## License

The code is available under the [MIT license](http://deif.mit-license.org/).