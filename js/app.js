/*
 * Create a list that holds all of your cards
 */

const deck = document.querySelector('.deck');
let moves = 0;
let toggledCards = [];
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const pairs = 8;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function shuffleDeck() {
	const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
	const shuffledCards = shuffle(cardsToShuffle);
	for (card of shuffledCards) {
		card.classList.remove('show');
		card.classList.remove('open');
		card.classList.remove('match')
		deck.appendChild(card);
	}
}
shuffleDeck();

function isValid(clickTarget) {
	return (clickTarget.classList.contains('card') && !clickTarget.classList.contains('match') && toggledCards.length < 2 && !toggledCards.includes(clickTarget));
}

deck.addEventListener('click', event => {
	const clickTarget = event.target;
	if (isValid(clickTarget)) {
		if(clockOff) {
			startClock();
			clockOff = false;
		}
		toggleCard(clickTarget);
		addToggleCard(clickTarget);
		addMove();
		checkScore();
		if (toggledCards.length === 2) {
			checkIfMatch(clickTarget);
		}

	}
});

// Display the card's symbol when clicked
function toggleCard(card) {
	card.classList.toggle('open');
	card.classList.toggle('show');
}

// Add the card to a *list* of "open" cards
function addToggleCard(clickTarget) {
	toggledCards.push(clickTarget);
	console.log(toggledCards);
}

//See if cards match
function checkIfMatch() {
	if (
		toggledCards[0].firstElementChild.className === toggledCards[1].firstElementChild.className ) {
		toggledCards[0].classList.toggle('match');
		toggledCards[1].classList.toggle('match');
		toggledCards = [];
		matched++;
	} else {
		setTimeout(() => {
			toggleCard(toggledCards[0]);
			toggleCard(toggledCards[1]);
			toggledCards = [];
		}, 1000);
}
}

//add moves
function addMove() {
	moves++;
	const movesText = document.querySelector('.moves');
	movesText.innerHTML = moves;
}

//stars bases on move count
function checkScore() {
	if (moves === 14 || moves === 20) {
		hideStar();
	}
}

function hideStar () {
	const starList = document.querySelectorAll('.stars li');
	for (star of starList) {
		if (star.style.display !== 'none') {
			star.style.display = 'none';
			break;
		}
	}
}

//timer starts
function startClock () {
	clockId = setInterval(() => {
		time++;
		displayTime();
	}, 1000);
}


function displayTime() {
	const clock = document.querySelector('.clock');
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	clock.innerHTML = time;
	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	} else {
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}

//timer stops
function stopClock() {
	clearInterval(clockId);
}

//modal with stats
function toggleModal() {
	const modal = document.querySelector('.modal__background');
	modal.classList.toggle('hide');
}


function writeModalStats() {
	const timeStat = document.querySelector('.modal__time');
	const clockTime = document.querySelector('.clock').innerHTML;
	const movesStat = document.querySelector('.modal__moves');
	const starsStat = document.querySelector('.modal__stars');
	const stars = getStars();
	timeStat.innerHTML= `Time = ${clockTime}`;
	movesStat.innerHTML = `Moves = ${moves}`;
	starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
	stars = document.querySelectorAll('.stars li');
	starCount = 0;
	for (star of stars) {
		if (star.style.display !== 'none') {
			starCount++;
		}
	}
	console.log(starCount);
	return starCount;
}


document.querySelector('.modal__cancel').addEventListener('click', toggleModal);
document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal__replay').addEventListener('click', replayGame);



function resetGame() {
	resetClockAndTime();
	resetMoves();
	resetStars();
	resetCards();
	shuffleDeck();

}

function resetClockAndTime() {
	stopClock();
	clockOff = true;
	time = 0;
	displayTime();
}

function resetMoves() {
	moves = 0;
	document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
	stars = 0;
	const starList = document.querySelector('.star li');
	for (star of starsList) {
		star.style.display = 'inline';
	}
}

function resetCards() {
	const cards = document.querySelectorAll('.deck li');
	for (let card of cards) {
		card.className = 'card';
	}

}

function replayGame() {
	resetGame();
	toggleModal();
}


function checkWin() {
	if (matched === pairs) {
		gameOver();
	}
}

function gameOver() {
	stopClock();
	writeModalStats();
	toggleModal();
}

