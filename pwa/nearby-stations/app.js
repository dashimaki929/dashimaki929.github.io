if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/pwa/nearby-stations/sw.js')
        .then(reg => {
        console.log('Service worker registered!', reg);
    });
}