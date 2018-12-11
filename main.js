'use strict';
var sentences;
var allMen;
var endFlag = false;
function throwError(error) {
    document.getElementById('error').innerHTML = error;
    return endFlag = true;
}
function constant(number) {
    var oldNumber = number;
    if (number.includes('(') || number.includes('{')) return throwError("Error: stop trying to execute arbitrary code.");
    if (!/^certain unalienable [Rr]ights, such as/.test(number)) {
        return throwError("Error: constant not beginning with 'certain unalienable rights, such as'");
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
    if (/These united Colonies are,? and of Right ought to be,? Free and Independent States/.test(line)) {
        return endFlag = true;   
    }
    if (/^We hold these [tT]ruths to be self-evident: that /.test(line)) {
       if (line.slice(46,88) === "all men are endowed by their Creator with ") return allMen = constant(line.slice(88));
    }
    if (line === "Let Facts be submitted to a candid World") return document.getElementById('output').innerHTML += (allMen + '\n');
    return throwError('Error: Syntax at line ' + (sentences.indexOf(line) + 1));
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementsByTagName('button')[0].onclick = function () {
        document.getElementById('error').innerHTML = '';
        sentences = document.getElementsByTagName('textArea')[0].value.split(".").map(element => element.replace(/\n/g,''));
        if (!sentences.some(function(element) {return /^These united Colonies are,? and of Right ought to be,? Free and Independent States$/.test(element)})) throwError("Error: No declaration that these united Colonies are Free and Independent States");
        if (!/^The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States? of America/.test(sentences[0])) throwError("Error: Invalid declaration of 'independence'");
        for(var programCounter = 1; programCounter < sentences.length; programCounter++) {
            run(sentences[programCounter]);
            if (endFlag) return;
        };
    }
});
