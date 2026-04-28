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
function playWebAudioNote(note = 60, duration = 500) {

  const frequency = 261.6; // C4
  
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
function playMIDINote(note = 60, duration = 500) {
  // Play actual sound through speakers
  playWebAudioNote(note, duration);

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

// Add event listener to the circle item
document.addEventListener('DOMContentLoaded', () => {
  const circleBtn = document.querySelector('[popovertarget="circle-popup"]');
  if (circleBtn) {
    circleBtn.addEventListener('click', () => {
      playMIDINote(60); // Play Middle C
    });
  }
});