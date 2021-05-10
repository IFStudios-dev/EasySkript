// // Declare elements
const refreshBtn = document.getElementById("refresh-btn");


refreshBtn.addEventListener("click", (event) => {
    send_to_content("refresh", null);
});



// Send events to content script
function send_to_content(event, msg) {
    let fullMsg = {};
    fullMsg[event] = msg;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, fullMsg);
    });
}

