'use strict';
var sentences;
var allMen;
var endFlag = false;
function throwError(error) {
    document.getElementById('error').innerHTML = error;
    return endFlag = true;
}
function constant(number) {
    number = number.slice(0, -1);
    var oldNumber = number;
    if (number.includes('(') || number.includes('{')) return throwError("Error: stop trying to execute arbitrary code.");
    if (!/^certain unalienable [Rr]ights, such as/.test(number)) {
        return throwError("Error: constant not beginning with 'certain unalienable rights, such as'");
    }
    number = number.slice(35);
    number = number.replace(/all men/g,'allMen');
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
    number = number.replace(/the/g,"");
    try {
        return Function("return "+number).call(this);
    }
    catch (err) {
        return throwError(err + " encountered when trying to calculate the value of " + oldNumber);
    }
}
function run(line) {
    if (!line) return;
    if (/^Introduction|Preamble|Indictment|Denunciation|Conclusion$/.test(line)) return;
    if (/^These united Colonies are,? and of Right ought to be,? Free and Independent States.$/.test(line)) return document.getElementById('output').innerHTML += ('done\n');
    if (/^We hold these [tT]ruths to be self-evident: that /.test(line)) {
       if (line.slice(46,88) === "all men are endowed by their Creator with ") return allMen = constant(line.slice(88));
    }
    if (line === "Let Facts be submitted to a candid World.") {
        document.getElementById('output').innerHTML += (allMen + '\n');
        return;
    }
    return throwError('Error: Syntax at line ' + (sentences.indexOf(line) + 1));
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('button')[0].onclick = function () {
        var allMen = 0;
        document.getElementById('error').innerHTML = '';
        sentences = document.getElementsByTagName('textArea')[0].value.split("\n").map(element => element.replace(/\n/g,''));
        if (!sentences.some(function(element) {return /^These united Colonies are,? and of Right ought to be,? Free and Independent States.$/.test(element)})) throwError("Error: No declaration that these united Colonies are Free and Independent States");
        if (!/^The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States? of America./.test(sentences[0])) throwError("Error: Invalid declaration of 'independence'");
        var introduction = sentences.indexOf("Introduction"); //these vars will be -1 if it's not in there
        var preamble = sentences.indexOf("Preamble");
        var indictment = sentences.indexOf("Indictment");
        var denunciation = sentences.indexOf("Denunciation");
        var conclusion = sentences.indexOf("Conclusion");
        var programCounter = 1;
        while (programCounter < sentences.length) {
            run(sentences[programCounter++]);
            if (endFlag) {
               document.getElementById('output').innerHTML += 'break occured';
                break;
            };
        };
    }
});
