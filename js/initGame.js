import { handleArrowPress } from "../js/utils.js";

export function initGame(gameContainer, playerId, playerRef) {
  const allPlayersRef = firebase.database().ref(`players`);
  const allCoinsRef = firebase.database().ref(`coins`);

  let players; //Firebase list of players who are in game
  let playerElements = {}; //List DOM elements of players who are in game

  new KeyPressListener("ArrowUp", () =>
    handleArrowPress(0, -1, playerId, players, playerRef)
  );
  new KeyPressListener("ArrowDown", () =>
    handleArrowPress(0, 1, playerId, players, playerRef)
  );
  new KeyPressListener("ArrowLeft", () =>
    handleArrowPress(-1, 0, playerId, players, playerRef)
  );
  new KeyPressListener("ArrowRight", () =>
    handleArrowPress(1, 0, playerId, players, playerRef)
  );

  //Fires whenever a change occurs on the players object
  allPlayersRef.on("value", (snapshot) => {
    players = snapshot.val() || {};

    Object.keys(players).forEach((key) => {
      const characterState = players[key];
      let characterElement = playerElements[key];

      // Now update the DOM corresponding to each player
      characterElement.querySelector(".Character_name").innerText =
        characterState.name;
      const left = 16 * characterState.x + "px";
      const top = 16 * characterState.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
    });
  });

  //Fires whenever a new node is added the players tree
  allPlayersRef.on("child_added", (snapshot) => {
    console.log(snapshot);
    const addedPlayer = snapshot.val();

    const characterElement = document.createElement("div");
    characterElement.classList.add("Character", "grid-cell");

    //Are you the new player? If yes, then add an specific CSS class
    if (addedPlayer.id === playerId) {
      characterElement.classList.add("you");
    }
    //Create the HTML element for the new node rather its you or anyone
    characterElement.innerHTML = `
        <div class="Character_shadow grid-cell"></div>
        <div class="Character_sprite grid-cell"></div>
        <div class="Character_name-container">
          <span class="Character_name"></span>
          <span class="Character_coins">0</span>
        </div>
        <div class="Character_you-arrow"></div>
      `;

    //Fill in some initial state
    characterElement.querySelector(".Character_name").innerText =
      addedPlayer.name;
    characterElement.querySelector(".Character_coins").innerText =
      addedPlayer.coins;

    //Set the position on the map
    const left = 16 * addedPlayer.x + "px";
    const top = 16 * addedPlayer.y - 4 + "px";
    characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;

    //Add the newly created player HTML element to the list
    playerElements[addedPlayer.id] = characterElement;

    console.log(playerElements);
    console.log(addedPlayer.name);

    //Add the newly created player to the game container for it to be seen on screen
    gameContainer.appendChild(characterElement);
  });
}
