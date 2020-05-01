
//Global Variables
var firstCardClicked;
var secondCardClicked;
var firstCardClasses;
var secondCardClasses;
var matches = 0;
var maxMatches = 9;
var attempts = 0;
var gamesPlayed = 0;
var countDown = 0;
var soundOn = false;
var gameCards = document.getElementById('gameCards');
var startScreen = document.getElementById('start-modal');
var resetButton = document.getElementById('reset');
var resetButton2 = document.getElementById('reset2');
var resetTop = document.getElementById('reset-top')
var toggleSound = document.getElementById('toggleSound');
var modalWin = document.querySelector('#win-modal');
var modalLose = document.getElementById('lose-modal');
var modalStart = document.getElementById('start-modal')
var videoBack = document.getElementById('videoBack');
var loseDelay = 0;
var loseTimeout;
var timerInterval;
var lastTenTimeout;
var logosArray = [
    'hulk', 'captain-america',
    'strange', 'iron-man',
    'hawkeye', 'nebula',
    'spider-man', 'thor',
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
var endGameAudio = new Audio();
endGameAudio.src = './assets/audio/pretty-isnt-it.mp3';
var loseAudio = new Audio();
loseAudio.src = './assets/audio/thanosAngry.mp3';
var lastTenAudio = new Audio();
lastTenAudio.src = './assets/audio/lastTen.mp3';

//Global Functions
function playAudio(audio){
    audio.currentTime = 0;
    if(soundOn){
        audio.play()
    }
}

function tSound(e) {
    console.log(e);
    soundOn = !soundOn;
    videoBack.muted = !videoBack.muted;
    if (soundOn) {
        e.target.classList.add('highlight');
        lastTenAudio.muted = false;
    } else {
        e.target.classList.remove('highlight');
        lastTenAudio.muted = true;
    }
}

function timerCountDown() {
    countDown -= .05;
    var timer = document.getElementById('timer');
    timer.textContent = "Time Left:" + countDown.toFixed(2);
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
    gameCards.innerHTML = ' ';
    attempts = 0;
    matches = 0;
    gamesPlayed++
    displayStats();
    shuffle();
    makeCards();
    modalWin.className = 'modal win hidden';
    modalLose.className = 'modal lose hidden';
    modalStart.className = 'modal start';
    clearInterval(timerInterval);
    clearTimeout(loseTimeout);
    clearTimeout(lastTenTimeout);
    lastTenAudio.pause();
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
startScreen.addEventListener('click', startTime);
resetButton.addEventListener('click', resetGame);
resetButton2.addEventListener('click', resetGame);
resetTop.addEventListener('click', resetGame);
toggleSound.addEventListener('click', tSound);
shuffle();
makeCards();

function handleClick(e) {
    //check if firstCardClicked is empty
    if (event.target.className.indexOf("card-back") === -1) {
        return;
    }
    playAudio(clickAudio);
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
            setTimeout(function(){
                playAudio(correctAudio)
            }, 300);
            removeClicked();
            addListener();
            matches++;
            attempts++;
            if (matches === maxMatches) {
                clearInterval(timerInterval);
                clearTimeout(loseTimeout);
                clearTimeout(lastTenTimeout);
                lastTenAudio.pause();
                setTimeout(function () {
                    modalWin.classList.remove('hidden');
                    playAudio(endGameAudio);
                }, 1000)
            }
        } else {
            setTimeout(function () {
                removeHidden();
                removeClicked();
                addListener();
                playAudio(incorrectAudio);
            }, 1000)
            attempts++;
        }
    }
    displayStats();
}

function startTime(e) {
    var newTime = Number(e.target.id);
    countDown = newTime;
    loseDelay = newTime * 1000;
    if (e.target.className != 'start-button') {
        return;
    }
    modalStart.classList.add('hidden');
    timerInterval = setInterval(function () {
        timerCountDown()
    }, 50);
    lastTenTimeout = setTimeout(function(){
        lastTenAudio.play();
    }, loseDelay - 10000);
    loseTimeout = setTimeout(function () {
        playAudio(loseAudio);
        modalLose.classList.remove('hidden');
        clearInterval(timerInterval);
    }, loseDelay);
}
