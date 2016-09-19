describe('Logging wrapper', function () {
  const log = window.vkScrobbler.log;
  const optionsHandlers = window.vkScrobbler.optionsHandlers;
  const STYLE = log.__style;
  let fakeOptions;
  const msg = 'foo bar';

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
    fakeOptions = {loggingEnabled: true};

    this.sinon.stub(window.console);

    this.sinon.stub(optionsHandlers, 'storageGet', (defaults, callback) => {
      return callback(fakeOptions);
    });
  });

  afterEach(function () {
    this.sinon.restore();
  });

  it('should log info', () => {
    log.i(msg).then(() => {
      window.console.info.should.have.been.calledWith(`%cvkScrobbler%c ${msg}`, `${STYLE.main}${STYLE.info}`, '');
    });
  });

  it('should not log if disabled', () => {
    fakeOptions.loggingEnabled = false;
    log.i(msg).then(() => {
      window.console.info.should.not.have.been.called;
    });
  });

  it('should log error', () => {
    log.e(msg).then(() => {
      window.console.info.should.have.been.calledWith(`%cvkScrobbler%c ${msg}`, STYLE.main + STYLE.error, '');
    });
  });

  it('should log scrobble', () => {
    const artist = 'some artist';
    const track = 'some track';
    log.s(artist, track, {scrobbles: {'@attr': {}}}).then(() => {
      window.console.info.should.have.been.calledWith('%cvkScrobbler' + '%c✔%c' + artist + ' — ' + track, STYLE.main + STYLE.info, STYLE.main + STYLE.scrobble, '');
    });
  });

});
