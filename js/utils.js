//Misc Helpers

export function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function handleArrowPress(
  xChange,
  yChange,
  playerId,
  players,
  playerRef
) {
  players[playerId].x += xChange;
  players[playerId].y += yChange;
  playerRef.set(players[playerId]);
}

export function createName() {
  const prefix = randomFromArray([
    "COOL",
    "SUPER",
    "HIP",
    "SMUG",
    "COOL",
    "SILKY",
    "GOOD",
    "SAFE",
    "DEAR",
    "DAMP",
    "WARM",
    "RICH",
    "LONG",
    "DARK",
    "SOFT",
    "BUFF",
    "DOPE",
  ]);
  const animal = randomFromArray([
    "BEAR",
    "DOG",
    "CAT",
    "FOX",
    "LAMB",
    "LION",
    "BOAR",
    "GOAT",
    "VOLE",
    "SEAL",
    "PUMA",
    "MULE",
    "BULL",
    "BIRD",
    "BUG",
  ]);
  return `${prefix} ${animal}`;
}
