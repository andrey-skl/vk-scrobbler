describe('BusBackground', function () {
  const BusBackground = window.vkScrobbler.BusBackground;
  let bus;
  let fakePort;
  let fakeHandlers;
  let fakeBeforeHandler;

  beforeEach(function () {
    fakeBeforeHandler = sinon.stub();

    fakeHandlers = {
      doSmth: sinon.stub().returns(new Promise(function(){})),
      successHandler: function () {
        return new Promise(function (resolve) {
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

    bus = new BusBackground(fakeHandlers, fakeBeforeHandler);

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

  it('Should call onBeforeHandle before handle message', function () {
    fakePort._fakeListenerCall({message: 'doSmth', data: {foo: 'bar'}});

    fakeBeforeHandler.should.been.calledWith({message: 'doSmth', data: {foo: 'bar'}});

    fakeHandlers.doSmth.should.been.calledWith({foo: 'bar'});
  });

  it('Should prevent from handling message and reject promise if beforeHandler throws error', function () {
    const err = new Error('Foo error');
    fakeBeforeHandler.throws(err);

    fakePort._fakeListenerCall({messageId: 'id1', message: 'doSmth', data: {foo: 'bar'}});

    fakeHandlers.doSmth.should.not.been.called;

    fakePort.postMessage.should.been.calledWith({messageId: 'id1', error: err});
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
