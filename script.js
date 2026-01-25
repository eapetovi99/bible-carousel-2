const DATA_URL =
  "https://eapetovi99.github.io/bible-carousel-2/matthieu.json";

let verses = [];
let currentIndex = 0;
let playing = true;
let interval;

// Elements
const verseText = document.getElementById("verseText");
const reference = document.getElementById("reference");
const progress = document.getElementById("progress");
const grid = document.getElementById("grid");

// Fetch Bible JSON
fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    const chapters = data.chapters;

    for (const ch in chapters) {
      for (const v in chapters[ch]) {
        verses.push({
          ref: `Matthieu ${ch}:${v}`,
          text: chapters[ch][v],
          chapter: ch
        });
      }
    }

    showVerse();
    buildGrid(chapters);
    startAuto();
  })
  .catch(err => console.error("JSON error:", err));

function showVerse() {
  const v = verses[currentIndex];
  verseText.textContent = v.text;
  reference.textContent = v.ref;

  progress.style.width =
    ((currentIndex + 1) / verses.length) * 100 + "%";
}

function next() {
  currentIndex = (currentIndex + 1) % verses.length;
  showVerse();
}

function prev() {
  currentIndex =
    (currentIndex - 1 + verses.length) % verses.length;
  showVerse();
}

function startAuto() {
  interval = setInterval(() => {
    if (playing) next();
  }, 5000);
}

document.getElementById("next").onclick = next;
document.getElementById("prev").onclick = prev;

document.getElementById("pause").onclick = () => {
  playing = !playing;
};

document.getElementById("gridBtn").onclick = () => {
  grid.classList.toggle("hidden");
};

function buildGrid(chapters) {
  grid.innerHTML = "";
  for (const ch in chapters) {
    const btn = document.createElement("button");
    btn.textContent = "Chapitre " + ch;
    btn.onclick = () => {
      currentIndex = verses.findIndex(v => v.chapter === ch);
      showVerse();
      grid.classList.add("hidden");
    };
    grid.appendChild(btn);
  }
}
