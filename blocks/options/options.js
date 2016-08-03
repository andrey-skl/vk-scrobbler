function saveOptions(e) {
  chrome.storage.local.set({
    color: document.querySelector("#color").value
  });
}

function restoreOptions() {
  chrome.storage.local.get("color", (res) => {
    document.querySelector("#color").value = res.color || "blue";
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
