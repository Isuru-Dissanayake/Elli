//https://www.facebook.com/embed/instantgames/423834275327355/player?game_url=https://localhost:8080
//http-server --ssl -c-1 -p 8080 -a 127.0.0.1 

class HomePage {
  constructor(playerId, playerName, playerPic){
    this.playerId = playerId;
    this.playerName = playerName;
    this.playerPic = playerPic;
    this.initializePage();
  }

  initializePage(){
    console.log("initializeHomePage")
    var splashTitle = "Welcome  " + this.playerName;
    document.getElementById("splash-title").innerText = splashTitle;
    document.getElementById("game-list-container").style.display = "flex"
  };
}

//constants and variables
var playerName = '';
var playerPic = '';
var playerId = '';

var playAs = null;
var opponent = null;

var timeLeft = 31;

var numberOfRows = 0;
var numberOfcolumns = 5;
var elementWidth = 0;
var currentElements = [];
var stopGame = false;
var clickedDead = false;

var score = 0;
var finalScore = 0;

function initializeGameData() {
  playAs = null;
  opponent = null;

  timeLeft = 31;

  numberOfRows = 0;
  numberOfcolumns = 5;
  elementWidth = 0;
  currentElements = [];
  stopGame = false;
  clickedDead = false;

  score = 0;
  finalScore = 0;
} 

function onStart() {
  playerName = FBInstant.player.getName();
  playerPic = FBInstant.player.getPhoto();
  playerId = FBInstant.player.getID();
  console.log("PLAYERID PLAYERNAME",playerId, playerName);
  const homePage = new HomePage(playerId, playerName, playerPic);
}

window.onload = function() {
  FBInstant.initializeAsync()
    .then(function(){
      console.log("SDK_LOADED");
      var progress = 0;
      var interval = setInterval( function(){
        progress += 3;
        FBInstant.setLoadingProgress(progress);
        if (progress >= 97){
          clearInterval(interval);
          FBInstant.startGameAsync()
            .then(onStart());
        }
      }, 10);
    }
  );
};

function onClickGameCard() {
  const gameDescriptionPage = `<div class="game-description-container w3-animate-opacity">
                                <img src="src/assets/images/poosa.png" style="position: absolute; z-index: -1; width: 100%;"/>
                                <div class="header-container">
                                  <div class="header-icon" onclick="onClickBackButton()"><i class="fa fa-arrow-left"></i></div>
                                </div>
                                <p class="game-description">
                                  My 2 months old kitten was killed by a stray dog on 2nd on January, 2021. So I made this game, CATS VS DOGS.
                                  Play as Cats or Dogs and kill others.
                                </p>
                                <div class="play-as-container">
                                  <div class="play-as">Play as</div>
                                  <div class="play-as-image-div">
                                    <img id="play-as-cat" src="src/assets/images/cat.png" width="150" class="play-as-image" onclick="onClickPlayAs('CAT')"/>
                                    <img id="play-as-dog" src="src/assets/images/dog.png" width="150" class="play-as-image" onclick="onClickPlayAs('DOG')"/>
                                  </div>
                                  <div id="play-button" class="play-button">Play</div>
                                </div>
                              </div>`
  document.getElementById('visible-container').innerHTML = gameDescriptionPage
}

function onClickBackButton() {
  const homePage = `<div class="splash-container">
                      <div class="logo-container">
                        <img src="src/assets/images/elli.png" width="150"/>
                        <div id="splash-title" class="splash-title"></div>
                      </div>
                      <div id="game-list-container" class="game-list-container">
                        <div class="game-card w3-animate-opacity" onclick="onClickGameCard()">
                          <img src="src/assets/images/dog-and-cat-cover.jpg" />
                          <div class="game-card-title">Cats vs Dogs</div>
                        </div>
                        <div class="more-games-container">More games will be added soon.</div>
                      </div>
                    </div>`
  document.getElementById('visible-container').innerHTML = homePage;
  onStart();
}

function onClickPlayAs(type) {
  if (type === 'CAT') {
    document.getElementById('play-as-cat').style.cssText = 'border: solid; border-radius: 75px; border-width: 10px; border-radius: 75px; border-color: #fdba0b;'
    document.getElementById('play-as-dog').style.border = 'none'
  } else {
    document.getElementById('play-as-cat').style.border = 'none'
    document.getElementById('play-as-dog').style.cssText = 'border: solid; border-radius: 75px; border-width: 10px; border-radius: 75px; border-color: #fdba0b;'
  }
  document.getElementById('play-button').style.backgroundColor = '#fdba0b';
  document.getElementById('play-button').setAttribute( "onClick", `javascript: onClickPlayButton('${type}');` );
}

function onClickPlayButton(type) {
  initializeGameData();
  playAs = type;
  opponent = type==='CAT'? 'DOG':'CAT';
  renderGameWindow();
  renderGameGrid();
  gameTimer();
  getNextElement();
  removeNextElement();
}

function onClickQuitGame() {
  clickedDead = true;
  stopGame = true;
}

function renderGameWindow() {
  const gameWindow = `<div class="game-container">
                        <div class="game-header">
                          <div class="game-header-icon" onclick="onClickQuitGame()"><i class="fa fa-times"></i></div>
                          <div id='game-time' class="game-time">Loading</div>
                          <div class="game-data">
                            <div id="game-score" class="game-score">0</div>
                          </div>
                        </div>
                        <div id="game-grid" class="game-grid">
                        </div>
                      </div>`
  document.getElementById('visible-container').innerHTML = gameWindow;
}

function gameTimer() {
  var interval = setInterval(function(){
    timeLeft -= 1;
    if (timeLeft === 0 || clickedDead){
      clearInterval(interval);
      const gameTimeDiv = document.getElementById('game-time')
      if (gameTimeDiv){
        gameTimeDiv.innerText = 'Game Over';
      }
      stopGame = true;
      renderGameOver();
    } else if(timeLeft > 30) {
      document.getElementById('game-time').innerText = 'Loading';
    } else {
      document.getElementById('game-time').innerText = timeLeft;
    }
  },1000)
}

function renderGameGrid() {
  var gridElementWidth = document.getElementById('game-grid').offsetWidth * 0.18;
  var gridHeight = document.getElementById('game-grid').offsetHeight * 0.9;
  gridElementWidth = parseInt(gridElementWidth);
  elementWidth = gridElementWidth;
  gridHeight = parseInt(gridHeight)
  numberOfRows = Math.floor(gridHeight/gridElementWidth)
  var gameGrid = '';
  for (i = 0; i < 5; i++){
    gameGrid += `<div class="grid-colum">`
    for (j = 0; j < numberOfRows; j++){
      gameGrid += `<div id="grid-element-${i}-${j}" class="grid-element"  style="height: ${gridElementWidth}px;" onclick="onClickGridElement(${i},${j})"></div>`
    }
    gameGrid += `</div>`
  }
  document.getElementById('game-grid').innerHTML = gameGrid;
}

function getRowAndColumn() {
  const i = Math.floor(Math.random() * Math.floor(numberOfcolumns));
  const j = Math.floor(Math.random() * Math.floor(numberOfRows));
  return ({i, j})
}

function isDeadElement() {
  const e = Math.floor(Math.random() * Math.floor(10));
  if (e===8) {
    return true
  }else {
    return false
  }
}

function getNextElement() {
  var interval = setInterval(function(){
    if ( !stopGame){
      const { i, j } = getRowAndColumn();
      const isDead = isDeadElement();
      currentElements.push({i, j, isDead});
      if (isDead){
        document.getElementById(`grid-element-${i}-${j}`).innerHTML = `<img src="src/assets/images/${playAs.toLowerCase()}.png"/ style="height: ${elementWidth}px">`
      }else {
        document.getElementById(`grid-element-${i}-${j}`).innerHTML = `<img src="src/assets/images/${opponent.toLowerCase()}.png"/ style="height: ${elementWidth}px">`
      }
    }else {
      clearInterval(interval);
    }
  }, 400)
}

function removeNextElement() {
  setTimeout(function(){
    var interval = setInterval(function(){
      if (currentElements.length > 0){
        document.getElementById(`grid-element-${currentElements[0].i}-${currentElements[0].j}`).innerHTML = null; 
        currentElements.shift();
        if (stopGame){
          clearInterval(interval);
        }
      }
    }, 400)
  }, 1200);
}

function onClickGridElement(i, j) {
  if (!clickedDead){
    currentElements.forEach(e => {
      if (e.i === i && e.j === j){
        document.getElementById(`grid-element-${i}-${j}`).innerHTML = null; 
        if(e.click) {
          console.log('clicked before')
        }else {
          currentElements[currentElements.indexOf(e)] ={i, j, click: true};
          if(e.isDead) {
            console.log('dead!');
            clickedDead = true;
            stopGame = true;
            renderGameOver();
          }else {
            score += 20;
            document.getElementById("game-score").innerText = score;
          }
        }
      }
    })
  }
}

function renderGameOver() {
  const gameOver = `<div class="game-over-container w3-animate-opacity">
                      <div class="header-container">
                        <div class="header-icon" onclick="onClickBackButton()"><i class="fa fa-arrow-left"></i></div>
                      </div>
                      <div class="game-detail-container">
                        <div class="game-over-title">Game Over</div>
                        <div>
                          <img class="profile-photo" src="${playerPic}" />
                        </div>
                        <div id="final-score" class="score">0</div>
                        <div class="player-name">${playerName}</div>
                      </div>
                      <div class="play-again" onclick="onClickGameCard()">Play Again</div>
                    </div>`
  setTimeout(function(){
    document.getElementById('visible-container').innerHTML = gameOver;
    scoreCounter();
  }, 600)
}

function scoreCounter() {
  var interval = setInterval(() => {
    if(finalScore === score) {
      clearInterval(interval)
    } else {
      finalScore  +=1
      const finalScoreDiv =  document.getElementById('final-score')
      if (finalScoreDiv){finalScoreDiv.innerText = finalScore}
    }
  }, 20);
}