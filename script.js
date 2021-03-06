//'use strict'

// Init Firebase
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCT3itfDP9B9e6otxiO_c0MBr7TTCUMl7s",
    authDomain: "planning-poker-9c150.firebaseapp.com",
    databaseURL: "https://planning-poker-9c150.firebaseio.com",
    projectId: "planning-poker-9c150",
    storageBucket: "planning-poker-9c150.appspot.com",
    messagingSenderId: "32134586323",
    appId: "1:32134586323:web:e8938af79aad18817b9926",
    measurementId: "G-41B0X18KVK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


//Global variables 
//main user data object constructor
const myRoom = function (roomID, nameID, pinID, scoreID, deckID, statusID, userID) {
    this.room = roomID;
    this.pin = pinID;
    this.name = nameID;
    this.score = scoreID;
    this.deck = deckID;
    this.status = statusID;
    this.userID = userID
}
let $myRoom = new myRoom();
let $cardList;
// show hide scores in room window based on status of supervisor from show button
let $showHide = false;
let $resultsTab = [];
$myRoom.deck = 0; //set default deck of Fibonacci to the user
for (let i = 0; i < 17; i++) $resultsTab.push(0);
const $cardDeck = [];

function displayDeck() {
    let deckBoxEl = document.getElementById('deckBox');
    let newRowEl;
    let newColEl;
    deckBoxEl.innerHTML = ``;
    for (let i = 1; i <= 4; i++) {
        newRowEl = document.createElement('div');
        newRowEl.classList.add('row', 'mb-5', 'mt-5');
        newRowEl.setAttribute('href', `#cardRow${i}`)
        newRowEl.id = `cardRow${i}`;
        deckBoxEl.appendChild(newRowEl);

        for (let j = 1; j <= 4; j++) {
            let seqNr = 100 + (i - 1) * 4 + j;
            newColEl = document.createElement('div');
            newColEl.classList.add('col-2', 'pt-2', 'pb-2', 'text-lg-center', 'cardBox', 'mx-auto', 'border', 'border-1', 'd-flex', 'align-items-center', 'justify-content-center', 'shadow')
            newColEl.innerHTML = `<span id="${seqNr}-span" class="display-5  cardValue">  &#8734 </span>`;
            newColEl.id = seqNr + '-box';
            newRowEl.appendChild(newColEl);
        }
    }

    let infEl = document.getElementById('113-span');
    let infDivEl = document.getElementById('113-box');
    let qEl = document.getElementById('114-box');
    let cupEl = document.getElementById('115-box');
    let refreshEl = document.getElementById('116-box');
    infEl.classList.replace('display-5', 'display-1');
    cupEl.innerHTML = `<img class="imgSVG" src="https://online-planning-poker.web.app/svg/cup.svg" alt="">`;
    cupEl.innerHTML = `<img class="imgSVG" src="https://online-planning-poker.web.app/svg/cup.svg" alt="">`;
    qEl.innerHTML = `<img class="imgSVG" src="https://online-planning-poker.web.app/svg/question-circle.svg" alt="">`;
    refreshEl.innerHTML = `<img class="imgSVG" src="https://online-planning-poker.web.app/svg/arrow-repeat.svg" alt="">`;
}

class Cards {
    constructor(value, name) {
        this.value = value;
        this.name = name;
    }
    showCard() {
        const el = document.createElement('div');
        const carDiv = document.querySelector('#cards');
        el.id = 'card' + this.value;
        el.classList.add('cardBox');
        el.textContent = this.name;
        carDiv.appendChild(el);
    }
    updateCards() {
        let cardsEl;
        cardsEl = document.querySelectorAll('.cardBox>span');
        this.value.forEach((el, i) => {
            if (i < 12) cardsEl[i].textContent = el;
        });
    }
    updateResults() {
        let cardsEl;
        cardsEl = document.querySelectorAll('#results>span');
        this.value.forEach((el, i) => {
            if (i < 12) cardsEl[i].textContent = el;
        });
    }
}

function deckDisplay(i) {
    //console.log(i)
    if ($myRoom.room !== undefined) displayResults();
    const row3 = document.querySelector('#cardRow3');
    const rowResSpan = document.querySelectorAll('.hideshowSpan');
    const rowResDiv = document.querySelectorAll('.hideshowDiv');
    if (i > 1) {
        row3.classList.add('dispNone');
        rowResSpan.forEach(e => {
            e.classList.add('dispNone')
        })
        rowResDiv.forEach(e => {
            e.classList.add('dispNone')
        })
    }
    else {
        row3.classList.remove('dispNone');
        rowResSpan.forEach(e => {
            e.classList.remove('dispNone')
        })
        rowResDiv.forEach(e => {
            e.classList.remove('dispNone')
        })
    }
    if (i < 12) $cardDeck[i].updateCards();
    //console.log($cardDeck[i]);
    $cardDeck[i].updateResults();

}

const displayCards = () => {
    displayDeck();
    $cardDeck.push(new Cards([0, 0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, '', '', '', ''], 'Fibonacci'));
    $cardDeck.push(new Cards([0, '1/2', 1, 2, 3, 5, 8, 13, 20, 40, 100, 150, '', '', '', ''], 'Modified Fibonacci'));
    $cardDeck.push(new Cards([0, 1, 2, 4, 8, 16, 32, 64, '', '', '', '', '', '', '', ''], 'Powers'));
    $cardDeck.push(new Cards([0, 'xs', 's', 'm', 'L', 'XL', '2XL', '3XL', '', '', '', '', '', '', '', ''], 'TShirts'));
    $cardDeck[$myRoom.deck].updateCards();

}
//Display results from all participants in the bottom Result section
function displayResults() {
    let resultEl = document.querySelector('#results');
    let valRes = 0;
    let totalResults = 0;
    let resultsDispTab = [];
    resultEl.innerHTML = '';
    //console.log($resultsTab);
    //console.log($myRoom);
    $resultsTab.forEach((el, i) => {
        if (i < 16) totalResults += el;
    })
    $resultsTab.forEach(el => {
        if (totalResults !== 0) resultsDispTab.push(Math.floor(100 * (el / totalResults)));
        else resultsDispTab.push(0);
    })
    for (let i = 0; i < $resultsTab.length - 1; i++) {
        let newResSpan = document.createElement('span')
        let newResDiv = document.createElement('div')
        valRes = resultsDispTab[i];
        newResSpan.id = i + 'resSpan';
        newResDiv.id = i + 'resBox';
        resultEl.appendChild(newResSpan);
        if ((i >= 8) && (i < 12)) {
            newResSpan.classList.add('hideshowSpan');
            newResDiv.classList.add('hideshowDiv');
        }
        if (i < 12) newResSpan.innerText = `${$cardDeck[$myRoom.deck].value[i]}  -  ${valRes}%`;
        if (i == 12) newResSpan.innerHTML = `&#8734 -  ${valRes}%`;
        if (i == 13) newResSpan.innerHTML = `<img class="imgSVG3" src="https://online-planning-poker.web.app/svg/question-circle.svg" alt=""> -  ${valRes}%`;
        if (i == 14) newResSpan.innerHTML = `<img class="imgSVG3" src="https://online-planning-poker.web.app/svg/cup.svg" alt=""> -  ${valRes}%`;
        //if(i==15)newResSpan.innerText = $cardDeck[$myRoom.deck].value[i];
        resultEl.appendChild(newResDiv);
        newResDiv.classList.add('progress');
        newResDiv.innerHTML = `<div class="progress-bar" role="progressbar" style="width: ${valRes}%" aria-valuenow="${valRes}" aria-valuemin="0"
        aria-valuemax="100"></div>`;
        if (valRes > 0 && $showHide) {
            newResDiv.classList.remove('dispNone');
            newResSpan.classList.remove('dispNone');
        }
        else if (valRes == 0 || !$showHide) {
            newResDiv.classList.add('dispNone');
            newResSpan.classList.add('dispNone');
        }
    }
}

function getInputValue(id) {
    return document.getElementById(id).value;
}

function setUserID() {
    let userID;
    let timeSet = new Date();

    userID = timeSet.getTime();
    userID = userID + Math.floor(Math.random() * 1000000);
    //console.log(userID);
    return userID;
}

function submitForm(e, i) {
    e.preventDefault();
    //Get values from form
    let roomID = getInputValue('inputRoom');
    let pinID = getInputValue('inputPIN');
    let nameID = getInputValue('inputUser');
    let scoreID;
    //if ($myRoom.score = undefined) $myRoom.score = 16;
    if ($myRoom.score >= 0) scoreID = $myRoom.score;
    else $myRoom.score = 16;
    //console.log($myRoom, scoreID);
    if ((roomID != '') && (pinID != '') && (nameID != '')) {
        let userID;
        let elMng = document.getElementById('mngBox');
        $myRoom.room = roomID;
        $myRoom.pin = pinID;
        $myRoom.name = nameID;
        $myRoom.status = i;
        userID = setUserID();
        $myRoom.userID = userID;
        saveData(roomID, nameID, pinID, $myRoom.score, $myRoom.deck, i, userID);
        deckDisplay($myRoom.deck);
        if ($myRoom.status > 0) {
            elMng.classList.remove('dispNone');
            updateAllData();
            let selectorEl = [];
            selectorEl = document.querySelectorAll('#deckSel>li>a');
            selectorEl.forEach((el, i) => {
                el.addEventListener('click', () => {
                    $myRoom.deck = i;
                    updateData();
                    // updateAllData();
                    deckDisplay(i);
                })
            })
        }
        else {
            elMng.classList.add('dispNone');
        }
        setInterval(readData, 30000);
        displayResults();
    }
}

//Form for collecting room login information
const roomForm = () => {
    const formEl = document.querySelector('#inputForm');
    const createEl = document.querySelector('#createBtn');
    formEl.addEventListener('submit', e => {
        let i = 0; //join
        submitForm(e, i)
    });
    createEl.addEventListener('click', e => {
        let i = 1; //create
        submitForm(e, i)
    });
}

//Save to firebase
function saveData(room, name, pin, score, deck, status, userID) {
    //refer to specific database
    const roomDB = firebase.database().ref('rooms/' + room + pin + '/' + name);
    roomDB.set({
        room: room,
        name: name,
        pin: pin,
        score: score,
        deck: deck,
        status: status,
        userID: userID
    });
    // var newRoom = roomDB.push();
    // newRoom.set({
    //     room: room,
    //     name: name,
    //     pin: pin,
    //     score: score,
    //     status: status
    // })
    readData();
}

//Update firebase
function updateData() {
    //console.log($myRoom);
    const roomDB = firebase.database().ref('rooms/' + $myRoom.room + $myRoom.pin + '/' + $myRoom.name);  //refer to specific database
    roomDB.update({
        //room: room,
        //name: name,
        //pin: pin,
        deck: $myRoom.deck,
        score: $myRoom.score,
        status: $myRoom.status
    });
    readData();
}

function updateAllData() {
    //console.log($myRoom);
    const roomDB = firebase.database().ref('rooms/' + $myRoom.room + $myRoom.pin);  //refer to specific database
    roomDB.once("value", function (snapshot) {
        snapshot.forEach(function (child) {
            //console.log(child.val().userID);
            if (child.val().userID != $myRoom.userID) {
                child.ref.update({
                    deck: $myRoom.deck,
                    score: 16,
                    status: 0
                })
            }
        })
    })
    readData();
}

//update Score Room window with participants
function updateScores(userData) {
    let scoreEl = document.getElementById('scores');
    let imgPerson = '';
    //console.log(userData)
    //console.log($myRoom)
    //console.log($cardDeck[$myRoom.deck].value);
    let scoreView;

    if ($showHide) {
        scoreView = $cardDeck[$myRoom.deck].value[userData[1]];
        if (userData[1] - 1 == 11) scoreView = `&#8734`;
        if (userData[1] - 1 == 12) scoreView = `<img class="imgSVG3" src="https://online-planning-poker.web.app/svg/question-circle.svg" alt="">`;
        if (userData[1] - 1 == 13) scoreView = `<img class="imgSVG3" src="https://online-planning-poker.web.app/svg/cup.svg" alt="">`;
        if (userData[1] - 1 == 15) scoreView = '';
    }
    else scoreView = `<img class="imgSVG3" src="https://online-planning-poker.web.app/svg/suit-spade-fill.svg"; alt="bootstrap Icon">`;

    let newtrEl = document.createElement("tr");
    if (userData[2] == 0) imgPerson = `<img class="imgSVGs" src="https://online-planning-poker.web.app/svg/person.svg" alt="participant">`;
    else imgPerson = `<img class="imgSVGs" src="https://online-planning-poker.web.app/svg/file-person.svg" alt="supervisor">`;

    newtrEl.innerHTML = `<th scope="row">${scoreView}</th><td>${imgPerson}</td><td>${userData[0]}</td>`;
    scoreEl.appendChild(newtrEl);
}

//Read from Firebase
function readData() {
    let roomNr = document.getElementById('roomNr');
    let statusChange = false;
    let roomID = $myRoom.room;
    let pinID = $myRoom.pin;
    let scoreEl = document.getElementById('scores');
    for (let i = 0; i < $resultsTab.length; i++) $resultsTab[i] = 0;

    scoreEl.innerHTML = ``;
    roomNr.textContent = roomID;

    //let roomJoin = 
    firebase.database().ref('rooms/' + roomID + pinID).once('value', function (snapshot) {
        let userData = new Array;
        snapshot.forEach(
            function (ChildSnapshot) {
                let name = ChildSnapshot.val().name;
                let pin = ChildSnapshot.val().pin;
                let room = ChildSnapshot.val().room;
                let score = ChildSnapshot.val().score;
                let deck = ChildSnapshot.val().deck;
                let status = ChildSnapshot.val().status;
                let userID = ChildSnapshot.val().userID;
                userData.push([name, score, status, deck, room, userID]);
                if (status > 0) {
                    $myRoom.deck = deck;
                    //console.log(name, score, deck, status);
                    if (status > 1) $showHide = true;
                    if (status == 1) $showHide = false;
                }
                $resultsTab[score]++;
            }
        );
        //console.log($myRoom);
        userData.forEach(e => {
            if ((e[2] > 0 && $myRoom.status > 0) && (e[5] !== $myRoom.userID)) {
                $myRoom.status = 0;
                statusChange = true;
            }
        })


        //console.log($myRoom.room, $myRoom.name, $myRoom.pin, $myRoom.score, $myRoom.deck, $myRoom.status);
        if (statusChange) {
            updateData();
        }
        else {
            let scoreEl = document.getElementById('scores');
            scoreEl.innerHTML = ``;
            userData.forEach(e => {
                updateScores(e);
            })
        }
        //if (statusChange) updateData($myRoom.room, $myRoom.name, $myRoom.pin, $myRoom.score, $myRoom.deck, $myRoom.status)
        setTimeout(displayResults, 100);
        setTimeout(deckDisplay($myRoom.deck), 100);
    });

}

function selectResult(selectedID) {
    if (selectedID !== '116-box') {
        //console.log(selectedID);
        //console.log($myRoom);
        if ($myRoom.selectedID !== undefined) {
            let selectedEl = document.getElementById($myRoom.selectedID);
            selectedEl.classList.remove('selected');
        }
        selectedEl = document.getElementById(selectedID);
        selectedEl.classList.add('selected');
        $myRoom.selectedID = selectedID;
        $myRoom.score = Number(selectedID[1] + selectedID[2]) - 1;
        //console.log($myRoom);
        if ($myRoom.room !== undefined && $myRoom.score >= 0) updateData()
        readData();
    }
    else if ($myRoom.room !== '') {
        //selectedEl.classList.remove('selected');
        if ($myRoom.status > 0) updateAllData();
        readData();
    }
}

//collecting score result from clicks on cards
const checkCard = (e) => {
    let selectedEl;
    let selectedID = e.target.closest('div').id;
    selectedEl = document.getElementById(selectedID);
    if (selectedEl.classList.contains('cardBox')) {
        selectResult(selectedID);
    }
}

function showScores() {
    console.log('show');
    if ($myRoom.status == 2) $myRoom.status = 1;
    else $myRoom.status = 2;
    updateData();
}

const prepareDOMElements = () => {
    $cardList = document.querySelector('#deckBox');
}

const prepareDOMEvents = () => {
    let clearBtn = document.querySelector('#clearBtn');
    let showBtn = document.querySelector('#showBtn');

    $cardList.addEventListener('click', checkCard);
    clearBtn.addEventListener('click', updateAllData);
    showBtn.addEventListener('click', showScores)
}

const main = () => {
    roomForm();
    displayCards();
    displayResults();
    prepareDOMElements();
    prepareDOMEvents();
}

document.addEventListener('DOMContentLoaded', main);