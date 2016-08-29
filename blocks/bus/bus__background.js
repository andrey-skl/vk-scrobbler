(function () {

  const BusBackground = function (handlers, onBeforeHandler) {
    this.handlers = handlers;
    this.beforeHandle = onBeforeHandler;

    chrome.runtime.onConnect.addListener(function (port) {
      this.port = port;
      this.listenForMessages(port);
    }.bind(this));
  };

  BusBackground.prototype.doBeforeHandleCheck = function (request) {
    if (this.beforeHandle) {
      try {
        return this.beforeHandle(request);
      } catch (e) {
        return e;
      }
    }
  };

  BusBackground.prototype.listenForMessages = function (port) {
    port.onMessage.addListener(function (request) {

      if (this.handlers[request.message]) {

        const beforeHandleResult = this.doBeforeHandleCheck(request);
        if (beforeHandleResult) {
          return port.postMessage({messageId: request.messageId, error: beforeHandleResult});
        }

        return this.handlers[request.message](request.data)
          .then(function (result) {
            port.postMessage({messageId: request.messageId, data: result});
          }, function (err) {
            port.postMessage({messageId: request.messageId, error: err});
          });
      } else {
        const error = new Error('Cant find listener for message: ' + request.message);
        port.postMessage({messageId: request.messageId, error: error});
        throw error;
      }
    }.bind(this));
  };

  BusBackground.prototype.close = function () {
    this.port.disconnect();
  };

  window.vkScrobbler.BusBackground = BusBackground;
})();
