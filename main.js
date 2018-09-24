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
    if (number.slice(0,35) !=== "certain unalienable rights, such as") {
        throwError("Error: constant not beginning with 'certain unalienable rights, such as'");
    }
    number = number.slice(35);
    number.replace("Life",1);
    number.replace("Liberty",2);
    number.replace("Pursuit of Happiness",5);
    number.replace("Property",10);
    number.replace(", and","+");
    number.replace(", ",'+');
    number.replace("no ","-1*");
    number.replace("lack of ","-1*");
    number.replace("good ","2*");
    number.replace("great ","4*");
    return number;
}
function run(line) {
    if (line.slice(0,46) === "We hold these Truths to be self-evident: that") {
       if (line.slice(46,88) === "all men are endowed by their Creator with ") {
           allMen = constant(line.slice(88));
       }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('button')[0].onclick = function () {
        document.getElementById('error').innerHTML = '';
        nocompile = false;
        text = document.getElementsByTagName('textArea')[0].value;
        sentences = text.split(".");
        if (!/The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States? of America/.test(sentences[0])){
            throwError("Error: Invalid declaration of 'independence'");
        }
        if (!sentences.includes("These united Colonies are, and of Right ought to be, Free and Independent States.")) {
            throwError("Error: No declaration that these united Colonies are Free and Independent States");
        }
        do {
            run(sentences[++programCounter];
        } while (!endFlag);
});
