const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error(err);
    });
}

function paintVideoToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    // 픽셀 데이터를 canvas에서 받아와서, 그걸 변형하는 함수에 전달해 변환하고 다시 canvas에 그려준다.
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redFilter(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.8;
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function redFilter(pixels) {
  // console.log(pixels.data);
  for (let i = 0 ; i < pixels.data.length ; i += 4) {
    // r g b a 4개씩
    pixels.data[i + 0] += 100; // r
    pixels.data[i + 1] += 0; // g
    pixels.data[i + 2] += 0; // b
    pixels.data[i + 3] += 0; // a
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0 ; i < pixels.data.length ; i += 4) {
    // r g b a 4개씩
    pixels.data[i - 150] = pixels.data[i + 0]; // r
    pixels.data[i + 150] = pixels.data[i + 1]; // g
    pixels.data[i - 250] = pixels.data[i + 2]; // b
    // pixels.data[i + 3] = 0; // a
  }
  return pixels;
}

function greenScreen(pixels) {
  // rgb값의 최대 최소를 담는 object 만들기
  const levels = {};
  document.querySelectorAll("input").forEach(input => {
    levels[input.name] = input.value;
  })

  // 모든 픽셀을 돌면서 범위안에 있는 픽셀의 a값을 0으로(완전 투명하게)
  for (let i = 0 ; i < pixels.data.length ; i += 4) {
    const r = pixels.data[i + 0];
    const g = pixels.data[i + 1];
    const b = pixels.data[i + 2];
    if (r >= levels.rmin && r <= levels.rmax && g >= levels.gmin && g <= levels.gmax && b >= levels.bmin && b <= levels.bmax) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();
//video.addEventListener("canplay", paintVideoToCanvas);