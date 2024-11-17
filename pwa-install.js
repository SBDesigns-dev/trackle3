// DOM elements for the custom prompt
const installPrompt = document.getElementById('installPrompt');
const promptText = document.getElementById('promptText');

// Create buttons
const installButton = document.createElement('button');
const openInAppButton = document.createElement('button');
const closeButton = document.createElement('button');

// Set button styles and text
installButton.textContent = 'Install';
installButton.classList.add('styled-button');
installButton.style.backgroundColor = 'var(--accent-light)';
installButton.style.marginRight = '10px';

openInAppButton.textContent = 'Open in App';
openInAppButton.classList.add('styled-button');
openInAppButton.style.backgroundColor = 'var(--accent-light)';
openInAppButton.style.marginRight = '10px';

closeButton.textContent = 'Close';
closeButton.classList.add('styled-button');
closeButton.style.backgroundColor = 'var(--accent-light)';

// Variable to track deferred install prompt
let deferredInstallPrompt;

// Check if the app is installed and running in the browser
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

// Function to show the install or open-in-app prompt
function showPrompt(isInstalled) {
  // Clear previous content
  installPrompt.innerHTML = '';
  installPrompt.appendChild(promptText);

  // Set prompt message and buttons
  if (!isInstalled) {
    promptText.textContent = 'Install the Trackle™ app for a better experience!';
    installPrompt.appendChild(installButton);
  } else {
    promptText.textContent = 'Open the Trackle™ app for a better experience!';
    installPrompt.appendChild(openInAppButton);
  }

  installPrompt.appendChild(closeButton);
  installPrompt.style.display = 'block'; // Show the prompt
}

// Function to hide the prompt
function hidePrompt() {
  installPrompt.style.display = 'none';
}

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // Prevent the default install prompt
  deferredInstallPrompt = event; // Save the event for later

  // Show the prompt only if not standalone and not installed
  if (!isStandalone) {
    showPrompt(false);
  }
});

// Handle the install button click
installButton.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    // Show the browser's native install prompt
    deferredInstallPrompt.prompt();
    const choiceResult = await deferredInstallPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt variable
    deferredInstallPrompt = null;
  }

  hidePrompt();
});

// Handle the open-in-app button click
openInAppButton.addEventListener('click', () => {
  if (!isStandalone) {
    // Redirect to the app's homepage
    window.location.href = '/';
  }
});

// Handle the close button click
closeButton.addEventListener('click', hidePrompt);

// Show "Open in App" prompt if already installed but not running in standalone mode
if (isStandalone === false && 'getInstalledRelatedApps' in navigator) {
  navigator.getInstalledRelatedApps().then((apps) => {
    if (apps.length > 0) {
      showPrompt(true);
    }
  });
}
