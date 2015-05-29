describe('Bus', function () {
  var BusContent = window.vkScrobbler.BusContent;
  var bus;
  var portName = "vk-scrobbler";
  var fakePort;

  beforeEach(function () {
    fakePort = {
      postMessage: sinon.stub(),
      onMessage: {
        addListener: sinon.stub()
      },
      _fakeListenerCall: function (msg) {
        fakePort.onMessage.addListener.callArgWith(0, msg);
      }
    };

    chrome.runtime.connect.returns(fakePort);

    bus = new BusContent(portName);

    this.clock = sinon.useFakeTimers();
  });

  afterEach(function () {
    chrome.runtime.connect.reset();
    this.clock.restore();
  });

  it('Should create port', function () {
    chrome.runtime.connect.should.been.calledWith({name: portName});
  });

  it('Should generate random message id', function () {
    var firstId = bus.generateMessageId();
    var secondId = bus.generateMessageId();

    firstId.should.not.equal(secondId);
  });

  describe('sendMessage', function () {
    it('Should return promise', function () {
      var promise = bus.sendMessage({});
      promise.should.be.instanceOf(Promise);
    });

    it('Should store message while response not returned', function () {
      sinon.stub(bus, 'generateMessageId').returns('fakeId');
      bus.sendMessage({});

      bus.activeMessages.fakeId.resolve.should.be.instanceOf(Function);
      bus.activeMessages.fakeId.reject.should.be.instanceOf(Function);
    });

    it('Should wrap data with datamodel with _messageId and post it', function () {
      sinon.stub(bus, 'generateMessageId').returns('fakeId');
      bus.sendMessage({foo: 'bar'});

      fakePort.postMessage.should.been.calledWith({
        _messageId: 'fakeId',
        data: {foo: "bar"}
      });
    });
  });

  describe('response listening', function () {
    it('Should resolve stored promise on coming message with same id', function (done) {
      sinon.stub(bus, 'generateMessageId').returns('id1');

      bus.sendMessage({foo: 'bar'}).then(function (response) {
        response.should.been.deep.equal({bar: "foo"});
        done();
      });

      fakePort._fakeListenerCall({_messageId: 'id1', data: {bar: "foo"}});
    });

    it('Should remove resolved message to free the memory', function () {
      sinon.stub(bus, 'generateMessageId').returns('id1');

      bus.sendMessage({foo: 'bar'});

      fakePort._fakeListenerCall({_messageId: 'id1', data: {bar: "foo"}});

      expect(bus.activeMessages.id1).to.be.undefined;
    });

    it('Should reject the promise if error field exist in response', function (done) {
      sinon.stub(bus, 'generateMessageId').returns('id1');
      var promise = bus.sendMessage({foo: 'bar'});

      promise.catch(function (err) {
        err.should.be.deep.equal({message: 'booo'});
        done();
      });

      fakePort._fakeListenerCall({_messageId: 'id1', error: {message: 'booo'}});

    });

    it('Should reject the promise if there is no response in 1 minute', function (done) {
      var promise = bus.sendMessage({foo: 'bar'});

      promise.catch(function () {
        done();
      });

      this.clock.tick(65 * 1000);
    });
  });
});
