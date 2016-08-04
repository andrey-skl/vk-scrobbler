(function() {
  // Restoring options when page loads
  document.addEventListener("DOMContentLoaded", function() {
    console.log(document.getElementById("twitter").checked);

    chrome.storage.local.get({
      twitter : true,
      eq: {
        showTopbar: true,
        animation: true
      }
    }, (res) => {
      document.getElementById("twitter").checked = res.twitter;
      document.getElementById("eqShowTopbar").checked = res.eq.showTopbar;
    });
  });

  // Saving options
  document.getElementById("save").addEventListener("click", function(e) {
    console.log(document.getElementById("twitter").checked);

    chrome.storage.local.set({
      twitter: document.getElementById("twitter").checked,
      eq: {
        showTopbar: document.getElementById("eqShowTopbar").checked,
      }
    });
  });
})();
