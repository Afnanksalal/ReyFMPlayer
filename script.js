const streams = {
  "Chill": "https://listen.reyfm.de/reyfm-chill/",
  "Original": "https://listen.reyfm.de/reyfm-original/",
  "Summer": "https://listen.reyfm.de/reyfm-summer/",
  "Charts": "https://listen.reyfm.de/reyfm-charts/",
  "Dance": "https://listen.reyfm.de/reyfm-dance/",
  "Gaming": "https://listen.reyfm.de/reyfm-gaming/",
  "Hip-Hop": "https://listen.reyfm.de/reyfm-hip-hop/",
  "Hip-Hop Gold": "https://listen.reyfm.de/reyfm-hip-hop_gold/",
  "Hits": "https://listen.reyfm.de/reyfm-hits/",
  "Lo-Fi": "https://listen.reyfm.de/reyfm-lofi/"
};

const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const volumeControl = document.getElementById('volume');
const streamSelect = document.getElementById('streamSelect');
const errorPopup = document.getElementById('errorPopup');
const closePopupButton = document.getElementById('closePopup');

// Populate the stream select dropdown
for (const [name, url] of Object.entries(streams)) {
  const option = document.createElement('option');
  option.value = url;
  option.textContent = name;
  streamSelect.appendChild(option);
}

// Play the audio (with corrected logic)
playButton.addEventListener('click', () => {
  if (!streamSelect.value) {
    errorPopup.style.display = 'flex';
    return;
  }
  audio.src = streamSelect.value;
  audio.play();
  errorPopup.style.display = 'none';
});

// Stop the audio
stopButton.addEventListener('click', () => {
  audio.pause();
  audio.currentTime = 0;
});

// Change stream when a different option is selected
streamSelect.addEventListener('change', () => {
  audio.src = streamSelect.value;
  audio.play();
});

// Set volume
volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

// Close the error popup
closePopupButton.addEventListener('click', () => {
  errorPopup.style.display = 'none';
});
