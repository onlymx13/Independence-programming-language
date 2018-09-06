'use strict';
var code, sentences;
document.addEventListener('DOMContentLoaded') {
    document.getElementsByTagName('button')[0].onClick = function () {
        code = document.getElementsByTagName('textArea')[0].value;
        sentences = code.split(".");
    }
}
