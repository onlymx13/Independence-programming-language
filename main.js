'use strict';
var sentences;
var allMen;
var Pennsylvania;
var input, inputIndex;
var endFlag;
var programCounter;
var introduction, preamble, indictment, denunciation, conclusion;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor)
            additionalURL = TheParams;
        tempArray = additionalURL.split("&");
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    } else {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheParams)
            baseURL = TheParams;
    }
    if (TheAnchor)
        paramVal += "#" + TheAnchor;
    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function throwError(error) {
    document.getElementById('error').innerHTML = error;
    console.log(error);
    return endFlag = true;
}

function constant(number) {
    if (number.charAt(number.length - 1) === '.') number = number.slice(0, -1);
    var oldNumber = number;
    if (number.includes('(') || number.includes('{')) return throwError("Error: stop trying to execute arbitrary code.");
    if (!/^certain unalienable [Rr]ights, such as/.test(number)) {
        return throwError("Error: constant not beginning with 'certain unalienable rights, such as'");
    }
    number = number.slice(35);
    number = number.replace(/certain unalienable Rights, such as/g, '');
    number = number.replace(/the remaining Issue of /g, 'allMen%');
    number = number.replace(/all men/g, 'allMen');
    number = number.replace(/the People of Pennsylvania/g, 'Pennsylvania');
    number = number.replace(/Life/g, 1);
    number = number.replace(/Liberty/g, 2);
    number = number.replace(/Pursuit of Happiness/g, 5);
    number = number.replace(/Property/g, 10);
    number = number.replace(/, and/g, "+");
    number = number.replace(/ and/g, "+");
    number = number.replace(/, /g, '+');
    number = number.replace(/no /g, "-1*");
    number = number.replace(/lack of /g, "-1*");
    number = number.replace(/good /g, "2*");
    number = number.replace(/great /g, "4*");
    number = number.replace(/the/g, "");
    number = number.replace(/(are|is) created [eE]qual to/g, "===");
    number = number.replace(/(are|is) created [gG]reater than/g, ">");
    number = number.replace(/(are|is) created [lL]ess than/g, "<");
    try {
        return Function("return " + number).call(this);
    } catch (err) {
        return throwError(err + " encountered when trying to calculate the value of " + oldNumber);
    }
}

function run(line) {
    if (!line) return;
    if (/^(Introduction|Preamble|Indictment|Denunciation|Conclusion)$/.test(line)) return;
    if (/^These united Colonies are, and of Right ought to be,? Free and Independent States.$/.test(line)) return;
    if (/^We hold these [tT]ruths to be self-evident: that /.test(line)) {
        if (line.slice(46, 88) === "all men are endowed by their Creator with ") return allMen = constant(line.slice(88));
        if (line.slice(46, 107) === "the People of Pennsylvania are endowed by their Creator with ") return Pennsylvania = constant(line.slice(107));
    }
    if (line === "Let Facts be submitted to a candid World.") {
        return document.getElementById('output').innerHTML += (allMen);
    }
    if (line === "We should declare the causes which impel us to the separation.") {
        return document.getElementById('output').innerHTML += (String.fromCharCode(allMen));
    }
    if (/^When in the Course of human Events /.test(line)) {
        if (constant('certain unalienable Rights, such as ' + line.slice(35, line.search(/,(?!.*,)/)))) {
            try {
                return run(line.slice(line.search(/,(?!.*,)/) + 2).charAt(0).toUpperCase() + line.slice(line.search(/,(?!.*,)/) + 2).slice(1)); // the 2 are comma and space
            } catch (err) {
                return throwError("Error: Syntax in executed portion of line " + (sentences.indexOf(line) + 1) + ". Note that lines with commas are currently not supported.");
            } finally {
                return;
            }
        } else {
            return false;
        }
    }
    if (/See the Introduction (to|of) this Document\./.test(line) && introduction !== -1) return programCounter = introduction;
    if (/See the Preamble (to|of) this Document\./.test(line) && preamble !== -1) return programCounter = preamble;
    if (/See the Indictment (to|of) this Document\./.test(line) && indictment !== -1) return programCounter = indictment;
    if (/See the Denunciation (to|of) this Document\./.test(line) && denunciation !== -1) return programCounter = denunciation;
    if (/See the Conclusion (to|of) this Document\./.test(line) && conclusion !== -1) return programCounter = conclusion;
    if (/We, therefore, appeal to the Supreme Judge of the [wW]orld for the rectitude of our intentions./.test(line)) {
        if (typeof input[inputIndex] !== 'undefined') allMen = input[inputIndex++].charCodeAt(0);
        else throwError("Error: all input used at line " + (sentences.indexOf(line) + 1));
        return;
    }
    return throwError('Error: Syntax at line ' + (sentences.indexOf(line) + 1));
}

function execute() {
    var allMen = 0;
    var Pennsylvania = 0;
    document.getElementById('error').innerHTML = '';
    input = /^[0-9]+$/.test(document.getElementById('input').value) ? document.getElementById('input').value.split(/,|\n/) : document.getElementById('input').value.split('');
    inputIndex = 0;
    endFlag = false;
    sentences = document.getElementsByTagName('textArea')[0].value.split("\n").map(element => element.replace(/\n/g, ''));
    sentences.forEach(function(sentence, index) {
        if (sentence.indexOf('/\/') !== -1) sentences[index] = sentence.slice(0, sentence.indexOf('/\/'));
        while (sentences[index].charAt(sentences[index].length - 1) === ' ') {
            sentences[index] = sentences[index].slice(0, -1);
        }
    });
    if (!sentences.some(function(element) {
            return /^These united Colonies are, and of Right ought to be,? Free and Independent States.$/.test(element)
        })) throwError("Error: No declaration that these united Colonies are Free and Independent States");
    if (!/^The unanimous Declaration of the (zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen) united States? of America./.test(sentences[0])) throwError("Error: Invalid declaration of 'independence'");
    introduction = sentences.indexOf("Introduction"); //these vars will be -1 if it's not in there
    preamble = sentences.indexOf("Preamble");
    indictment = sentences.indexOf("Indictment");
    denunciation = sentences.indexOf("Denunciation");
    conclusion = sentences.indexOf("Conclusion");
    programCounter = 1;
    if (encodeURIComponent(document.getElementsByTagName('textArea')[0].value) !== getUrlVars()["text"] || encodeURIComponent(document.getElementById('input') !== getUrlVars()["input"])) {
        window.location.href = updateURLParameter(updateURLParameter(window.location.href, 'text', encodeURIComponent(document.getElementsByTagName('textArea')[0].value)), 'input', encodeURIComponent(document.getElementById('input').value));
    }
    function count() {
        for (var j = 0; j < 9; j++) {
            if (programCounter < sentences.length && !endFlag) run(sentences[programCounter++]);
        }
        if (programCounter < sentences.length && !endFlag) requestAnimationFrame(count);
    }
    if (!endFlag) requestAnimationFrame(count);
}
document.addEventListener('DOMContentLoaded', function() {
    if (getUrlVars()["input"] != null) document.getElementById('input').value = decodeURIComponent(getUrlVars()["input"]);
    if (getUrlVars()["text"] != null) {
        document.getElementsByTagName('textArea')[0].value = decodeURIComponent(getUrlVars()["text"]);
        execute();
    }
    document.getElementsByTagName('button')[0].onclick = execute;
});
