let nearbyStations = {};
let stations = {};

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
    switch (xhr.readyState) {
        case 4: {
            if(xhr.status == 200 || xhr.status == 304) {
                stations = JSON.parse(xhr.responseText);
            } else {
                console.log('Failed. HttpStatus: ' + xhr.statusText);
            }
            break;
        }
    }
};
 

let userPosition = {
    latitude: null,
    longitude: null
}
function updateUserPosition() {
    if (!navigator.geolocation){
        window.alert("Geolocation is not supported.");
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            userPosition.latitude = position.coords.latitude;
            userPosition.longitude = position.coords.longitude;
            deriveNearbyStations();

            console.log(userPosition.latitude, userPosition.longitude);
            console.log(nearbyStations);
document.getElementById("outtest").value = JSON.stringify(nearbyStations, null, "\t");
            displayNearbyStations();
        },
        error => {
            window.alert("Unable to retrieve your location.");
        }
    );
}
function deriveNearbyStations() {
    const stationsArray = Object.values(stations);
    stationsArray.sort((a, b) => {
        const aDistance = getDistance(userPosition.latitude, userPosition.longitude, a.lat, a.lon);
        const bDistance = getDistance(userPosition.latitude, userPosition.longitude, b.lat, b.lon);
        if (aDistance < bDistance) return -1;
        if (aDistance > bDistance) return 1;
        return 0;
    });

    for (let i = 0; i < 10; i++) {
        nearbyStations[i] = stationsArray[i];
    }
}
function getDistance(lat1, lon1, lat2, lon2) {
    lat1 *= Math.PI / 180;
    lon1 *= Math.PI / 180;
    lat2 *= Math.PI / 180;
    lon2 *= Math.PI / 180;
    return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1) + Math.sin(lat1) * Math.sin(lat2));
}


function displayNearbyStations() {
    const disp = document.getElementById("resultDisp");
    disp.innerHTML = null;

    for (let key of Object.keys(nearbyStations)) {
        const station = nearbyStations[key];
        const distance = getDistance(userPosition.latitude, userPosition.longitude, station.lat, station.lon);
        disp.innerHTML += `
<div class="card grey lighten-5">
    <div class="card-content">
        <span class="card-title">#${Number(key) + 1} ${station.name}</span>
        <ul>
            <li>距離: ${distance}km</li>
            <li>...</li>
        </ul>
    </div>
    <div class="card-action">
        <a href="#">This is a link</a>
    </div>
</div>`;
    }
}


function doRequest(method, url) {
    xhr.open(method, url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.abort();
}

(function init() {
    doRequest("GET", "https://dashimaki929.github.io/json/stations.json");
})();