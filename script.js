//import {APIKey} from "./key.js";

let inputElement = document.querySelector("#anagram-input");

inputElement.addEventListener("keyup", onKeyUp);

let words = [];

fetch("dictionary.txt")
.then(res => {
    return res.text();
})
.then(dictionary => {
    words = dictionary.split("\n");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].trim();
    }
})
.catch(error => {
    console.log(error);
})

function fetchDefinitions(e) {
    let chosenWord = e.target.parentElement.parentElement.firstElementChild.textContent;
    fetch(`https://wordsapiv1.p.rapidapi.com/words/${chosenWord}/definitions`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "0ec181c35emsh169688f20fd2020p1769bajsnc9415fc058b4",
		"x-rapidapi-host": "wordsapiv1.p.rapidapi.com"
	}
})
.then(res => {
	return res.json();
})
.then(data => {
    let cardInnerElement = e.target.parentElement.parentElement.parentElement;
    cardInnerElement.style = "transform: rotateY(180deg)";
    let cardFrontElement = cardInnerElement.firstElementChild;
    cardFrontElement.style = "transform: rotateY(180deg)";
    addDefinitionsHTML(cardFrontElement, data);
})
.catch(err => {
	console.error(err);
});
}

function addDefinitionsHTML(element, data) {
    let definitionsHTML;
    if (data.success === false || definitions.length === 0) {
        definitionsHTML = `No definition for this word is currently available. Sorry!`;
        element.lastElementChild.innerHTML = definitionsHTML;
        return;
    }
    //definitionsHTML = `<p class="card-title" style="text-align: left">Definitions of ${data.word}:</p><ul>`;
    definitionsHTML = `<ul>`;
    for (let i = 0; i < data.definitions.length; i++) {
        definitionsHTML += `<li class="list-group-item" style="text-align: center">${data.definitions[i].definition}</li>`;
    }
    definitionsHTML += `</ul>`;
    element.lastElementChild.innerHTML = definitionsHTML;
}

function onKeyUp(e) {
    let enteredWord = e.target.value;
    return findWordsFromAnagram(enteredWord);
}

function findWordsFromAnagram(anagram) {
    let filteredWordList = [];
    let finalWordList = [];
    anagram = anagram.toLowerCase().split("").sort();
    //filter the dictionary list by the length of the anagram
    for (let i = 0; i < words.length; i++) {
        if (words[i].length == anagram.length) {
            filteredWordList.push(words[i]);
        }
    }
    //console.log(filteredWordList);
    //make a copy of filteredWordList and sort all words inside alphabetically
    let sortedFilteredWordList = filteredWordList.map(x => x);
    for (let i = 0; i < sortedFilteredWordList.length; i++) {
        sortedFilteredWordList[i] = sortedFilteredWordList[i].split("").sort();
    }
    //Add any words from filteredWordList that have the same letters as anagram to finalWordList
    for (let i = 0; i < filteredWordList.length; i++) {
        let booleanTracker = true;
        for (let j = 0; j < anagram.length; j++) {
            if (sortedFilteredWordList[i][j] != anagram[j]) {
                booleanTracker = false;
            }
        }
        if (booleanTracker) {
            finalWordList.push(filteredWordList[i]);
        }
        booleanTracker = true;
    }
    return outputWordsFromAnagram(finalWordList);
}

function outputWordsFromAnagram(words) {
    let outputElement = document.querySelector("#output");
    let outputHTML = ``;
    for (let i = 0; i < words.length; i++) {
        outputHTML += `<div class="col-lg-12 col-m-12 col-sm-12 col-xs-12 mb-3 flip-card">
                                <div class="text-center flip-card-front">
                                    <div class="card border-primary flip-card-inner">
                                        <div class="card-header"><h5>${words[i]}</h5></div>
                                        <div class="card-body text-primary">
                                            <p id="definitions" class="click">Click here for its definition!<p>
                                        </div>
                                    </div>
                            </div>
                        </div>`;
    }
    outputElement.innerHTML = outputHTML; 
    let definitionElements = document.querySelectorAll("#definitions");
    for (let i = 0; i < definitionElements.length; i++) {
        definitionElements[i].addEventListener("click", fetchDefinitions);
    }
}





