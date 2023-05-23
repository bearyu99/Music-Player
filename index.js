// 오디오
const audio = document.querySelector("audio");

// 오디오 정보
const thumb = document.querySelector("#thumbnail");
const playingSongTitle = document.querySelector("#song-title");
const playingSongArtist = document.querySelector("#song-artist");

// 오디오 프로그레스 바
const progressWrap = document.querySelector("#progress");
const playingCurrentTime = progressWrap.querySelector("#progress-current");
const playingDurationTime = progressWrap.querySelector("#progress-duration");
const progressBarWrap = progressWrap.querySelector("#progress-bar-wrapper");
const progressBar = progressWrap.querySelector("#progress-bar");

// 오디오 제어
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const playBtn = document.querySelector("#play");
const loopBtn = document.querySelector("#loop");

// 대기열
const queue = document.querySelector("#queue");

const songs = [
  {
    content: "수사대2",
    name: "수사대2_오프닝_예고편용",
    title: "on and on (Remix ver.)",
    artist: "체링",
  },
  {
    content: "수사대2",
    name: "수사대2_오프닝",
    title: "on and on",
    artist: "체링",
  },
  {
    content: "수사대2",
    name: "수사대2_본부",
    title: "Get set!",
    artist: "체링",
  },
  {
    content: "수사대2",
    name: "수사대2_에피1",
    title: '발자국을 따라서 (homage to "Conan")',
    artist: "체링",
  },
  {
    content: "수사대2",
    name: "수사대2_에피2",
    title: "수상한 그림자",
    artist: "체링",
  },
  {
    content: "수사대2",
    name: "수사대2_지하2층",
    title: "심연 속으로",
    artist: "체링",
  },
];

let isPlaying = false;
let songIndex = 0;
let isLoop = false;

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  nowPlaying();
  audio.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  audio.pause();
}

function loopSong() {
  if (isLoop) {
    audio.loop = !audio.loop;
  } else {
    audio.loop = !audio.loop;
  }
  isLoop = !isLoop;
  loopBtn.classList.toggle("text-indigo-500");
}

// 노래, 정보 불러오기
function loadSong(song) {
  audio.src = `./assets/audio/${song.name}.wav`;
  playingSongTitle.innerHTML = song.title;
  playingSongArtist.innerHTML = song.artist;
  thumb.querySelectorAll("img").forEach((img) => {
    img.src = `./assets/img/${song.content}.png`;
  });
}

// 노래 대기열 그리기
function drawQueue() {
  songs.forEach((song, index) => {
    const songWrapper = document.createElement("li");
    songWrapper.className = "relative flex items-center my-2 pb-2 w-full h-16 rounded-2xl divide";
    songWrapper.dataset.index = index;

    songWrapper.className;
    const detailWrapper = document.createElement("div");
    detailWrapper.className = "flex flex-col w-full mx-4";
    songWrapper.appendChild(detailWrapper);

    const title = document.createElement("p");
    title.className = "text-md font-semibold";
    title.innerHTML = song.title;
    detailWrapper.appendChild(title);

    const artistWrapper = document.createElement("div");
    artistWrapper.className = "flex justify-between text-sm";
    detailWrapper.appendChild(artistWrapper);

    const artist = document.createElement("span");
    artist.innerHTML = song.artist;
    artistWrapper.appendChild(artist);

    const duration = document.createElement("span");
    let songUrl = `./assets/audio/${song.name}.wav`;
    getDuration(songUrl, duration);
    artistWrapper.appendChild(duration);

    queue.appendChild(songWrapper);
  });
}

// 노래 재생 시간 받아오기
function getDuration(src, destination) {
  let tempAudio = new Audio();
  tempAudio.addEventListener("loadedmetadata", () => {
    let duration = tempAudio.duration;
    let min = Math.floor(duration / 60);
    let sec = Math.floor(duration % 60);
    destination.innerHTML = `${min < 10 ? min.toString().padStart(2, "0") : min}:${
      sec < 10 ? sec.toString().padStart(2, "0") : sec
    }`;
  });
  tempAudio.src = src;
}

// 재생하고 있는 노래 표시
function nowPlaying() {
  const queueList = queue.querySelectorAll("li");
  queueList.forEach((elem, index) => {
    let title = elem.querySelector("div > p");
    if (songIndex === index) {
      title.classList.add("text-indigo-500");
    } else {
      title.classList.remove("text-indigo-500");
    }
  });
}

// 프로그래스바 조작
function setProgress(e, clicked) {
  if (isMouseDown || clicked) {
    audio.currentTime = (e.offsetX / progressBarWrap.clientWidth) * audio.duration;
  }
}

function updateProgress() {
  let currentMin = Math.floor(audio.currentTime / 60);
  let currentSec = Math.floor(audio.currentTime % 60);
  playingCurrentTime.innerHTML = `${
    currentMin < 10 ? currentMin.toString().padStart(2, "0") : currentMin
  }:${currentSec < 10 ? currentSec.toString().padStart(2, "0") : currentSec}`;

  progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
}

function updateDuration() {
  let durationMin = Math.floor(audio.duration / 60);
  let durationSec = Math.floor(audio.duration % 60);
  playingDurationTime.innerHTML = `${
    durationMin < 10 ? durationMin.toString().padStart(2, "0") : durationMin
  }:${durationSec < 10 ? durationSec.toString().padStart(2, "0") : durationSec}`;
}

// 이전 노래 재생
function playPrevSong() {
  if (songIndex <= 0) {
    songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
  } else {
    songIndex--;
    loadSong(songs[songIndex]);
    playSong();
  }
}

// 다음 노래 재생
function playNextSong() {
  if (songIndex >= songs.length - 1) {
    songIndex = 0;
    loadSong(songs[songIndex]);
    playSong();
  } else {
    songIndex++;
    loadSong(songs[songIndex]);
    playSong();
  }
}

// 노래 재생 이벤트 등록
play.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});
prevBtn.addEventListener("click", playPrevSong);
nextBtn.addEventListener("click", playNextSong);
audio.addEventListener("ended", playNextSong);
queue.addEventListener("click", (e) => {
  selectedSong = e.target.parentNode.parentNode;
  if (!selectedSong.querySelector("ul")) {
    songIndex = parseInt(selectedSong.dataset.index);
    loadSong(songs[songIndex]);
    playSong();
  }
});
loopBtn.addEventListener("click", loopSong);

// 프로그레스바 이벤트 등록
audio.addEventListener("durationchange", updateDuration);
audio.addEventListener("timeupdate", updateProgress);

// 프로그레스 바 조작
let isMouseDown = false;

progressBarWrap.addEventListener("mousedown", () => {
  isMouseDown = true;
});

progressBarWrap.addEventListener("mouseup", () => {
  isMouseDown = false;
});

progressBarWrap.addEventListener("mouseleave", () => {
  isMouseDown = false;
});

progressBarWrap.addEventListener("mousemove", setProgress);

progressBarWrap.addEventListener("click", (e) => {
  setProgress(e, true);
});

// 로드
drawQueue();
loadSong(songs[songIndex]);

const queueBtn = document.querySelector("#queue-list");

let isQueueOpen = false;
queueBtn.addEventListener("click", () => {
  if (isQueueOpen) {
    document.querySelector("body > div > div:last-child").classList.add("hidden");
    document.querySelector("body > div > div:first-child").classList.remove("lg:mr-8");
    document.querySelector("body > div > div:first-child").classList.remove("lg:w-1/2");
    document.querySelector("body > div").classList.replace("lg:w-[768px]", "lg:w-[384px]");
  } else {
    document.querySelector("body > div > div:last-child").classList.remove("hidden");
    document.querySelector("body > div > div:first-child").classList.add("lg:mr-8");
    document.querySelector("body > div > div:first-child").classList.add("lg:w-1/2");
    document.querySelector("body > div").classList.replace("lg:w-[384px]", "lg:w-[768px]");
  }
  isQueueOpen = !isQueueOpen;
  queueBtn.classList.toggle("text-indigo-500");
});
