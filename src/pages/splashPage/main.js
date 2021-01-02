//https://www.facebook.com/embed/instantgames/423834275327355/player?game_url=https://localhost:8080
//http-server --ssl -c-1 -p 8080 -a 127.0.0.1 

class SplashPage {
  constructor(playerId, playerName, playerPic){
    this.playerId = playerId;
    this.playerName = playerName;
    this.playerPic = playerPic;
  }

  initializePage(){
    var splashTitle = "Welcome  " + this.playerName;
    document.getElementById("splash-title").innerText = splashTitle;
    document.getElementById("game-list-container").style.display = "flex"
  };

}


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
          .then(function() {
            console.log("GAME_STARTED")
            var playerName = FBInstant.player.getName();
            var playerPic = FBInstant.player.getPhoto();
            var playerId = FBInstant.player.getID();
            console.log("PLAYERID PLAYERNAME",playerId, playerName);
            const splashPage = new SplashPage(playerId, playerName, playerPic);
            splashPage.initializePage();
          }
        );
      }
    }, 100);
  }
);

