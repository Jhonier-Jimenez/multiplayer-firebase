//Misc Helpers

const mapData = {
  minX: 1,
  maxX: 14,
  minY: 4,
  maxY: 12,
  blockedSpaces: {
    "7x4": true,
    "1x11": true,
    "12x10": true,
    "4x7": true,
    "5x7": true,
    "6x7": true,
    "8x6": true,
    "9x6": true,
    "10x6": true,
    "7x9": true,
    "8x9": true,
    "9x9": true,
  },
};

// Options for Player Colors... these are in the same order as our sprite sheet
export const playerColors = [
  "blue",
  "red",
  "orange",
  "yellow",
  "green",
  "purple",
];

export function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray([
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 2, y: 8 },
    { x: 2, y: 9 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
    { x: 5, y: 8 },
    { x: 5, y: 10 },
    { x: 5, y: 11 },
    { x: 11, y: 7 },
    { x: 12, y: 7 },
    { x: 13, y: 7 },
    { x: 13, y: 6 },
    { x: 13, y: 8 },
    { x: 7, y: 6 },
    { x: 7, y: 7 },
    { x: 7, y: 8 },
    { x: 8, y: 8 },
    { x: 10, y: 8 },
    { x: 8, y: 8 },
    { x: 11, y: 4 },
  ]);
}

export function getKeyString(x, y) {
  return `${x}x${y}`;
}

export function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function isSolid(x, y) {
  const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)];
  return (
    blockedNextSpace ||
    x >= mapData.maxX ||
    x < mapData.minX ||
    y >= mapData.maxY ||
    y < mapData.minY
  );
}

export function handleArrowPress(
  xChange,
  yChange,
  playerId,
  players,
  playerRef,
  coins
) {
  const newX = players[playerId].x + xChange;
  const newY = players[playerId].y + yChange;
  console.log(isSolid(newX, newY));

  if (!isSolid(newX, newY)) {
    players[playerId].x += xChange;
    players[playerId].y += yChange;

    if (xChange === 1) {
      players[playerId].direction = "right";
    }
    if (xChange === -1) {
      players[playerId].direction = "left";
    }

    playerRef.set(players[playerId]);
  }

  attemptGrabCoin(newX, newY, coins, players, playerId, playerRef);
}

export function createName() {
  const prefix = randomFromArray([
    "FEO",
    "SUPER",
    "RAPERO",
    "DULCE",
    "TRAMPOSO",
    "SEDOSO",
    "BUENO",
    "SEGURO",
    "CAPUCHO",
    "ACOSADOR",
    "CALIENTE",
    "RICO",
    "LARGO",
    "OSCURO",
    "SUAVE",
    "REBELDE",
    "VOLADOR",
  ]);
  const animal = randomFromArray([
    "OSO",
    "PERRO",
    "GATO",
    "ZORRO",
    "CORDERO",
    "LEÓN",
    "BOAR",
    "CABRA",
    "MONO",
    "FOCA",
    "PUMA",
    "MULA",
    "TORO",
    "AVE",
    "INSECTO",
  ]);
  return `${animal} ${prefix}`;
}

export function placeCoin() {
  const { x, y } = getRandomSafeSpot();
  const coinRef = firebase.database().ref(`coins/${getKeyString(x, y)}`);
  coinRef.set({
    x,
    y,
  });

  const coinTimeouts = [2000, 3000, 4000, 5000];
  setTimeout(() => {
    placeCoin();
  }, randomFromArray(coinTimeouts));
}

function attemptGrabCoin(x, y, coins, players, playerId, playerRef) {
  const key = getKeyString(x, y);
  if (coins[key]) {
    // Remove this key from data, then uptick Player's coin count
    firebase.database().ref(`coins/${key}`).remove();
    playerRef.update({
      coins: players[playerId].coins + 1,
    });
  }
}
