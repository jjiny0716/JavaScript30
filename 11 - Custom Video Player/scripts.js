// fullscreen, progressbar smooth
const videoPlayer = document.querySelector(".player__video");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress__filled");
const toggleBtn = document.querySelector(".toggle");
const sliders = document.querySelectorAll("input");
const skipBtns = document.querySelectorAll("[data-skip]");

function toggleVideo() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    toggleBtn.textContent = "❚ ❚";
  } else {
    videoPlayer.pause();
    toggleBtn.textContent = "►";
  }
}

function handleSliderChange(e) {
  videoPlayer[this.name] = this.value;
}

function skip(e) {
  videoPlayer.currentTime += parseFloat(this.dataset.skip);
}

function changeProgressBar() {
  // console.log(videoPlayer.currentTime);
  const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
  progressBar.style.flexBasis = `${progress}%`;
}

function changeCurrentTime(e) {
  const percent = (e.offsetX / progress.clientWidth) * 100;
  videoPlayer.currentTime = (videoPlayer.duration * percent) / 100;
  // changeProgressBar();
}

videoPlayer.addEventListener("timeupdate", changeProgressBar);
videoPlayer.addEventListener("click", toggleVideo);
toggleBtn.addEventListener("click", toggleVideo);
sliders.forEach((slider) => slider.addEventListener("change", handleSliderChange));
sliders.forEach((slider) => slider.addEventListener("mousemove", handleSliderChange));
skipBtns.forEach((skipBtn) => skipBtn.addEventListener("click", skip));

let isMouseDown = false;
progress.addEventListener("click", changeCurrentTime);
progress.addEventListener("mousedown", () => (isMouseDown = true));
progress.addEventListener("mouseup", () => (isMouseDown = false));
progress.addEventListener("mousemove", (e) => isMouseDown && changeCurrentTime(e));
