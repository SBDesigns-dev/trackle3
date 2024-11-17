// Detect if the app is installed
const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

// DOM elements for the custom prompt
const installPrompt = document.getElementById('installPrompt');
const installButton = document.createElement('button');
const closeButton = document.createElement('button');
const openInAppButton = document.createElement('button');

// Add styles and content for buttons
installButton.textContent = 'Install';
installButton.classList.add('styled-button');
installButton.style.backgroundColor = 'var(--accent-light)';
installButton.style.marginRight = '10px';

closeButton.textContent = 'Close';
closeButton.classList.add('styled-button');
closeButton.style.backgroundColor = 'var(--accent-light)';

openInAppButton.textContent = 'Open in App';
openInAppButton.classList.add('styled-button');
openInAppButton.style.backgroundColor = 'var(--accent-light)';
openInAppButton.style.marginRight = '10px';

// Append buttons dynamically based on the app state
if (!isAppInstalled) {
  installPrompt.appendChild(installButton);
} else {
  installPrompt.appendChild(openInAppButton);
}
installPrompt.appendChild(closeButton);

// Variable to hold the deferred install prompt event
let deferredInstallPrompt;

// Function to display the custom install prompt
function showInstallPrompt() {
  installPrompt.style.display = 'block'; // Show the custom install prompt
}

// Function to hide the custom install prompt
function hideInstallPrompt() {
  installPrompt.style.display = 'none'; // Hide the custom install prompt
}

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default mini-infobar from appearing
  event.preventDefault();

  // Save the deferred prompt event for later use
  deferredInstallPrompt = event;

  // Show the custom install prompt only if the app is not installed
  if (!isAppInstalled) {
    showInstallPrompt();
  }
});

// Handle the install button click
installButton.addEventListener('click', async () => {
  if (deferredInstallPrompt) {
    // Show the browser's install prompt
    deferredInstallPrompt.prompt();

    // Wait for the user's response
    const choiceResult = await deferredInstallPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the PWA install prompt');
    } else {
      console.log('User dismissed the PWA install prompt');
    }

    // Clear the deferred prompt variable
    deferredInstallPrompt = null;
  }

  // Hide the custom prompt after interaction
  hideInstallPrompt();
});

// Handle the open-in-app button click
openInAppButton.addEventListener('click', () => {
  // Redirect to the app if running in standalone mode
  if (isAppInstalled) {
    console.log('Opening the app...');
    window.location.href = '/'; // Update with the home route of your app
  }
});

// Handle the close button click
closeButton.addEventListener('click', hideInstallPrompt);

// Show the appropriate prompt on page load
if (isAppInstalled) {
  showInstallPrompt();
}
