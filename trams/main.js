var app;
var map;
var tiles; // Reference to the tile layer for theme switching

class App {
  constructor() {
    this.placeList = [];
  }

  initialize() {
    if (navigator.share === undefined) {
      document.getElementById("share").remove();
    }

    this.initializePlaces();

    console.log("create the map");

    // Initialize the map and set up the initial theme
    map = L.map("map", { zoomControl: false }).setView([51.508328, -0.124819], 13);
    this.setMapTheme();

    // Listen for changes in the device's theme preference
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      this.setMapTheme(); // Update map theme on device theme change
    });

    let foundPlaces = JSON.parse(window.localStorage.getItem("places-trams") || "{}");
    this.placeList.forEach((place) => {
      if (foundPlaces[place.name]) {
        place.showOverlay();
      }
    });

    document.getElementById("guess").addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        app.enterGuess();
      }
    });

    this.displayScore();
  }

  setMapTheme() {
    const darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const mapStyle = darkMode
      ? "https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FpbGFuIiwiYSI6ImNreHh6MjNtNzJhd3oyb21wYjRkY2U0aGsifQ.tZzQ-GAom5_D8SLwrqmy-Q"
      : "https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FpbGFuIiwiYSI6ImNreHh6MjNtNzJhd3oyb21wYjRkY2U0aGsifQ.tZzQ-GAom5_D8SLwrqmy-Q";

    // Remove existing tiles if they exist
    if (tiles) {
      map.removeLayer(tiles);
    }

    // Set the new tile layer based on the theme
    tiles = L.tileLayer(mapStyle, {
      minZoom: 10,
      maxZoom: 16,
      
    }).addTo(map);
  }
}

const roundelIcon = L.icon({
  iconUrl:
    "https://cdn.glitch.global/dd79283f-e3f0-415c-8229-170f3b139b79/Trams_roundel.svg.png?v=1722597837464",
  iconSize: [32, 32],
});

class Place {
  constructor(name, pt) {
    this.name = name;
    this.pt = pt;

    this.overlay = null;
  }

  showOverlay() {
    L.marker(this.pt, {
      icon: roundelIcon,
    })
      .bindTooltip(this.name, {
        direction: "right",
        className: "place-tooltip",
      })
      .addTo(map);
  }
  pan() {
    map.panTo(this.pt, {
      animate: true,
    });
  }
}

function loadPage() {
  console.log("load page");

  app = new App();
  app.initialize();

  document.getElementById("guess").focus();
}
