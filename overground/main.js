var app; // Global variable to hold the instance of the App class
var map; // Global variable to hold the Leaflet map instance
var tiles; // Reference to the tile layer for theme switching

class App {
  constructor() {
    this.placeList = []; // Initialize an empty list to store place data
  }

  initialize() {
    if (navigator.share === undefined) {
      // Remove the share button if the browser doesn't support Web Share API
      document.getElementById("share").remove();
    }

    this.initializePlaces(); // Load the list of places

    console.log("create the map");

    // Create a Leaflet map, centered on London, without a zoom control
    map = L.map("map", { zoomControl: false }).setView([51.508328, -0.124819], 13);
    this.setMapTheme(); // Apply the correct map theme based on system preferences

    // Update the map theme whenever the user's system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      this.setMapTheme();
    });

    let foundPlaces = JSON.parse(window.localStorage.getItem("places-overground") || "{}");
    // Iterate over all places and show overlays for previously found ones
    this.placeList.forEach((place) => {
      if (foundPlaces[place.name]) {
        place.showOverlay();
      }
    });

    // Add an event listener to the input field to handle guesses on "Enter" key press
    document.getElementById("guess").addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        app.enterGuess(); // Call the method to process the guess
      }
    });

    this.displayScore(); // Display the current score and total places
  }

  setMapTheme() {
    // Check if the system is in dark mode
    const darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Set the map style URL based on the theme
    const mapStyle = darkMode
      ? "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FpbGFuIiwiYSI6ImNreHh6MjNtNzJhd3oyb21wYjRkY2U0aGsifQ.tZzQ-GAom5_D8SLwrqmy-Q"
      : "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FpbGFuIiwiYSI6ImNreHh6MjNtNzJhd3oyb21wYjRkY2U0aGsifQ.tZzQ-GAom5_D8SLwrqmy-Q";

    // Remove the existing tile layer if it exists
    if (tiles) {
      map.removeLayer(tiles);
    }

    // Add the new tile layer to the map
    tiles = L.tileLayer(mapStyle, {
      minZoom: 10, // Minimum zoom level allowed
      maxZoom: 16, // Maximum zoom level allowed
    }).addTo(map);
  }
}

// Icon for marking places on the map
const roundelIcon = L.icon({
  iconUrl:
    "https://cdn.glitch.global/46c002a9-06ae-4e8c-a823-22c55b1e128a/London_Overground_logo.svg.png?v=1722597669528",
  iconSize: [32, 32], // Size of the icon in pixels
});

class Place {
  constructor(name, pt) {
    this.name = name; // Name of the place
    this.pt = pt; // Coordinates of the place
    this.overlay = null; // Marker or tooltip overlay for the place
  }

  showOverlay() {
    // Add a marker with a tooltip at the place's location on the map
    L.marker(this.pt, {
      icon: roundelIcon, // Use the custom roundel icon
    })
      .bindTooltip(this.name, {
        direction: "right", // Tooltip appears to the right of the marker
        className: "place-tooltip", // CSS class for custom tooltip styling
      })
      .addTo(map); // Add the marker to the map
  }

  pan() {
    // Animate the map to center on the place's location
    map.panTo(this.pt, {
      animate: true,
    });
  }
}

// Main function called when the page is loaded
function loadPage() {
  console.log("load page");

  app = new App(); // Create an instance of the App class
  app.initialize(); // Initialize the app

  document.getElementById("guess").focus(); // Automatically focus on the input field
}
