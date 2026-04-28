let midiOutput = null;

// Request MIDI Access
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);
} else {
  console.error("Web MIDI API not supported in this browser.");
}

function onMIDISuccess(midiAccess) {
  const outputs = midiAccess.outputs;
  // Get the first available output device
  midiOutput = outputs.values().next().value;
  
  if (!midiOutput) {
    console.warn("No MIDI output devices found. You may need a virtual MIDI synth to hear sound.");
  } else {
    console.log(`MIDI Output connected: ${midiOutput.name}`);
  }
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

// Function to play a note
function playMIDINote(note = 60, duration = 500) {
  if (midiOutput) {
    // Note On: [0x90 (Note On, Channel 1), note number, velocity (127)]
    midiOutput.send([0x90, note, 0x7f]);
    
    // Note Off after duration
    setTimeout(() => {
      midiOutput.send([0x80, note, 0x40]);
    }, duration);
  } else {
    console.log(`(Simulated MIDI Note ${note} played - no output device connected)`);
  }
}

// Add event listener to the circle item
document.addEventListener('DOMContentLoaded', () => {
  const circleBtn = document.querySelector('[popovertarget="circle-popup"]');
  if (circleBtn) {
    circleBtn.addEventListener('click', () => {
      // Play a note (Middle C = 60)
      playMIDINote(60);
    });
  }
});