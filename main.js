'use strict';
var text, sentences;
var allMen;
var programCounter = 0;
var endFlag = false;
function throwError(error) {
    document.getElementById('error').innerHTML = error;
    endFlag = true;
}
function constant(number) {
    if (number.slice(0,35) !== "certain unalienable rights, such as") {
        throwError("Error: constant not beginning with 'certain unalienable rights, such as'");
    }
    number = number.slice(35);
    number = number.replace(/Life/g,1);
    number = number.replace(/Liberty/g,2);
    number = number.replace(/Pursuit of Happiness/g,5);
    number = number.replace(/Property/g,10);
    number = number.replace(/, and/g,"+");
    number = number.replace(/ and/g,"+");
    number = number.replace(/, /g,'+');
    number = number.replace(/no /g,"-1*");
    number = number.replace(/lack of /g,"-1*");
    number = number.replace(/good /g,"2*");
    number = number.replace(/great /g,"4*");
    return Function(number);
}
function run(line) {
    if (line === "These united Colonies are, and of Right ought to be Free and Independent States") {
        return endFlag = true;   
    }
    if (line.slice(0,46) === "We hold these Truths to be self-evident: that") {
       if (line.slice(46,88) === "all men are endowed by their Creator with ") {
           return allMen = constant(line.slice(88));
       }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('button')[0].onclick = function () {
        document.getElementById('error').innerHTML = '';
        text = document.getElementsByTagName('textArea')[0].value;
        sentences = text.split(".");
        sentences = sentences.map(function (element) {
            return element.replace(/\n|↵/,'');
        });
        if (!/The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States? of America/.test(sentences[0])){
            throwError("Error: Invalid declaration of 'independence'");
        }
        if (!sentences.includes("These united Colonies are, and of Right ought to be Free and Independent States")) {
            throwError("Error: No declaration that these united Colonies are Free and Independent States");
        }
        while (!endFlag) {
            run(sentences[++programCounter]);
        };
    }
});
