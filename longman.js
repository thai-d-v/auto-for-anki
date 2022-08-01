/* -------------------------------------------------------------------------- */
/*                                    Plan                                    */
/* -------------------------------------------------------------------------- */
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
        - [x] hidden word, 
            - [x] option: only display the first character
            - [x] option: only display the last character
            - [x] option: only display one random character in the word
            - [x] not replace punctuating, prevent misleading when hide the phrase 
        - [x] definition, random?
            - [x] check and delete the word?
            - [x] shuffle definition list and get the firs definition does not contain the word?
            - [x] handle error when not found the word
    - [ ] back side
        - [ ] word
        - [ ] IPA
        - [ ] POS
        - [ ] racking
        - [ ] definitions
            - [ ] examples
            - [ ] photo
        - [ ] maybe audio links?

    - [ ] 

*/

/* -------------------------------------------------------------------------- */
/*                               Helper Function                              */
/* -------------------------------------------------------------------------- */
function getSourceElement(text) {
    // const bodyRegex = /<body.*?>([\s\S]*?)<\/body>/;
    const bodyRegex = /<div class="dictionary">([\s\S]*?)<!-- End of DIV dictionary-->/;
    const htmlBody = bodyRegex.exec(text)[1];
    sourceElement = document.createElement('div')
    sourceElement.id = 'source';
    sourceElement.style.display = 'none';
    sourceElement.innerHTML = htmlBody;
    document.body.append(sourceElement);
    return sourceElement;
}

const SelectOption = Object.freeze({
    First: Symbol("first"),
    Random: Symbol("random"),
    Last: Symbol("last")
})

function getHiddenWord(word, option) {
    const hiddenChar = "✪"
    const chars = [...word];
    const punctuations = [".", " ", ",", "?", "!", "(", ")", "-"];

    var displayIndex = 0;
    var hiddenWord = "";


    // avoid empty word
    if (chars.length == 0) { return word; }

    switch (option) {
        case SelectOption.First:
            displayIndex = 0;
            break;
        case SelectOption.Random:
            displayIndex = Math.floor(Math.random() * chars.length);
            break;
        case SelectOption.Last:
            displayIndex = chars.length - 1;
            break;
        default:
            break;
    }

    // hide some character in the word
    if (chars.length <= 1) {
        hiddenWord = hiddenChar;
    } else {
        for (let i = 0; i < chars.length; i++) {
            if (i == displayIndex) {
                hiddenWord += `${chars[i]}`;
            } else if (punctuations.includes(chars[i])) {
                hiddenWord += `${chars[i]}`;
            } else {
                hiddenWord += hiddenChar;
            }
        }
    }


    return hiddenWord
}

function getElementsByClassName(className, option) {
    const es = document.getElementsByClassName(className);
    if (es.length == 0) { return null }

    var index = 0
    switch (option) {
        case SelectOption.First:
            index = 0;
            break;
        case SelectOption.Random:
            index = Math.floor(Math.random() * es.length);
            break;
        case SelectOption.Last:
            index = es.length - 1;
            break;
        default:
            index = 0;
            break;
    }

    return es[index];
}

function getDefinition(word, hiddenWord, option) {
    const element = getElementsByClassName("DEF", option);

    if (element == null) {
        return null
    }

    element.innerText = element.innerText.replace(new RegExp(`${word}`, "ig"), `${hiddenWord}`)

    return element;
}

function hideWordRelevantData() {
    deleteDotInsideWord();

    // hide characters in the keyword
    hideCharactersInWord();

    // hide ipa
    hideIPAs();
}

function setupData(text) {
    getSourceElement(text);

    window.entries = document.getElementsByClassName("ldoceEntry Entry");
    const definitionContainer = document.getElementById("definition");
    if (definition) {
        for (let i = 0; i < window.entries.length; i++) {
            definitionContainer.append(window.entries[i]);
        }
    } else {
        definitionContainer.innerText = "error: definition not fount";
    }
}

function deleteDotInsideWord() {
    window.hyphenations = document.getElementsByClassName("HYPHENATION");
    for (let i = 0; i < window.hyphenations.length; i++) {
        const element = window.hyphenations[i];
        window.hyphenations[i].innerText = window.hyphenations[i].innerText.replace(new RegExp(`‧`, "ig"), ``);
    }
}

function hideCharactersInWord() {
    for (let i = 0; i < window.entries.length; i++) {
        const element = window.entries[i];

        window.entries[i].innerHTML = window.entries[i].innerHTML.replace(new RegExp(`${window.word}`, "ig"), `${window.hiddenWord}`);
    }
}

function hideIPAs() {
    window.IPAs = document.getElementsByClassName("PronCodes");
    for (let i = 0; i < window.IPAs.length; i++) {
        window.IPAs[i].style.display = "none";
    }
}

/* -------------------------------------------------------------------------- */
/*                                    main                                    */
/* -------------------------------------------------------------------------- */
function loadFrontSide() {

    // window.word = "{{Keyword}}";
    window.word = document.getElementById("hidden-word").innerText;
    const url = "https://www.ldoceonline.com/dictionary/" + window.word;
    const hiddenClassNames = ["topics_container", "frequent Head", "EXAMPLE", "Crossref", "COLLO", "SYN", "RELATEDWD"]

    window.hiddenWord = getHiddenWord(window.word, SelectOption.Random)
    document.getElementById("hidden-word").innerText = window.hiddenWord;

    // pre-load
    fetch(url)
        .then(response => response.text())
        .then(text => {
            setupData(text);

            // delete the dot inside keyword
            hideWordRelevantData();

            // TODO: select a random entry
            // TODO: select a random definition

            // TODO: definition in back ad front must be the same
        });

    // TODO: trigger data loading on change
}

function loadBackSide() {
        // window.word = "{{Keyword}}";
        window.word = document.getElementById("hidden-word").innerText;
        const url = "https://www.ldoceonline.com/dictionary/" + window.word;
        const hiddenClassNames = ["topics_container", "frequent Head", "EXAMPLE", "Crossref", "COLLO", "SYN", "RELATEDWD"]
    
        window.hiddenWord = getHiddenWord(window.word, SelectOption.Random)
        document.getElementById("hidden-word").innerText = window.hiddenWord;
    
        // pre-load
        fetch(url)
            .then(response => response.text())
            .then(text => {
                setupData(text);
            });
}
