<script>
const DATA_URL = "https://eapetovi99.github.io/bible-carousel-2/matthieu.json";

let verses = [];
let index = 0;
let playing = true;
let interval;

const verseText = document.getElementById("verseText");
const reference = document.getElementById("reference");
const progress = document.getElementById("progress");
const grid = document.getElementById("grid");

fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    const chapters = data.chapters;

    for (const chapter in chapters) {
      for (const verse in chapters[chapter]) {
        verses.push({
          ref: `Matthieu ${chapter}:${verse}`,
          text: chapters[chapter][verse]
        });
      }
    }

    console.log("Verses loaded:", verses.length);

    showVerse();
    buildGrid(chapters);
    autoPlay();
  })
  .catch(err => console.error("Fetch error:", err));

function showVerse() {
  const v = verses[index];
  verseText.textContent = v.text;
  reference.textContent = v.ref;
  progress.style.width = ((index + 1) / verses.length) * 100 + "%";
}

function nextVerse() {
  index = (index + 1) % verses.length;
  showVerse();
}

function prevVerse() {
  index = (index - 1 + verses.length) % verses.length;
  showVerse();
}

function autoPlay() {
  interval = setInterval(() => {
    if (playing) nextVerse();
  }, 5000);
}

// Buttons
document.getElementById("next").onclick = nextVerse;
document.getElementById("prev").onclick = prevVerse;

document.getElementById("pause").onclick = () => {
  playing = !playing;
  document.getElementById("pause").textContent = playing ? "⏸" : "▶";
};

document.getElementById("gridBtn").onclick = () => {
  grid.classList.toggle("hidden");
};

// Build chapter grid
function buildGrid(chapters) {
  grid.innerHTML = "";

  for (const chapter in chapters) {
    const btn = document.createElement("button");
    btn.textContent = `Ch ${chapter}`;

    btn.onclick = () => {
      index = verses.findIndex(v =>
        v.ref.startsWith(`Matthieu ${chapter}:`)
      );
      showVerse();
      grid.classList.add("hidden");
    };

    grid.appendChild(btn);
  }
}
</script>
