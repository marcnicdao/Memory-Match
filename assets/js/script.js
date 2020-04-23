
//Global Variables
var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;
var matches = 0;
var maxMatches = 9;
var attempts = 0;
var gamesPlayed = 0;
var gameCards = document.getElementById('gameCards');
var modal = document.querySelector('.modal')
var resetButton = document.getElementById('reset')
var toggleSound = document.getElementById('toggleSound')
var soundOn = false;
var videoBack = document.getElementById('videoBack')
var logosArray = [
    'hulk','captain-america',
    'strange','iron-man',
    'hawkeye','nebula',
    'spider-man','thor',
    'thanos', 'hulk', 'captain-america',
    'strange', 'iron-man',
    'hawkeye', 'nebula',
    'spider-man', 'thor',
    'thanos'
]
var correctAudio = new Audio();
correctAudio.src = './assets/audio/beep.wav'
var incorrectAudio = new Audio();
incorrectAudio.src = './assets/audio/incorrect.wav';
var clickAudio = new Audio();
clickAudio.src = './assets/audio/click.mp3';
//Global Functions
function playClick(){
    clickAudio.currentTime = 0;
    clickAudio.play();
}
function playIncorrect(){
    incorrectAudio.currentTime = 0;
    incorrectAudio.play();
}
function playCorrect(){
    correctAudio.currentTime = 0;
    correctAudio.play();
}
function tSound(){
    soundOn = !soundOn;
    videoBack.muted = !videoBack.muted;
}

function addListener() {
    gameCards.addEventListener('click', handleClick)
}

function removeHidden() {
    firstCardClicked.classList.remove('hidden')
    secondCardClicked.classList.remove('hidden')
}

function removeClicked() {
    firstCardClicked = null
    secondCardClicked = null
}

function displayStats() {
    document.getElementById('gamesPlayed').textContent = gamesPlayed;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('accuracy').textContent = calculateAccuracy(attempts, matches);
}

function calculateAccuracy(attempts, matches) {
    if (!attempts) {
        return "0%"
    }
    return (Math.trunc(matches / attempts * 100)) + "%";
}

function resetGame() {
    gameCards.innerHTML =' ';
    attempts = 0;
    matches = 0;
    gamesPlayed++
    displayStats();
    shuffle();
    makeCards();
    modal.classList.add('hidden')
}

function shuffle() {
    for (var index = 0; index < logosArray.length - 1; index++) {
        var rand = Math.floor(Math.random() * logosArray.length)
        var temp = logosArray[index];
        logosArray[index] = logosArray[rand];
        logosArray[rand] = temp;
    }
}

function makeCards() {
    for (var makeIndex = 0; makeIndex < logosArray.length; makeIndex++) {
        var cardDiv = document.createElement('div');
        cardDiv.classList.add('col-2', 'card');
        var frontSide = document.createElement('div');
        frontSide.classList.add('card-front');
        var backSide = document.createElement('div');
        backSide.classList.add('card-back');
        cardDiv.append(frontSide);
        cardDiv.append(backSide);
        gameCards.append(cardDiv);
    }
    var frontCards = document.querySelectorAll(".card-front")
    frontCards.forEach(function (cards, index) {
        cards.classList.add(logosArray[index])
    })
}
//Event Handler

addListener();


function handleClick(e) {
    //check if firstCardClicked is empty
    if (event.target.className.indexOf("card-back") === -1) {
        return;
    }
    if (soundOn){
        playClick();
    }
    e.target.classList.add('hidden');
    //If empty assign target as value
    if (!firstCardClicked) {
        firstCardClicked = e.target;
        firstCardClasses = e.target.previousElementSibling.className;
    } else { //If not assign the target's value to secondCard Clicked, remove listner
        secondCardClicked = e.target;
        secondCardClasses = e.target.previousElementSibling.className;
        gameCards.removeEventListener('click', handleClick);
        //if they match, remain unflipped, reset values, add back listner
        if (firstCardClasses === secondCardClasses) {
            setTimeout(playCorrect, 250);
            removeClicked();
            addListener();
            matches++;
            attempts++;
            if (matches === maxMatches) {
                modal.classList.remove('hidden');
            }
        } else if (soundOn){
            setTimeout(function () {
                removeHidden();
                removeClicked();
                addListener();
                playIncorrect();
            }, 1000)
            attempts++;
        } else {
            setTimeout(function () {
                removeHidden();
                removeClicked();
                addListener();
            }, 1000)
            attempts++;
        }

    }
    displayStats();
}

resetButton.addEventListener('click', resetGame)
toggleSound.addEventListener('click', tSound);
shuffle();
makeCards();
