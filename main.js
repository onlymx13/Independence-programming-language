'use strict';
var text, sentences;
var code = '';
var allMen;
function throwError(error) {
    document.getElementById('error').innerHTML = error;
    nocompile = true;
}
function parse (string) {
    if (string == "Introduction") {
        
    }
  string.search("");
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('button')[0].onclick = function () {
        document.getElementById('error').innerHTML = '';
        nocompile = false;
        text = document.getElementsByTagName('textArea')[0].value;
        sentences = text.split(".");
        if (!/The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States? of America/.test(sentences[0])){
            throwError("Error: Invalid declaration of 'independence'");
            nocompile = true;
        }
        sentences.forEach (
            function (element) {
                code += parse(element);
            });
    }
});
