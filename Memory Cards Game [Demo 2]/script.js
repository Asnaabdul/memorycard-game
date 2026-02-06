const cardsContainer = document.querySelector(".cards");
const timeTag = document.querySelector(".time b");
const flipsTag = document.querySelector(".flips b");
const refreshBtn = document.querySelector("#refresh-btn");

let maxTime = 36 ;
let timeLeft = maxTime;
let flips = 0;
let matchedCard = 0;
let disableDeck = false;
let isPlaying = false;
let cardOne, cardTwo, timer;

// Timer function
function initTimer() {
    if(timeLeft <= 0) {
        clearInterval(timer);
        return;
    }
    timeLeft--;
    timeTag.innerText = timeLeft;
}

// Flip card function
function flipCard({target: clickedCard}) {
    if(!isPlaying) {
        isPlaying = true;
        timer = setInterval(initTimer, 1000);
    }
    if(clickedCard !== cardOne && !disableDeck && timeLeft > 0) {
        flips++;
        flipsTag.innerText = flips;
        clickedCard.classList.add("flip");
        if(!cardOne) {
            cardOne = clickedCard;
            return;
        }
        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector(".back-view img").src;
        let cardTwoImg = cardTwo.querySelector(".back-view img").src;
        matchCards(cardOneImg, cardTwoImg);
    }
}

// Match cards function
function matchCards(img1, img2) {
    if(img1 === img2) {
        matchedCard++;
        if(matchedCard === 9) {
            clearInterval(timer);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = "";
        disableDeck = false;
        return;
    }

    setTimeout(() => {
        cardOne.classList.add("shake");
        cardTwo.classList.add("shake");
    }, 400);

    setTimeout(() => {
        cardOne.classList.remove("shake", "flip");
        cardTwo.classList.remove("shake", "flip");
        cardOne = cardTwo = "";
        disableDeck = false;
    }, 1000);
}

// Shuffle cards (DOM elements only)
function shuffleCards() {
    const cardsArray = Array.from(cardsContainer.children);
    cardsArray.sort(() => Math.random() - 0.5);
    cardsArray.forEach(card => cardsContainer.appendChild(card));
}

// Reset game function
function resetGame() {
    clearInterval(timer);
    timeLeft = maxTime;
    flips = matchedCard = 0;
    cardOne = cardTwo = "";
    isPlaying = disableDeck = false;
    timeTag.innerText = timeLeft;
    flipsTag.innerText = flips;

    // Remove flip from all cards
    document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flip");
        card.addEventListener("click", flipCard); // Reattach click event
    });

    shuffleCards();
}

// Initial setup
resetGame(); // This shuffles and attaches events
refreshBtn.addEventListener("click", resetGame);
