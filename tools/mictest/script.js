navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(async stream => {
        await setDeviceList();

    })
    .catch(err => {
        console.log(err.name + ": " + err.message);
    });

async function setDeviceList() {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            console.log(`${device.kind}: ${device.label}, id = ${device.deviceId}`);
        });
    });
}
