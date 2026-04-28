let midiOutput = null;
// Create Web Audio Context for real sound fallback
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Request MIDI Access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);
} else {
  console.error("Web MIDI API not supported in this browser.");
}

function onMIDISuccess(midiAccess) {
  const outputs = midiAccess.outputs;
  midiOutput = outputs.values().next().value;
  
  if (!midiOutput) {
    console.warn("No MIDI output devices found. Web Audio will be used for sound.");
  } else {
    console.log(`MIDI Output connected: ${midiOutput.name}`);
  }
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

// Function to play real sound via Web Audio
function playWebAudioNote(frequency = 261.6, duration = 500) {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  // Set volume and fade out
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration / 1000);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration / 1000);
}

// Function to play MIDI and Web Audio
function playMIDINote(note = 60, frequency = 261.6, duration = 500) {
  // Play actual sound through speakers
  playWebAudioNote(frequency, duration);

  // Also send MIDI data if a device is connected
  if (midiOutput) {
    midiOutput.send([0x90, note, 0x7f]);
    setTimeout(() => {
      midiOutput.send([0x80, note, 0x40]);
    }, duration);
  } else {
    console.log(`(Simulated MIDI Note ${note} played - using Web Audio fallback)`);
  }
}

// Add event listeners to all items
document.addEventListener('DOMContentLoaded', () => {
  // Define our shapes with their corresponding MIDI notes and Frequencies (C, D, E, F, G)
  const shapes = [
    { target: 'circle-popup', note: 60, freq: 261.6 },    // C4
    { target: 'triangle-popup', note: 62, freq: 293.7 },  // D4
    { target: 'square-popup', note: 64, freq: 329.6 },    // E4
    { target: 'trapezoid-popup', note: 65, freq: 349.2 }, // F4
    { target: 'hexagon-popup', note: 67, freq: 392.0 }    // G4
  ];

  shapes.forEach(shape => {
    const btn = document.querySelector(`[popovertarget="${shape.target}"]`);
    if (btn) {
      btn.addEventListener('click', () => {
        playMIDINote(shape.note, shape.freq);
      });
    }
  });
});