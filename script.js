const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const playButton = document.getElementById('playButton');
let isPlaying = false;
let currentChordIndex = 0;
let tempo = 80; // 초기 템포
let beatDuration = 60 / tempo;
const noteDuration = beatDuration * 0.8;
const chords = ['Am', 'G', 'C', 'F', 'Dm', 'Am', 'E', 'Am', 'C', 'G', 'Am', 'Em'];
const chordFrequencies = {
    'Am': [220.00, 261.63, 329.63],
    'G': [196.00, 246.94, 293.66],
    'C': [261.63, 329.63, 392.00],
    'F': [174.61, 220.00, 261.63],
    'Dm': [146.83, 220.00, 293.66],
    'E': [164.81, 246.94, 329.63],
    'Em': [164.81, 196.00, 246.94]
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
            playNote(freq, startTime + index * 0.05, noteDuration);
        });
    }
}

function playSequence() {
    if (!isPlaying) return;
    const startTime = audioContext.currentTime;

    const currentChord = chords[currentChordIndex];
    playChord(currentChord, startTime);

    // 코드 진행에 따른 템포 변화
    if (currentChordIndex >= 4 && currentChordIndex < 8) { // Dm - Am - E - Am 구간
        tempo = 100; // 약간 빠르게
    } else if (currentChordIndex >= 8) { // C - G - Am - Em 구간
        tempo = 90; // 다시 약간 느리게
    } else { // Am - G - C - F 구간
        tempo = 80; // 초기 템포 유지
    }
    beatDuration = 60 / tempo;
    const nextBeatTime = startTime + beatDuration;

    currentChordIndex = (currentChordIndex + 1) % chords.length;
    setTimeout(playSequence, (nextBeatTime - audioContext.currentTime) * 1000);
}

playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playButton.textContent = isPlaying ? '연주 중지' : '연주 시작';
    currentChordIndex = 0; // 재생 시작 시 코드 인덱스 초기화
    if (isPlaying) {
        playSequence();
    }
});
