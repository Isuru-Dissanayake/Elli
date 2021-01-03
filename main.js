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

var playerName = '';
var playerPic = '';
var playerId = '';

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
      }, 100);
    }
  );
};

function onClickGameCard() {
  const gameDescriptionPage = `<div class="game-description-container w3-animate-opacity">
                                <img src="src/assets/images/poosa.png" style="position: absolute; z-index: -1; width: 100%;"/>
                                <div class="header-container">
                                  <div class="header-icon" onclick="onClickBackButton()"><i class="fa fa-arrow-left"></i></div>
                                </div>
                                <p class="game-description">My 2 months old kitten was killed by a stray dog on 2nd on January, 2021. So I made this game, CATS VS DOGS.</p>
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
  renderGameWindow();
  gameTimer();
  renderGameGrid();
}

function renderGameWindow() {
  const gameWindow = `<div class="game-container">
                        <div class="game-header">
                          <div id='game-time' class="game-time">30</div>
                          <div class="game-data">
                            <div class="game-score">100</div>
                          </div>
                        </div>
                        <div id="game-grid" class="game-grid">
                        </div>
                      </div>`
  document.getElementById('visible-container').innerHTML = gameWindow;
}

function gameTimer() {
  var timeLeft = 5;
  var interval = setInterval(function(){
    timeLeft -= 1;
    document.getElementById('game-time').innerText = timeLeft;
    if (timeLeft === 0){
      clearInterval(interval);
      document.getElementById('game-time').innerText = 'Game Over';
    }
  },1000)
}

function renderGameGrid() {
  var gridElementWidth = window.innerWidth * 0.18;
  var gridHeight = (window.innerHeight - 75) * 0.9;
  gridElementWidth = parseInt(gridElementWidth);
  gridHeight = parseInt(gridHeight)
  numberOfRows = Math.floor(gridHeight/gridElementWidth)
  var gameGrid = '';
  for (i = 0; i < 5; i++){
    gameGrid += `<div class="grid-colum"></div>`
  }
  document.getElementById('game-grid').innerHTML = gameGrid;
}


