const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const playButton = document.getElementById('playButton');
let isPlaying = false;
const tempo = 120; // BPM (분당 박자 수)
const beatDuration = 60 / tempo;
const noteDuration = beatDuration * 0.8; // 음표 길이 (80% 정도)
const chords = ['Am', 'G', 'C', 'F'];
const chordFrequencies = {
    'Am': [220.00, 261.63, 329.63], // A3, C4, E4
    'G': [196.00, 246.94, 293.66],  // G3, B3, D4
    'C': [261.63, 329.63, 392.00],  // C4, E4, G4
    'F': [174.61, 220.00, 261.63]   // F3, A3, C4
};

function playNote(frequency, startTime, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine'; // 기본적인 사인파 음색
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(1, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playChord(chordName, startTime) {
    const frequencies = chordFrequencies[chordName];
    if (frequencies) {
        frequencies.forEach((freq, index) => {
            playNote(freq, startTime + index * 0.05, noteDuration); // 약간의 시차를 둠
        });
    }
}

function playSequence() {
    if (!isPlaying) return;
    const startTime = audioContext.currentTime;
    chords.forEach((chord, index) => {
        playChord(chord, startTime + index * beatDuration);
    });
    // 다음 코드 진행 반복
    setTimeout(playSequence, chords.length * beatDuration * 1000);
}

playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playButton.textContent = isPlaying ? '연주 중지' : '연주 시작';
    if (isPlaying) {
        playSequence();
    }
});
