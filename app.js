import {
  randomFromArray,
  createName,
  getRandomSafeSpot,
  playerColors,
} from "./js/utils.js";
import { initGame } from "./js/initGame.js";

(function () {
  let playerId; //ID of the player who logged in Firebase
  let playerRef; //Ref to the player on Firebase so we can interact with the database

  const gameContainer = document.querySelector(".game-container");
  const playerNameInput = document.querySelector("#player-name");
  const playerColorButton = document.querySelector("#player-color");

  firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      //You're logged in!
      const name = createName();
      playerNameInput.value = name;
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      const { x, y } = getRandomSafeSpot();

      playerRef.set({
        id: playerId,
        name,
        color: randomFromArray(playerColors),
        x: x,
        y: y,
        color: randomFromArray(playerColors),
        coins: 0,
        direction: "right",
      });

      playerRef.onDisconnect().remove();

      initGame(
        gameContainer,
        playerId,
        playerRef,
        playerNameInput,
        playerColorButton
      );
    } else {
      //You're logged out.
    }
  });

  firebase
    .auth()
    .signInAnonymously()
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode, errorMessage);
    });
})();
