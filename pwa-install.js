// Declare variable to store the deferred install event
let deferredInstallPrompt;

// Get reference to the install prompt UI elements
const installPrompt = document.getElementById('installPrompt');
const installButton = document.getElementById('installButton');
const closeButton = document.getElementById('closeButton');

// Hide the install prompt UI initially
if (installPrompt) installPrompt.style.display = 'none';

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing
    event.preventDefault();
    // Store the event for triggering later
    deferredInstallPrompt = event;

    // Show the custom install prompt
    if (installPrompt) installPrompt.style.display = 'block';
});

// Handle the install button click
if (installButton) {
    installButton.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
            // Show the browser install prompt
            deferredInstallPrompt.prompt();

            // Wait for the user's response
            const choiceResult = await deferredInstallPrompt.userChoice;
            console.log('User choice:', choiceResult.outcome);

            // Hide the custom install prompt after action
            if (installPrompt) installPrompt.style.display = 'none';
            deferredInstallPrompt = null;
        }
    });
}

// Handle the close button click
if (closeButton) {
    closeButton.addEventListener('click', () => {
        if (installPrompt) installPrompt.style.display = 'none';
    });
}
