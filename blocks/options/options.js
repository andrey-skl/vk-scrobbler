(function() {
  // Restoring options when page loads
  document.addEventListener("DOMContentLoaded", function() {
    chrome.storage.local.get({
      twitter : true,
      eq: {
        show: true,
        animation: true
      }
    }, (res) => {
      document.getElementById("twitter").checked = res.twitter;
      document.getElementById("eq-show").checked = res.eq.show;
      document.getElementById("eq-anim").checked = res.eq.animation;
    });
  });

  // Saving options
  document.getElementById("save").addEventListener("click", function(e) {
    chrome.storage.local.set({
      twitter: document.getElementById("twitter").checked,
      eq: {
        show: document.getElementById("eq-show").checked,
        animation: document.getElementById("eq-anim").checked,
      }
    });
  });
})();
