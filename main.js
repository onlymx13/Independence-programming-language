'use strict';
var text, sentences, code;
function throwError(error) {
    alert(error);
}
document.addEventListener('DOMContentLoaded') {
    document.getElementsByTagName('button')[0].onClick = function () {
        text = document.getElementsByTagName('textArea')[0].value;
        sentences = text.split(".");
        if (!/The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States of America/.test(sentences[0])) throwError("Invalid declaration of 'independence'");
        sentences.forEach (
            function (element) {
                
            });
    }
}
