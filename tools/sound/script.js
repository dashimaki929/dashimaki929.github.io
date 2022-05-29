//getUserMedia()
navigator.getMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia );

//端末のビデオ、音声ストリーム取得
navigator.getMedia ({ audio:true }, function(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();
    var source = context.createMediaStreamSource(stream);
    var analyser = context.createAnalyser();
    var samplerate = context.sampleRate;

    source.connect(analyser);
    analyser.connect(context.destination);
    source.connect(context.destination);

    var canvas = document.querySelector('canvas');
    var canvasContext = canvas.getContext('2d');
    
    var timerid  = null;
    var interval = 50;


    //波形描写
    var drawWave = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var width  = canvas.width;
        var height = canvas.height;
    
        var paddingTop    = 20;
        var paddingBottom = 20;
        var paddingLeft   = 30;
        var paddingRight  = 30;
    
        var innerWidth  = width  - paddingLeft - paddingRight;
        var innerHeight = height - paddingTop  - paddingBottom;
        var innerBottom = height - paddingBottom;
    
        // spectrums に 音声データを配列で格納
        var spectrums = new Uint8Array(analyser.frequencyBinCount);  // Array size is half of fftSize
        analyser.getByteFrequencyData(spectrums);
//console.log(spectrums);


        // cutoff
        var cutoff = 0;
        for (var i = 0; i <= spectrums.length; i++) {
            if (spectrums[i] < cutoff) spectrums[i] = 0;
        }
//console.log(spectrums)


        // 周波数計算
        var maxIndex = 0;
        for (var i = 0; i <= spectrums.length; i++) {
            var val = spectrums[i];
            if (val > spectrums[maxIndex]) maxIndex = i;
        }
        var freq = maxIndex * samplerate / 2 / spectrums.length;
//console.log(freq, samplerate);

        
        // 周波数から音階表示
        var notes = ["ド", "ド♯", "レ", "レ♯", "ミ", "ファ", "ファ♯", "ソ", "ソ♯", "ラ", "ラ♯", "シ"];
        var idx = Math.floor(69 + 12 * Math.log(freq / 440, 2)) % 12;
console.log(notes[idx]);

    
        // canvas消去
        canvasContext.clearRect(0, 0, width, height);
    
        // spectrums配列からcanvasに波形を描写
        canvasContext.beginPath();
    
        for (var i = 0, len = spectrums.length; i < len; i++) {
            var x = Math.floor((i / len) * innerWidth) + paddingLeft;
            var y = Math.floor((1 - (spectrums[i] / 255)) * innerHeight) + paddingTop;
    
            if (i === 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);
            }
        }
    
        canvasContext.strokeStyle = 'rgba(255, 255, 255, 1.0)';
        canvasContext.lineWidth   = 2;
        canvasContext.lineCap     = 'round';
        canvasContext.lineJoin    = 'miter';
        canvasContext.stroke();
    };
    timerid = window.setInterval(drawWave, interval);

}, function(err) {
    console.log(err);
});