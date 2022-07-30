/*
- [x] include js file to html
- [x] include css file to html
- [x] live view for html
- [x] word
- [x] url
- [x] get html
- [x] set htmlBody to hidden element
- [ ] set up layout
    - [ ] front side
        - [ ] hidden word, only display the first character
        - [ ] definition, random?
    - [ ] back side
    - [ ] 

*/
// const regex = /<span class="PronCodes".*?>(.+?)<span class="tooltip LEVEL".*?> (.*?)<\/span>[\s\S]*?<span class="POS"> (.*?)<\/span>[\s\S]*?<span class="DEF">(.*?)<\/span>/;
const word = "card";
url = "https://www.ldoceonline.com/dictionary/" + word;

// set the hidden word


// pre-load
fetch(url)
    .then(response => response.text())
    .then(text => {
        const sourceElement = getSourceElement(text);
        e = document.getElementsByClassName("PronCodes")[0];
    });

function getSourceElement(text) {
    const bodyRegex = /<body.*?>([\s\S]*?)<\/body>/;
    const htmlBody = bodyRegex.exec(text)[1];
    sourceElement = document.createElement('div')
    sourceElement.id = 'source';
    sourceElement.style.display = 'none';
    sourceElement.innerHTML = htmlBody;
    document.body.append(sourceElement);
    return sourceElement;
}

function setHiddenWord(word) {
    hiddenWord = "";
    chars = [...word];
    if (chars.length <= 1) {
        hiddenWord = "_";
    } else {
        for (let i = 0; i < chars.length; i++) {
            if (i == 0) {
                hiddenWord += `${chars[i]}`;
            } else {
                hiddenWord += " _";
            }
        }
    }
    document.getElementById("word").innerText = hiddenWord;
}

/*
function getDefinition(text) {
    matches = regex.exec(text);
    document.getElementById("definition").innerHTML = `${matches[4]}`
}
*/

