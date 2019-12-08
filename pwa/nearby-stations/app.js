if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa/nearby-stations/sw.js')
        .then(function() {
        console.log('Service worker registered!');
    });
}