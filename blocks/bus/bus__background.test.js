describe('BusBackground', function () {
  var BusBackground = window.vkScrobbler.BusBackground;
  var bus;
  var fakePort;
  var fakeHandlers;

  beforeEach(function () {
    fakeHandlers = {
      doSmth: sinon.stub().returns(new Promise(function(){})),
      successHandler: function () {
        return new Promise(function (resolve, reject) {
          resolve({some: 'bar'});
        });
      },
      throwingHandler: function () {
        return new Promise(function (resolve, reject) {
          reject({err: 'error message'});
        });
      }
    };

    fakePort = {
      onMessage: {
        addListener: sinon.stub()
      },
      postMessage: sinon.stub(),
      _fakeListenerCall: function (msg) {
        fakePort.onMessage.addListener.callArgWith(0, msg);
      }
    };

    bus = new BusBackground(fakeHandlers);

    chrome.runtime.onConnect.addListener.callArgWith(0, fakePort);
  });

  afterEach(function () {
    chrome.runtime.onConnect.addListener.reset();
  });

  it('Should init', function () {
    bus.should.been.defined;
  });

  it('Should start listening for messages on init', function () {
    bus = new BusBackground(fakeHandlers);
    sinon.stub(bus, 'listenForMessages');

    chrome.runtime.onConnect.addListener.callArgWith(0, fakePort);

    bus.listenForMessages.should.have.been.calledWith(fakePort);
  });

  it('Should save message handlers', function () {
    bus.handlers.should.be.equal(fakeHandlers);
  });

  it('Should call correct handler on message receive', function () {
    fakePort._fakeListenerCall({message: 'doSmth', data: {foo: 'bar'}});
    fakeHandlers.doSmth.should.been.calledWith({foo: 'bar'});
  });

  it('Should send response with result on promise resolving', function (done) {
    fakePort._fakeListenerCall({messageId: 'id1', message: 'successHandler', data: {}});

    setTimeout(function () {
      fakePort.postMessage.should.been.calledWith({messageId: 'id1', data: {some: 'bar'}});
      done();
    });
  });

  it('Should send response with error on promise rejecting', function (done) {
    fakePort._fakeListenerCall({messageId: 'id1', message: 'throwingHandler', data: {}});

    setTimeout(function () {
      fakePort.postMessage.should.been.calledWith({messageId: 'id1', error: {err: 'error message'}});
      done();
    });
  });

  it('Should throw error if handler is not exist', function () {

    (function () {
      fakePort._fakeListenerCall({messageId: 'id1', message: 'nonExist', data: {}});
    }).should.throw(Error);
  });
});
