// Global variables
let player;
let loopInterval;

// DOM Elements
const videoUrlInput = document.getElementById('video-url');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const applyLoopBtn = document.getElementById('apply-loop');
const stopLoopBtn = document.getElementById('stop-loop');
const errorMessageDiv = document.getElementById('error-message');
const playerContainer = document.getElementById('player-container');

// 1. Load the YouTube IFrame Player API code asynchronously.
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady() {
    // This function is called by the API. We initialize the player inside event listeners.
}

/**
 * Parses a time string (MM:SS or seconds) and returns the time in seconds.
 * @param {string} timeString - The time string to parse.
 * @returns {number|null} - The time in seconds, or null if invalid.
 */
function parseTime(timeString) {
    if (!timeString) return null;
    timeString = timeString.trim();
    // If it's just a number, treat it as seconds.
    if (!isNaN(timeString) && timeString.indexOf(':') === -1) {
        return parseFloat(timeString);
    }
    // If it's in MM:SS format.
    const parts = timeString.split(':');
    if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10);
        const seconds = parseInt(parts[1], 10);
        if (!isNaN(minutes) && !isNaN(seconds)) {
            return minutes * 60 + seconds;
        }
    }
    return null; // Invalid format
}

/**
 * Extracts the YouTube Video ID from a URL.
 * @param {string} url - The YouTube URL or Video ID.
 * @returns {string|null} - The video ID, or null if invalid.
 */
function getVideoId(url) {
    if (!url) return null;
    // Check if it's just the ID
    if (url.length === 11 && !url.includes('.') && !url.includes('/')) {
        return url;
    }
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Displays an error message to the user.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    errorMessageDiv.textContent = message;
}

/**
 * Clears any currently displayed error message.
 */
function clearError() {
    errorMessageDiv.textContent = '';
}

/**
 * Handles errors from the YouTube player.
 * @param {object} event - The error event object from the API.
 */
function onPlayerError(event) {
    // Stop any running loops
    clearInterval(loopInterval);

    let errorMessage = 'An unknown error occurred with the video player.';
    const videoId = player.getVideoData().video_id;
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // See: https://developers.google.com/youtube/iframe_api_reference#onError
    switch (event.data) {
        case 2:
            errorMessage = 'Invalid video ID. Please check the URL or ID.';
            break;
        case 5:
            errorMessage = 'An HTML5 player error occurred.';
            break;
        case 100:
            errorMessage = 'Video not found. It may be private or have been removed.';
            break;
        case 101:
        case 150: // 150 is a variant of 101
            errorMessage = `The video owner has disabled playback on other websites. <a href="${videoUrl}" target="_blank">Watch on YouTube</a>`;
            break;
    }
    // Use innerHTML to allow the link to be clickable
    errorMessageDiv.innerHTML = errorMessage;
}

/**
 * Handles the core looping logic.
 */
function checkLoop() {
    const startTime = parseTime(startTimeInput.value);
    const endTime = parseTime(endTimeInput.value);

    if (player && typeof player.getCurrentTime === 'function' && player.getCurrentTime() >= endTime) {
        player.seekTo(startTime, true);
    }
}

/**
 * Initializes or updates the YouTube player.
 */
function applyLoop() {
    clearError();
    clearInterval(loopInterval);

    const videoId = getVideoId(videoUrlInput.value);
    const startTime = parseTime(startTimeInput.value);
    const endTime = parseTime(endTimeInput.value);

    // --- Input Validation ---
    if (!videoId) {
        showError('Invalid YouTube URL or Video ID.');
        return;
    }
    if (startTime === null || endTime === null) {
        showError('Invalid time format. Please use MM:SS or seconds.');
        return;
    }
    if (startTime >= endTime) {
        showError('Start time must be less than end time.');
        return;
    }

    // If player exists and is for the same video, just update the loop.
    if (player && player.getVideoData().video_id === videoId) {
        player.seekTo(startTime, true);
        player.playVideo();
    } else { // Otherwise, create a new player.
        if (player) {
            player.destroy();
        }
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'autoplay': 1,
                'start': startTime
            },
            events: {
                'onReady': (event) => {
                    // Add the 'allow' attribute to the iframe to grant necessary permissions
                    // and prevent console warnings.
                    const iframe = event.target.getIframe();
                    iframe.setAttribute('allow',
                        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                    );

                    clearError(); // Clear previous errors on new video success
                    event.target.playVideo();
                },
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.PLAYING) {
                        // Start checking the time for the loop
                        loopInterval = setInterval(checkLoop, 250);
                    } else {
                        // Stop checking if video is paused or ended
                        clearInterval(loopInterval);
                    }
                },
                'onError': onPlayerError
            }
        });
    }
}

function stopAndClear() {
    clearInterval(loopInterval);
    if (player) {
        player.destroy();
        player = null;
    }
    // Clear inputs
    videoUrlInput.value = '';
    startTimeInput.value = '';
    endTimeInput.value = '';
    clearError();
}

// Event Listeners
applyLoopBtn.addEventListener('click', applyLoop);
stopLoopBtn.addEventListener('click', stopAndClear);