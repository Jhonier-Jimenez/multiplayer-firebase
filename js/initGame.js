import {
  handleArrowPress,
  placeCoin,
  getKeyString,
  playerColors,
} from "../js/utils.js";

export function initGame(
  gameContainer,
  playerId,
  playerRef,
  playerNameInput,
  playerColorButton
) {
  const allPlayersRef = firebase.database().ref(`players`);
  const allCoinsRef = firebase.database().ref(`coins`);

  let players; //Firebase list of players who are in game
  let playerElements = {}; //List DOM elements of players who are in game
  let coins = {}; //Firebase list of coins in the game
  let coinElements = {}; //List DOM elements of coins in game

  new KeyPressListener("ArrowUp", () =>
    handleArrowPress(0, -1, playerId, players, playerRef, coins)
  );
  new KeyPressListener("ArrowDown", () =>
    handleArrowPress(0, 1, playerId, players, playerRef, coins)
  );
  new KeyPressListener("ArrowLeft", () =>
    handleArrowPress(-1, 0, playerId, players, playerRef, coins)
  );
  new KeyPressListener("ArrowRight", () =>
    handleArrowPress(1, 0, playerId, players, playerRef, coins)
  );

  //Updates player name with text input
  playerNameInput.addEventListener("change", (e) => {
    const newName = e.target.value || createName();
    playerNameInput.value = newName;
    playerRef.update({
      name: newName,
    });
  });

  //Update player color on button click
  playerColorButton.addEventListener("click", () => {
    const mySkinIndex = playerColors.indexOf(players[playerId].color);
    const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
    playerRef.update({
      color: nextColor,
    });
  });

  //Fires whenever a change occurs on the players firebase list
  allPlayersRef.on("value", (snapshot) => {
    players = snapshot.val() || {};

    Object.keys(players).forEach((key) => {
      const characterState = players[key];
      let characterElement = playerElements[key];

      // Now update the DOM corresponding to each player
      characterElement.querySelector(".Character_name").innerText =
        characterState.name;
      characterElement.querySelector(".Character_coins").innerText =
        characterState.coins;
      characterElement.setAttribute("data-color", characterState.color);
      characterElement.setAttribute("data-direction", characterState.direction);

      //Update the position on the map
      const left = 16 * characterState.x + "px";
      const top = 16 * characterState.y - 4 + "px";
      characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
    });
  });

  //Fires whenever a new node is added the firebase players tree
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
    characterElement.setAttribute("data-color", addedPlayer.color);
    characterElement.setAttribute("data-direction", addedPlayer.direction);

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

  allCoinsRef.on("child_added", (snapshot) => {
    const coin = snapshot.val();
    const key = getKeyString(coin.x, coin.y);
    coins[key] = true;

    // Create the DOM Element for the newly added coin
    const coinElement = document.createElement("div");
    coinElement.classList.add("Coin", "grid-cell");
    coinElement.innerHTML = `
        <div class="Coin_shadow grid-cell"></div>
        <div class="Coin_sprite grid-cell"></div>
      `;

    // Position the Element
    const left = 16 * coin.x + "px";
    const top = 16 * coin.y - 4 + "px";
    coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;

    // Keep a reference for removal later and add to DOM
    coinElements[key] = coinElement;
    gameContainer.appendChild(coinElement);
  });

  //Fires when a coin is removed from the map
  //Remove the DOM element related to the mentioned coin
  allCoinsRef.on("child_removed", (snapshot) => {
    const { x, y } = snapshot.val();
    const keyToRemove = getKeyString(x, y);
    gameContainer.removeChild(coinElements[keyToRemove]);
    delete coinElements[keyToRemove];
  });

  //Fires when a player leaves the game
  //Remove the DOM element related to the player who left
  allPlayersRef.on("child_removed", (snapshot) => {
    const removedPlayerID = snapshot.val().id;
    gameContainer.removeChild(playerElements[removedPlayerID]);
    delete playerElements[removedPlayerID];
  });

  //This block will remove coins from local state when Firebase `coins` value updates
  allCoinsRef.on("value", (snapshot) => {
    coins = snapshot.val() || {};
  });

  placeCoin();
}
