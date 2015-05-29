(function () {

  var BusBackground = function (handlers) {
    this.handlers = handlers;

    chrome.runtime.onConnect.addListener(function(port) {
      this.listenForMessages(port);
    }.bind(this));
  };

  BusBackground.prototype.listenForMessages = function (port) {
    port.onMessage.addListener(function(request) {

      if (this.handlers[request.message]) {

        return this.handlers[request.message](request.data)
          .then(function (result) {
            port.postMessage({messageId: request.messageId, data: result});
          }, function (err) {
            port.postMessage({messageId: request.messageId, error: err});
          });
      } else {
        throw new Error('Cant find listener for message: ' + request.message);
      }
    }.bind(this));
  };

  window.vkScrobbler.BusBackground = BusBackground;
})();
