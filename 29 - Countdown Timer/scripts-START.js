let timeLeft = 0;
const timeLeftLabel = document.querySelector(".display__time-left");
function updateTimeLeft() {
  timeLeft -= 1;
  updateTimeLeftLabel()
  if (timeLeft === 0) clearInterval(timerId);
}

function updateTimeLeftLabel() {
  const minute = Math.floor(timeLeft / 60);
  const second = timeLeft % 60;
  timeLeftLabel.textContent = `${minute}:${second.toString().padStart(2, "0")}`;
  document.title = `${minute}:${second.toString().padStart(2, "0")}`;
}

let timerId;
function setTimer(time) {
  timeLeft = time;
  updateTimeLeftLabel();
  if (timerId) clearInterval(timerId);
  timerId = setInterval(updateTimeLeft, 1000);
}

const endTimeLabel = document.querySelector(".display__end-time");
function updateEndTimeLabel(time) {
  const date = new Date();
  date.setSeconds(date.getSeconds() + Number(time));
  const hour = date.getHours > 12 ? date.getHours - 12 : date.getHours();
  const minute = date.getMinutes();
  endTimeLabel.textContent = `Be Back At ${hour}:${minute}`;
}

function handleTimerButtonClick(e) {
  setTimer(e.target.dataset.time);
  updateEndTimeLabel(e.target.dataset.time);
}

function handleMinuteSubmit(e) {
  e.preventDefault();
  setTimer(e.target.firstElementChild.value * 60);
  updateEndTimeLabel(e.target.firstElementChild.value * 60);
}

document.querySelectorAll(".timer__button").forEach(timerButton => timerButton.addEventListener("click", handleTimerButtonClick));
document.querySelector("#custom").addEventListener("submit", handleMinuteSubmit);
