import { randomFromArray, createName } from "./js/utils.js";
import { initGame } from "./js/initGame.js";

// Options for Player Colors... these are in the same order as our sprite sheet
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];

const pokemonList = ["Charmander", "Squirtle", "Bulbasaur"];

function getKeyString(x, y) {
  return `${x}x${y}`;
}

(function () {
  let playerId; //ID of the player who logged in Firebase
  let playerRef; //Ref to the player on Firebase so we can interact with the database

  const gameContainer = document.querySelector(".game-container");

  firebase.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      //You're logged in!
      const name = createName();
      playerId = user.uid;
      playerRef = firebase.database().ref(`players/${playerId}`);

      playerRef.set({
        id: playerId,
        name,
        color: randomFromArray(playerColors),
        pokemon: randomFromArray(pokemonList),
        x: 3,
        y: 10,
      });

      playerRef.onDisconnect().remove();

      initGame(gameContainer, playerId, playerRef);
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
