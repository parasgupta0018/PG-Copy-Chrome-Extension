// chrome.runtime.sendMessage({ todo: "showPageAction" });

function enable() {
    document.addEventListener('contextmenu', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('paste', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('copy', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('cut', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('selectstart', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('mouseon', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('mousedown', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('mousemove', function(e) {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener('mousedown', function(e) {
        e.stopImmediatePropagation();
        e.target.style.userSelect = "text";
    }, true);

    document.querySelectorAll('*').forEach(function(node) {
        node.style.userSelect = "auto"
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.todo == "enableEvents") {
        enable();
    } else if (request.todo == "disableEvents") {
        location.reload();
    }
});