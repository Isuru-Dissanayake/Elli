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
  const gameDescriptionPage = `<div class="game-description-container">
                                  <div class="header-container">
                                    <div class="header-icon" onclick="onClickBackButton()"><i class="fa fa-arrow-left"></i></div>
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