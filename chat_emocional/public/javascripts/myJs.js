function toggleButton() {
    var infoChat = document.getElementById("infoChat");
    var chat = document.getElementById("chatToggle");

    if ($(infoChat).css('display') == 'none') {
        infoChat.setAttribute('style', 'display:flex!important; -webkit-animation: slide-left .2s ease-out; -moz-animation: slide-left .2s ease-out;');
        chat.setAttribute('style', 'display:none!important; -webkit-animation: slide-right .2s ease-out; -moz-animation: slide-right .2s ease-out;');
    }
    else {
        infoChat.setAttribute('style', '-webkit-animation: slide-right .2s ease-out; -moz-animation: slide-right .2s ease-out;');
        chat.setAttribute('style', 'display:flex!important; -webkit-animation: slide-right .2s ease-out; -moz-animation: slide-right .2s ease-out;');
    }
}