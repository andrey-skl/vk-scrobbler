(function () {

  var BusContent = function (name) {
    this.connection = chrome.runtime.connect({name: name});
    this.activeMessages = {};
    this.startResponsesListening();
  };

  BusContent.prototype.generateMessageId = function () {
    var random = Math.random() * 1000000000000;
    return random.toFixed();
  };

  BusContent.prototype.startResponsesListening = function () {
    this.connection.onMessage.addListener(function (msg) {
      var storedMessage = this.activeMessages[msg._messageId];
      storedMessage.resolve(msg.data);
      //free memory
      delete this.activeMessages[msg._messageId];
    }.bind(this));
  };

  BusContent.prototype.sendMessage = function (data) {
    var promise = new Promise(function (resolve, reject) {
      var id = this.generateMessageId();

      this.activeMessages[id] = {
        resolve: resolve,
        reject: reject
      };

      this.connection.postMessage({
        _messageId: id,
        data: data
      });

    }.bind(this));

    return promise;
  };

  window.vkScrobbler.BusContent = BusContent;
})();
