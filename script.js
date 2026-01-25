let verses = [];
let filteredVerses = [];
let currentIndex = 0;
let interval = null;

fetch("matthieu.json")
  .then(res => res.json())
  .then(data => init(data));

function init(data) {
  buildVerses(data);
  buildChapterSelector(data);
  render();
  verseOfTheDay();
}

function buildVerses(data) {
  Object.entries(data.chapters).forEach(([c, chapter]) => {
    Object.entries(chapter).forEach(([v, text]) => {
      verses.push({
        chapter: c,
        verse: v,
        reference: `Matthieu ${c}:${v}`,
        text
      });
    });
  });
  filteredVerses = verses;
}

function render() {
  const v = filteredVerses[currentIndex];
  const verseDiv = document.getElementById("verse");
  verseDiv.classList.remove("fade");
  void verseDiv.offsetWidth;
  verseDiv.classList.add("fade");

  document.getElementById("reference").textContent = v.reference;
  verseDiv.textContent = v.text;
}

function buildChapterSelector(data) {
  const cs = document.getElementById("chapterSelect");
  Object.keys(data.chapters).forEach(c => {
    const opt = new Option(`Chapitre ${c}`, c);
    cs.add(opt);
  });

  cs.onchange = () => {
    filteredVerses = verses.filter(v => v.chapter === cs.value);
    currentIndex = 0;
    buildVerseSelector();
    render();
  };

  buildVerseSelector();
}

function buildVerseSelector() {
  const vs = document.getElementById("verseSelect");
  vs.innerHTML = "";
  filteredVerses.forEach((v, i) => {
    vs.add(new Option(v.verse, i));
  });

  vs.onchange = () => {
    currentIndex = vs.value;
    render();
  };
}

// Controls
document.getElementById("next").onclick = () => {
  currentIndex = (currentIndex + 1) % filteredVerses.length;
  render();
};

document.getElementById("prev").onclick = () => {
  currentIndex =
    (currentIndex - 1 + filteredVerses.length) %
    filteredVerses.length;
  render();
};

document.getElementById("auto").onclick = () => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  } else {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % filteredVerses.length;
      render();
    }, 5000);
  }
};

// Random Verse
document.getElementById("randomVerse").onclick = () => {
  currentIndex = Math.floor(Math.random() * verses.length);
  filteredVerses = verses;
  render();
};

// Verse of the day
function verseOfTheDay() {
  const day = new Date().getDate();
  currentIndex = day % verses.length;
}

// Search
document.getElementById("search").oninput = e => {
  const q = e.target.value.toLowerCase();
  const results = document.getElementById("searchResults");
  results.innerHTML = "";

  if (!q) return;

  verses
    .filter(v => v.text.toLowerCase().includes(q))
    .slice(0, 20)
    .forEach(v => {
      const li = document.createElement("li");
      li.textContent = `${v.reference} — ${v.text.slice(0, 50)}…`;
      li.onclick = () => {
        filteredVerses = verses;
        currentIndex = verses.indexOf(v);
        render();
        results.innerHTML = "";
      };
      results.appendChild(li);
    });
};

// Theme toggle
document.getElementById("toggleTheme").onclick = () => {
  const app = document.getElementById("bible-app");
  app.classList.toggle("dark");
  app.classList.toggle("light");
};
