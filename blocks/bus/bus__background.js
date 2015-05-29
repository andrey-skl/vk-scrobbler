(function () {

  var BusBackground = function (handlers) {
    this.handlers = handlers;

    chrome.runtime.onConnect.addListener(function(port) {
      this.listenForMessages(port);
    }.bind(this));
  };

  BusBackground.prototype.listenForMessages = function (port) {
    port.onMessage.addListener(function(msg) {
      if (this.handlers[msg.message]) {
        this.handlers[msg.message](msg.data)
          .then(function (result) {
            port.postMessage({messageId: msg.messageId, data: result});
          }, function (err) {
            port.postMessage({messageId: msg.messageId, error: err});
          });
      }
    }.bind(this));
  };

  window.vkScrobbler.BusBackground = BusBackground;
})();
