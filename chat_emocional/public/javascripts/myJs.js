function toggleButton() {
    var infoChat = document.getElementById("infoChat");

    if ($(infoChat).css('display') == 'none') {
        infoChat.setAttribute('style', 'display:flex!important;');
    }
    else {
        infoChat.setAttribute('style', 'display:none!important;')
    }
}