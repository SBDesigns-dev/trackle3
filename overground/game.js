function enterGuess() {
  app.enterGuess(); // Call the `enterGuess` method on the `app` object.
}

function normalizeName(name) {
  return name
    .toUpperCase() // Convert the input name to uppercase for uniform comparison.
    .replace(/\&/g, "AND") // Replace "&" with "AND".
    .replace(/STREET/g, "ST") // Replace "STREET" with "ST".
    .replace(/\W/g, ""); // Remove all non-alphanumeric characters.
}

function getStore() {
  return JSON.parse(window.localStorage.getItem("places-overground") || "{}"); // Retrieve and parse the "places-overground" object from local storage or return an empty object if it doesn't exist.
}

function setStore(places) {
  window.localStorage.setItem("places-overground", JSON.stringify(places)); // Convert `places` to a JSON string and store it in local storage under the key "places-overground".
}

function addToStore(place) {
  let found = getStore(); // Retrieve the current found places from local storage.
  found[place] = true; // Mark the `place` as found.
  setStore(found); // Update the local storage with the new list of found places.
}

function hasFoundPlace(place) {
  let found = getStore(); // Retrieve the current found places from local storage.
  return found[place]; // Check if the `place` is already marked as found.
}

App.prototype.enterGuess = function () {
  var inputField = document.getElementById("guess"); // Get the input field where the user enters their guess.
  var inputName = normalizeName(inputField.value); // Normalize the user's guess.

  var placeMatch = null; // Variable to store the matching place, if any.
  var placeMatchDistance = null; // Variable to store the best match distance.

  this.placeList.forEach((place) => {
    const cleanName = normalizeName(place.name); // Normalize the current place's name.

    const distance =
      cleanName == inputName ? -1 : dziemba_levenshtein(cleanName, inputName); // Calculate the Levenshtein distance between the names.

    if (placeMatchDistance && distance < placeMatchDistance) return; // Skip if the current match is worse than the best match.

    var threshold = place.name.length < 5 ? 0 : place.name.length > 12 ? 2 : 1; // Determine the acceptable threshold based on place name length.

    if (cleanName.startsWith("HEATHROW")) {
      threshold = 0; // Special case: No threshold for Heathrow stations.
    }

    if (distance <= threshold) {
      placeMatch = place; // Update the best match.
      placeMatchDistance = distance; // Update the best match distance.
    }
  });

  const alreadyFound = placeMatch && hasFoundPlace(placeMatch.name); // Check if the place has already been found.

  if (placeMatch && !alreadyFound) {
    addToStore(placeMatch.name); // Add the matched place to local storage.
    placeMatch.showOverlay(); // Highlight the place on the map.
    placeMatch.pan(); // Center the map on the place.

    document
      .getElementById("score")
      .animate([{ color: "#000" }, { color: "#fff" }, { color: "#000" }], {
        duration: 1000,
        iterations: 1, // Animate the score element's color to draw attention.
      });

    setTimeout(() => {
      this.displayScore(); // Update the score display after a short delay.
    }, 500);

    inputField.value = ""; // Clear the input field.
  } else {
    if (placeMatch) placeMatch.pan(); // Pan to the place if already found.
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
        iterations: 1, // Shake the input field to indicate an error.
      }
    );
    inputField.select(); // Highlight the input field text for correction.
  }
};

App.prototype.displayScore = function () {
  var score = Object.keys(
    JSON.parse(window.localStorage.getItem("places-overground") || "{}")
  ).length; // Count the number of found places.

  document.getElementById("score").innerHTML = score; // Update the score display.
  document.getElementById("total").innerHTML = this.placeList.length; // Display the total number of places.

  const shareText = `I just played Trackle™ and named ${score} London Underground stations! You can play Trackle™ too:`; // Text for sharing the game.

  const shareData = {
    title: "Trackle™ - The Tube Guessing Game",
    text: shareText,
    url: window.location.href, // Share data for web share API.
  };

  document.getElementById("share").onclick = (e) => {
    e.preventDefault(); // Prevent default link behavior.
    navigator.share(shareData); // Use the Web Share API to share.
  };

  if (score == this.placeList.length) {
    setTimeout("app.winMessage()", 100); // Display a win message if all places are found.
  }
};

App.prototype.winMessage = function () {
  alert("Well done! You found all " + this.placeList.length + " London Overground stations."); // Show an alert when the user wins.
};

function dziemba_levenshtein(a, b) {
  // Calculate the Levenshtein distance between two strings.

  var tmp;
  if (a.length === 0) {
    return b.length; // If the first string is empty, return the length of the second string.
  }
  if (b.length === 0) {
    return a.length; // If the second string is empty, return the length of the first string.
  }
  if (a.length > b.length) {
    tmp = a;
    a = b;
    b = tmp; // Ensure the shorter string is `a` for optimization.
  }

  var i,
    j,
    res,
    alen = a.length,
    blen = b.length,
    row = Array(alen); // Initialize the distance row.

  for (i = 0; i <= alen; i++) {
    row[i] = i; // Set initial values for the distance row.
  }

  for (i = 1; i <= blen; i++) {
    res = i; // Set the initial distance for the current row.
    for (j = 1; j <= alen; j++) {
      tmp = row[j - 1]; // Previous value in the row.
      row[j - 1] = res; // Update the previous value.
      res = Math.min(
        tmp + (b[i - 1] !== a[j - 1]), // Cost for substitution.
        res + 1, // Cost for insertion.
        row[j] + 1 // Cost for deletion.
      );
    }
    row[j - 1] = res; // Update the last value in the row.
  }
  return res; // Return the computed distance.
}

App.prototype.resetGame = function () {
  // Reset the game state.

  window.localStorage.removeItem("places-overground"); // Clear local storage.

  document.getElementById("score").innerHTML = 0; // Reset the score display.
  document.getElementById("total").innerHTML = this.placeList.length; // Reset the total display.
  location.reload(); // Reload the page to restart.

  this.placeList.forEach((place) => {
    if (place.overlay) {
      map.removeLayer(place.overlay); // Remove map overlays for all places.
      place.overlay = null; // Clear the overlay property.
    }
  });

  document.getElementById("guess").focus(); // Refocus on the input field.
};
