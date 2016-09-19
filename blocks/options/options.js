(function() {
  'use strict';

  const optionsHandlers = window.vkScrobbler.optionsHandlers;

  // Restoring options when page loads
  document.addEventListener('DOMContentLoaded', function() {
    optionsHandlers.storageGet({
      twitter: true,
      eq: {
        showTopbar: true,
        animation: true
      },
      loggingEnabled: false,
      gaEnabled: true
    }, (res) => {
      document.getElementById('twitter').checked = res.twitter;
      document.getElementById('eqShowTopbar').checked = res.eq.showTopbar;
      document.getElementById('loggingEnabled').checked = res.loggingEnabled;
      document.getElementById('gaEnabled').checked = res.gaEnabled;
    });
  });

  // Saving options and adding styles to button
  document.getElementById('save').addEventListener('click', function() {
    optionsHandlers.storageSet({
      twitter: document.getElementById('twitter').checked,
      eq: {
        showTopbar: document.getElementById('eqShowTopbar').checked,
      },
      loggingEnabled: document.getElementById('loggingEnabled').checked,
      gaEnabled: document.getElementById('gaEnabled').checked,
    });
    this.classList.add('btn--done');
    this.innerHTML = '&#10004;';
  });

  // Remove `done` style from button, when checkbox clicked
  document.getElementById('optionsRows').addEventListener('click', function() {
    document.getElementById('save').classList.remove('btn--done');
    document.getElementById('save').innerHTML = 'Save';
  });

})();
