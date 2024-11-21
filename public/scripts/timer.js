console.log("Timer script loaded");

function startTimer(startTime, duration, timerElementId) {
  const timerElement = document.getElementById(timerElementId);

  function updateTimer() {
    const timeElapsed = Date.now() - startTime;
    const timeRemaining = Math.max(0, Math.floor((duration - timeElapsed) / 1000));
    timerElement.textContent = timeRemaining;

    if (timeRemaining > 0) {
      requestAnimationFrame(updateTimer);
    } else {
      timerElement.textContent = "0";
    }
  }

  updateTimer();
}
