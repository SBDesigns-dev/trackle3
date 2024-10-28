// Assign a unique storage key for each game
const STORAGE_KEY = "guessed_places_game1"; // Change this key for each game file, e.g., "guessed_places_game2" for game 2

function enterGuess() {
  app.enterGuess();
}

function normalizeName(name) {
  return name
    .toUpperCase()
    .replace(/\&/g, "AND")
    .replace(/STREET/g, "ST")
    .replace(/\W/g, "");
}

// Access guessed places specific to this game
function getStore() {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
}

// Save guessed places specific to this game
function setStore(places) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
}

function addToStore(place) {
  let found = getStore();
  found[place] = true;
  setStore(found);
}

function hasFoundPlace(place) {
  let found = getStore();
  return !!found[place];
}

App.prototype.enterGuess = function () {
  var inputField = document.getElementById("guess");
  var inputName = normalizeName(inputField.value);

  var placeMatch = null;
  var placeMatchDistance = null;
  this.placeList.forEach((place) => {
    const cleanName = normalizeName(place.name);

    const distance =
      cleanName == inputName ? -1 : dziemba_levenshtein(cleanName, inputName);

    if (placeMatchDistance && distance < placeMatchDistance) return;

    var threshold = place.name.length < 5 ? 0 : place.name.length > 12 ? 2 : 1;

    if (cleanName.startsWith("HEATHROW")) {
      threshold = 0;
    }

    if (distance <= threshold) {
      placeMatch = place;
      placeMatchDistance = distance;
    }
  });

  const alreadyFound = placeMatch && hasFoundPlace(placeMatch.name);

  if (placeMatch && !alreadyFound) {
    addToStore(placeMatch.name);
    placeMatch.showOverlay();
    placeMatch.pan();

    document
      .getElementById("score")
      .animate([{ color: "#000" }, { color: "#fff" }, { color: "#000" }], {
        duration: 1000,
        iterations: 1,
      });

    setTimeout(() => {
      this.displayScore();
    }, 500);

    inputField.value = "";
  } else {
    if (placeMatch) placeMatch.pan();
    inputField.animate(
      [
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
        { transform: "translateX(-3px)" },
        { transform: "translateX(3px)" },
      ],
      {
        duration: 800,
        iterations: 1,
      }
    );
    inputField.select();
  }
};

// Other functions remain unchanged
