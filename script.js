const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const playButton = document.getElementById('playButton');
let isPlaying = false;
let currentChordIndex = 0;
const tempo = 80; // BPM
const beatDuration = 60 / tempo;
const chords = [
    'Am', 'G', 'C', 'F', 'Dm', 'Am', 'E', 'Am',
    'C', 'G', 'Am', 'Em', 'F', 'C', 'G', 'Am',
    'Am7', 'GB', 'Cmaj7', 'Fmaj7', 'Dm7', 'AmC', 'Bdim', 'E7',
    'Am', 'G', 'C', 'F', 'Dm', 'E', 'Am', 'Am'
];
const chordFrequencies = {
    'Am': [220.00, 261.63, 329.63],    // A3, C4, E4
    'G': [196.00, 246.94, 293.66],     // G3, B3, D4
    'C': [261.63, 329.63, 392.00],     // C4, E4, G4
    'F': [174.61, 220.00, 261.63],     // F3, A3, C4
    'Dm': [146.83, 220.00, 293.66],    // D3, A3, D4
    'E': [164.81, 246.94, 329.63],     // E3, B3, E4
    'Em': [164.81, 196.00, 246.94],    // E3, G3, B3
    'Am7': [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
    'GB': [246.94, 293.66, 349.23],    // B3, D4, F#4 (G/B 보이싱)
    'Cmaj7': [261.63, 329.63, 392.00, 415.30], // C4, E4, G4, Bb4 (Cmaj7 보이싱)
    'Fmaj7': [174.61, 220.00, 261.63, 349.23], // F3, A3, C4, F4 (Fmaj7 보이싱)
    'Dm7': [146.83, 220.00, 293.66, 349.23], // D3, A3, D4, F4
    'AmC': [261.63, 220.00, 329.63],    // C4, A3, E4 (Am/C 보이싱)
    'Bdim': [233.08, 277.18, 349.23],   // Bb3, C#4, F4
    'E7': [164.81, 246.94, 329.63, 308.68]     // E3, B3, E4, G#4
};

function playNote(frequency, startTime, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
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
            playNote(freq, startTime + index * 0.05, beatDuration * 0.9); // 약간의 시차와 길이 조절
        });
    }
}

function playSequence() {
    if (!isPlaying) return;
    const startTime = audioContext.currentTime;
    const currentChord = chords[currentChordIndex];
    playChord(currentChord, startTime);

    currentChordIndex = (currentChordIndex + 1) % chords.length; // 순환하도록 변경
    const nextBeatTime = startTime + beatDuration;
    setTimeout(playSequence, (nextBeatTime - audioContext.currentTime) * 1000);
}

playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playButton.textContent = isPlaying ? '연주 중지' : '연주 시작';
    currentChordIndex = 0; // 재생 시작 시 인덱스 초기화
    if (isPlaying) {
        playSequence();
    }
});
