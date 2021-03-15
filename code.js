document.querySelectorAll('*').forEach(function(node) {
    node.style.userSelect = "auto"
    node.onmousedown = "return true";
    node.onselectstart = "return true";
    node.oncontextmenu = null;
});
document.querySelectorAll('input').forEach(function(node) {
    node.oncopy = "return true"
    node.onpaste = "return true"
    node.oncut = "return true"
    node.ondrag = "return true"
    node.ondrop = "return true"
});
$(document).unbind();
jQuery.each(("blur focus focusin focusout resize scroll click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup contextmenu").split(" "), function(i, name) {
    jQuery.fn[name] = function(data, fn) {
        return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name)
    }
});
document.addEventListener('contextmenu', this.contextMenu, true);