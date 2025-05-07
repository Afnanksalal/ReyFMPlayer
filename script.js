document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const audio = document.getElementById('audio');
  const playBtn = document.getElementById('play');
  const stopBtn = document.getElementById('stop');
  const streamSelect = document.getElementById('streamSelect');
  const volumeSlider = document.getElementById('volume');
  const volumeProgress = document.getElementById('volumeProgress');
  const volumeIcon = document.getElementById('volumeIcon');
  const errorPopup = document.getElementById('errorPopup');
  const closePopupBtn = document.getElementById('closePopup');
  const currentStation = document.getElementById('currentStation');
  const playingStatus = document.getElementById('playingStatus');
  const playingIndicator = document.getElementById('playingIndicator');
  const previousBtn = document.getElementById('previousBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  // ReyFM stations
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
  
  // Convert to array for easier navigation
  const stations = Object.entries(streams).map(([name, url]) => ({
    name,
    url
  }));
  
  // Populate station select
  stations.forEach(station => {
    const option = document.createElement('option');
    option.value = station.url;
    option.textContent = station.name;
    streamSelect.appendChild(option);
  });
  
  // Current state
  let isPlaying = false;
  
  // Update UI based on playing state
  function updatePlayingUI(playing) {
    isPlaying = playing;
    
    if (playing) {
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      playingStatus.textContent = 'Now playing';
      playingIndicator.style.opacity = '1';
    } else {
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      playingStatus.textContent = 'Not playing';
      playingIndicator.style.opacity = '0';
    }
  }
  
  // Update station info
  function updateStationInfo() {
    if (streamSelect.selectedIndex > 0) {
      const selectedStation = streamSelect.options[streamSelect.selectedIndex].text;
      currentStation.textContent = selectedStation;
    } else {
      currentStation.textContent = 'Select a station';
    }
  }
  
  // Play button click handler
  playBtn.addEventListener('click', function() {
    if (streamSelect.value === '') {
      showError();
      return;
    }
    
    if (isPlaying) {
      audio.pause();
      updatePlayingUI(false);
    } else {
      audio.src = streamSelect.value;
      audio.play()
        .then(() => {
          updatePlayingUI(true);
        })
        .catch(error => {
          console.error('Error playing audio:', error);
          showError('Could not play the selected station. Please try again.');
        });
    }
  });
  
  // Stop button click handler
  stopBtn.addEventListener('click', function() {
    audio.pause();
    audio.currentTime = 0;
    updatePlayingUI(false);
  });
  
  // Previous button click handler
  previousBtn.addEventListener('click', function() {
    if (streamSelect.selectedIndex > 1) {
      streamSelect.selectedIndex -= 1;
    } else {
      streamSelect.selectedIndex = streamSelect.options.length - 1;
    }
    
    updateStationInfo();
    
    if (isPlaying) {
      audio.src = streamSelect.value;
      audio.play()
        .catch(error => {
          console.error('Error playing audio:', error);
          updatePlayingUI(false);
        });
    }
  });
  
  // Next button click handler
  nextBtn.addEventListener('click', function() {
    if (streamSelect.selectedIndex < streamSelect.options.length - 1) {
      streamSelect.selectedIndex += 1;
    } else {
      streamSelect.selectedIndex = 1;
    }
    
    updateStationInfo();
    
    if (isPlaying) {
      audio.src = streamSelect.value;
      audio.play()
        .catch(error => {
          console.error('Error playing audio:', error);
          updatePlayingUI(false);
        });
    }
  });
  
  // Station selection change handler
  streamSelect.addEventListener('change', function() {
    updateStationInfo();
    
    if (isPlaying) {
      audio.src = this.value;
      audio.play()
        .catch(error => {
          console.error('Error playing audio:', error);
          updatePlayingUI(false);
        });
    }
  });
  
  // Volume control
  volumeSlider.addEventListener('input', function() {
    const volumeValue = parseFloat(this.value);
    audio.volume = volumeValue;
    volumeProgress.style.width = volumeValue * 100 + '%';
    
    // Update volume icon based on value
    if (volumeValue === 0) {
      volumeIcon.className = 'fas fa-volume-mute';
    } else if (volumeValue < 0.5) {
      volumeIcon.className = 'fas fa-volume-down';
    } else {
      volumeIcon.className = 'fas fa-volume-up';
    }
  });
  
  // Make sure volume progress updates when using browser's default controls
  volumeSlider.addEventListener('change', function() {
    volumeProgress.style.width = this.value * 100 + '%';
  });
  
  // Initialize volume display
  volumeProgress.style.width = volumeSlider.value * 100 + '%';
  
  // Show error popup
  function showError(message = 'Please choose a station before playing.') {
    const errorText = errorPopup.querySelector('p');
    errorText.textContent = message;
    errorPopup.classList.add('show');
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
      errorPopup.classList.remove('show');
    }, 4000);
  }
  
  // Close error popup
  closePopupBtn.addEventListener('click', function() {
    errorPopup.classList.remove('show');
  });
  
  // Handle audio errors
  audio.addEventListener('error', function() {
    updatePlayingUI(false);
    showError('Error loading audio stream. Please try another station.');
  });
  
  // Handle keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
      // Space bar to play/pause
      e.preventDefault();
      playBtn.click();
    } else if (e.code === 'ArrowUp') {
      // Up arrow to increase volume
      e.preventDefault();
      volumeSlider.value = Math.min(1, parseFloat(volumeSlider.value) + 0.1);
      volumeSlider.dispatchEvent(new Event('input'));
    } else if (e.code === 'ArrowDown') {
      // Down arrow to decrease volume
      e.preventDefault();
      volumeSlider.value = Math.max(0, parseFloat(volumeSlider.value) - 0.1);
      volumeSlider.dispatchEvent(new Event('input'));
    } else if (e.code === 'ArrowLeft') {
      // Left arrow for previous station
      e.preventDefault();
      previousBtn.click();
    } else if (e.code === 'ArrowRight') {
      // Right arrow for next station
      e.preventDefault();
      nextBtn.click();
    }
  });
});
