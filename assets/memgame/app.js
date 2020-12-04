/*---The code for app.js and the Memgame is duplicated in apptwo.js for Funmatch 
for clarity bescause of the different images array, different winners array
and different timers--*/

/*-------image array for the onload preshpw-----------------*/

const frontImages = [
  "assets/memgame/images/bit1.jpg",
  "assets/memgame/images/back.jpg",
  "assets/memgame/images/bit2.jpg",
  "assets/memgame/images/back.jpg",
  "assets/memgame/images/bit3.jpg",
  "assets/memgame/images/back.jpg",
  "assets/memgame/images/eth1.jpg",
  "assets/memgame/images/back.jpg",
  "assets/memgame/images/lit1.jpg",
  "assets/memgame/images/back.jpg",
  "assets/memgame/images/rip1.jpg",
  "assets/memgame/images/back.jpg",
];

/*-------sounds-----------------*/

/*-------Functions so only one control box is displayed for the 
4 audio files and to set the audio src in it-----------------*/

var sound = document.getElementById("audio1")

function playSoundflip() {
    srcflip = "assets/memgame/sounds/click.mp3"
    sound.setAttribute('src', "assets/memgame/sounds/click.mp3");
    sound.play();
}

function playSoundlose() {
    srclose = "assets/memgame/sounds/game-lose.mp3";
    sound.setAttribute('src', srclose);
    sound.play();
}

function playSoundpair() {
    srcpair = "assets/memgame/sounds/pair.mp3";
    sound.setAttribute('src', srcpair);
    sound.play();
}

function playSoundwin() {
    srcwin = "assets/memgame/sounds/win.mp3";
    sound.setAttribute('src', srcwin);
    sound.play();
}

/*--------On load preshow display--/

/*-On load preshow images flash. They are set on the card back face with 
the movecard function bt a settimeout that lasts 20 seconds.*/

let faces = document.querySelectorAll(".card-front-face img");

function flashImage() {
  return frontImages[Math.floor(Math.random() * 12)];
}

function flashCard() {
  let randomface = faces[Math.floor(Math.random() * 12)];
  randomface.setAttribute("src", flashImage());
}

function moveCard() {
  timerId = setInterval(flashCard, 500);
  setTimeout(() => {
    clearInterval(timerId);
    faces.forEach((face) => {
      face.setAttribute("src", "assets/memgame/images/back.jpg");
    });
  }, 20000);
}
moveCard();

/*-------Timer------*/

/*--Countdown function for timer. 
1) If player looses calls alert and plays sound 
2) If player wins sets win time to localstorage along
with a ramdom winner number, displayes these on screen and playes win sound.
The random number does not need to be unique as users will be sending 
it in with their email-----*/

let playertime;
let winnernumber;
let timerId2;
let clocktime = document.getElementById("clock");
let currentTime = clocktime.textContent;
let timebut = document.getElementById("time");
timebut.addEventListener("click", startClock)
let box = document.getElementById("box1")

function startClock() {
  clocktime.style.color = "black";
  timerId2 = setInterval(countDown, 1000);
}

function countDown() {
  currentTime--;
  clocktime.textContent = currentTime;

  if (currentTime === 0) {
    playSoundlose();
    setTimeout(() => {
    alert("GAME OVER!"); }, 1000);
    currentTime = 60;
    clearInterval(timerId2);
  } else if (winners.length === 2) {
      playertime = currentTime;
      let winnernumber = (Math.random()*10000).toFixed();
      localStorage.setItem('wintime', playertime);
      localStorage.setItem('winnum', winnernumber);
      setTimeout(() => {
    playSoundwin(); }, 2000);
    box.innerHTML = `Winner..your time is ${playertime}...you number is ${winnernumber}.<spam id=winclick><a href= contact.html>Click</a></spam>  to enter competition.`;
    currentTime = 60;
    clearInterval(timerId2);
  }
}

/*--------Play button and shuffle-----------*/

/*-When the player clicks play 
1) The cards back image is reset after the preshow function. 
2) The timers are reset.
3) The cards are shuffled.
4) The winner display box is cleared.----------*/

winners = [];
var play = document.querySelector("#play");
play.addEventListener("click", shuffle);
var boxes = document.querySelectorAll(".card-box");

function shuffle() {
    box.innerHTML = ""
  clearInterval(timerId);
  clocktime.style.color = "red";
  currentTime = 60;
  clearInterval(timerId2);

  faces.forEach((face) => {
    face.setAttribute("src", "assets/memgame/images/back.jpg");
  });

  winners.forEach((win) => {
    win.addEventListener("click", flip);
  });
  winners.forEach((win) => {
    win.classList.remove("is-flipped");
  });

  winners = [];

  boxes.forEach((box) => {
    let ramPos = Math.floor(Math.random() * 12);
    box.style.order = ramPos;
  });

  reset();
}

/*--------------Main game functions----------*/

/*-Inspired by code from freeCodeCamp, details in Readme--*/

var cards = document.querySelectorAll(".card");
let flippedCard = false;
let freezeGame = false;
let cardOne, cardTwo;

function flip() {
  if (freezeGame) return;
  if (this === cardOne) return;
  playSoundflip();
  this.classList.add("is-flipped");
  if (!flippedCard) {
    flippedCard = true;
    cardOne = this;
  } else {
    flippedCard = false;
    cardTwo = this;
    checkForMatch();
  }
}

function checkForMatch() {
  if (cardOne.dataset.name === cardTwo.dataset.name) {
    freezeCards();
    setTimeout(() => {
    playSoundpair(); }, 500); 
    } else {
    unflipCards();
  }
}

function freezeCards() {
  cardOne.removeEventListener("click", flip);
  winners.push(cardOne, cardTwo);
  cardTwo.removeEventListener("click", flip);
  reset();
}

function unflipCards() {
  freezeGame = true;
  setTimeout(() => {
    cardOne.classList.remove("is-flipped");
    cardTwo.classList.remove("is-flipped");
    reset();
  }, 1000);
}

function reset() {
  flippedCard = false;
  freezeGame = false;
  cardOne = null;
  cardTwo = null;
}

cards.forEach((card) => card.addEventListener("click", flip));


