// Declare a variable to store the install event
let deferredInstallPrompt;

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing
    event.preventDefault();
    // Store the event for later use
    deferredInstallPrompt = event;

    // Automatically show the install prompt
    showInstallPrompt();
});

// Function to show the PWA install prompt
function showInstallPrompt() {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt(); // Show the install prompt

        deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the PWA install prompt');
            } else {
                console.log('User dismissed the PWA install prompt');
            }
            deferredInstallPrompt = null; // Reset the prompt variable
        });
    }
}
