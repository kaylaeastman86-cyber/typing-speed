// Typing Speed Master - app.js

const CONTENT = {
  interview: [
    { title: "Home Row Basics", focus: "Home row", text: "asdf jkl; a s d f j k l ; asdf jkl; fads jalk lads jals" },
    { title: "Top Row & Punctuation", focus: "Top row", text: "qwer uiop q w e r u i o p? Professional emails require focus." },
    { title: "Bottom Row & Numbers", focus: "Bottom row", text: "zxcv m,./ 123 456 789. Contact me at 555-0199 for more info." },
    { title: "Code syntax", focus: "Tech Interview", text: "function solve(arr) { return arr.map(x => x * 2); }" },
    { title: "Interview Phrases", focus: "Responses", text: "Tell me about yourself. My greatest strength is my ability to learn quickly and adapt." },
    { title: "Mixed Practice", focus: "Emails", text: "Dear Hiring Manager, I am writing to express my interest in the Software Engineer position." },
    { title: "Speed Test", focus: "The Big One", text: "I am confident that my skills in project management and team collaboration make me a strong candidate for this role. I look forward to discussing how I can contribute to your team's success." }
  ],
  code: [
    { title: "Home Row Basics", focus: "Home row", text: "asdf jkl; a s d f j k l ; asdf jkl; fads jalk lads jals" },
    { title: "Top Row & Punctuation", focus: "Top row", text: "qwer uiop {} [] () <> ! @ # $ % ^ & * + = _ - | \\" },
    { title: "Bottom Row & Numbers", focus: "Bottom row", text: "zxcv m,./ 0123456789. const x = 10; let y = 20; var z = x + y;" },
    { title: "Code Syntax", focus: "Syntax focus", text: "const app = express(); app.get('/', (req, res) => { res.send('Hello World'); });" },
    { title: "Logic Blocks", focus: "Deep code", text: "if (user.isAdmin) { return db.fetch().then(data => process(data)); } else { throw new Error('Unauthorized'); }" },
    { title: "Mixed Practice", focus: "Full script", text: "import React from 'react'; export const Button = ({ label, onClick }) => <button onClick={onClick}>{label}</button>;" },
    { title: "Speed Test", focus: "Real Logic", text: "async function fetchData(url) { try { const response = await fetch(url); const json = await response.json(); return json.filter(item => item.active); } catch (e) { console.error(e); } }" }
  ],
  student: [
    { title: "Home Row Basics", focus: "Home row", text: "asdf jkl; a s d f j k l ; asdf jkl; fads jalk lads jals" },
    { title: "Top Row & Punctuation", focus: "Top row", text: "qwer uiop q w e r u i o p. Students must cite all primary sources correctly." },
    { title: "Bottom Row & Numbers", focus: "Bottom row", text: "zxcv m,./ 101, 202, 303. The assignment is due on October 15th, 2026." },
    { title: "Code syntax", focus: "Markdown/Docs", text: "# Introduction to Biology\n## Section 1: Cell Structure\n- Nucleus\n- Mitochondria" },
    { title: "Academic Phrases", focus: "Essay writing", text: "Furthermore, the evidence suggests that the hypothesis was correct under these specific conditions." },
    { title: "Mixed Practice", focus: "Study notes", text: "In conclusion, the study of historical events provides crucial context for understanding modern geopolitical conflicts." },
    { title: "Speed Test", focus: "Thesis block", text: "This paper argues that the rapid advancement of artificial intelligence will fundamentally reshape the global workforce, necessitating a shift in educational priorities and lifelong learning strategies for the next generation of professionals." }
  ],
  casual: [
    { title: "Home Row Basics", focus: "Home row", text: "asdf jkl; a s d f j k l ; asdf jkl; fads jalk lads jals" },
    { title: "Top Row & Punctuation", focus: "Top row", text: "qwer uiop q w e r u i o p! Hello, how are you doing today? I hope you're having a great time!" },
    { title: "Bottom Row & Numbers", focus: "Bottom row", text: "zxcv m,./ 1 2 3 4 5. My favorite pizza costs $12.50 at the shop on 5th Avenue." },
    { title: "Code syntax", focus: "Emojis/Symbols", text: "Check this out: :) ;) :( <3 & @ #. Have a nice day! (Wait for it...)" },
    { title: "Fun Quotes", focus: "Wisdom", text: "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill" },
    { title: "Fun Facts", focus: "Trivia", text: "Did you know that a group of flamingos is called a flamboyance? That's quite a fancy name for birds!" },
    { title: "Speed Test", focus: "The Quote", text: "The quick brown fox jumps over the lazy dog. This sentence contains every letter in the English alphabet. It is a classic typing exercise used by people all around the world to practice their speed and accuracy." }
  ]
};

let state = {
  currentMode: "casual",
  currentLessonIndex: 0,
  lessons: [],
  progress: {
    lessonProgress: {},
    lastMode: null,
    lastLessonIndex: 0
  },
  typing: {
    startTime: null,
    currentIndex: 0,
    errors: 0,
    totalChars: 0,
    isFinished: false
  }
};

let screens, inputField, textDisplay;

function $(id) {
  return document.getElementById(id);
}

function init() {
  // Cache DOM (and fail loudly if missing)
  screens = {
    landing: $("screen-landing"),
    lessons: $("screen-lessons"),
    typing: $("screen-typing"),
    results: $("screen-results"),
    certificate: $("screen-certificate")
  };

  inputField = $("typing-input");
  textDisplay = $("text-display");

  if (!screens.landing || !inputField || !textDisplay) {
    console.error("Missing required HTML elements. Check index.html IDs.");
    return;
  }

  loadProgress();
  setupEventListeners();
  checkResume();
  showScreen("landing");
}

function loadProgress() {
  const saved = localStorage.getItem("typing_master_progress");
  if (saved) {
    try {
      state.progress = JSON.parse(saved);
      if (!state.progress.lessonProgress) state.progress.lessonProgress = {};
    } catch {
      state.progress = { lessonProgress: {}, lastMode: null, lastLessonIndex: 0 };
    }
  }
}

function saveProgress() {
  state.progress.lastMode = state.currentMode;
  state.progress.lastLessonIndex = state.currentLessonIndex;
  localStorage.setItem("typing_master_progress", JSON.stringify(state.progress));
}

function setupEventListeners() {
  document.querySelectorAll(".mode-card").forEach((card) => {
    card.addEventListener("click", () => selectMode(card.dataset.mode));
  });

  $("back-to-modes")?.addEventListener("click", () => showScreen("landing"));
  $("back-to-lessons")?.addEventListener("click", () => showScreen("lessons"));

  inputField.addEventListener("input", handleTyping);

  $("retry-lesson")?.addEventListener("click", () => startLesson(state.currentLessonIndex));
  $("next-lesson")?.addEventListener("click", () => {
    if (state.currentLessonIndex < 6) startLesson(state.currentLessonIndex + 1);
    else showCertificate();
  });

  $("close-cert")?.addEventListener("click", () => showScreen("lessons"));
  $("download-cert")?.addEventListener("click", () => alert("Certificate download would start here in a real app!"));
}

function showScreen(screenId) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[screenId].classList.add("active");
  if (screenId === "lessons") renderLessons();
}

function selectMode(mode) {
  state.currentMode = mode;
  state.lessons = CONTENT[mode] || [];
  $("current-mode-display").textContent = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
  showScreen("lessons");
}

function checkResume() {
  const badge = $("resume-badge");
  if (!badge) return;

  if (state.progress.lastMode && state.progress.lastLessonIndex !== undefined) {
    badge.style.display = "inline-flex";
    const modeName = state.progress.lastMode.charAt(0).toUpperCase() + state.progress.lastMode.slice(1);
    $("resume-text").textContent = `Resume: Lesson ${state.progress.lastLessonIndex + 1} (${modeName})`;
    $("btn-resume").onclick = () => {
      selectMode(state.progress.lastMode);
      startLesson(state.progress.lastLessonIndex);
    };
  } else {
    badge.style.display = "none";
  }
}

function renderLessons() {
  const list = $("lessons-list");
  list.innerHTML = "";

  let completedCount = 0;
  for (let i = 0; i < 7; i++) {
    if (state.progress.lessonProgress[state.currentMode]?.[i]?.completed) completedCount++;
  }

  const totalPercent = (completedCount / 7) * 100;
  $("total-progress-bar").style.width = `${totalPercent}%`;
  $("progress-text").textContent = `${completedCount}/7 Lessons Completed`;

  state.lessons.forEach((lesson, index) => {
    const item = document.createElement("div");
    const isLocked = index > 0 && !state.progress.lessonProgress[state.currentMode]?.[index - 1]?.completed;
    const isCompleted = state.progress.lessonProgress[state.currentMode]?.[index]?.completed;

    item.className = `lesson-item ${isLocked ? "locked" : ""}`;
    item.innerHTML = `
      <div class="lesson-info">
        <h4>Lesson ${index + 1}: ${lesson.title}</h4>
        <p>${lesson.focus}</p>
        ${
          isCompleted
            ? `<p class="best-stats">Best: ${state.progress.lessonProgress[state.currentMode][index].bestWPM} WPM | ${state.progress.lessonProgress[state.currentMode][index].bestAccuracy}% ACC</p>`
            : ""
        }
      </div>
      <div class="lesson-status">${isLocked ? "🔒" : isCompleted ? "✅" : "▶️"}</div>
    `;

    if (!isLocked) item.addEventListener("click", () => startLesson(index));
    list.appendChild(item);
  });
}

function startLesson(index) {
  state.currentLessonIndex = index;
  saveProgress();

  const lesson = state.lessons[index];
  state.typing = {
    startTime: null,
    currentIndex: 0,
    errors: 0,
    totalChars: lesson.text.length,
    isFinished: false
  };

  $("typing-lesson-title").textContent = `Lesson ${index + 1}: ${lesson.title}`;
  $("lesson-focus").textContent = `Focus: ${lesson.focus}`;
  $("live-wpm").textContent = "0 WPM";
  $("live-accuracy").textContent = "100% ACC";
  $("lesson-progress-bar").style.width = "0%";

  renderText(lesson.text);
  inputField.value = "";
  showScreen("typing");
  setTimeout(() => inputField.focus(), 50);
}

function renderText(text) {
  textDisplay.innerHTML = "";
  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.className = "char";
    if (i === 0) span.classList.add("current");
    textDisplay.appendChild(span);
  });
}

function handleTyping(e) {
  if (state.typing.isFinished) return;

  if (!state.typing.startTime) state.typing.startTime = new Date();

  const value = e.target.value;
  const targetText = state.lessons[state.currentLessonIndex].text;
  const charElements = textDisplay.querySelectorAll(".char");

  charElements.forEach((el) => el.classList.remove("current", "correct", "incorrect"));

  let errors = 0;
  for (let i = 0; i < value.length; i++) {
    if (i >= targetText.length) break;
    if (value[i] === targetText[i]) charElements[i].classList.add("correct");
    else {
      charElements[i].classList.add("incorrect");
      errors++;
    }
  }

  state.typing.currentIndex = value.length;
  state.typing.errors = errors;

  if (state.typing.currentIndex < targetText.length) {
    charElements[state.typing.currentIndex].classList.add("current");
  }

  updateLiveStats();

  if (value.length >= targetText.length) finishLesson();
}

function updateLiveStats() {
  const elapsedMinutes = (new Date() - state.typing.startTime) / 60000;
  const wpm = elapsedMinutes > 0 ? Math.round((state.typing.currentIndex / 5) / elapsedMinutes) : 0;
  const accuracy =
    state.typing.currentIndex > 0
      ? Math.round(((state.typing.currentIndex - state.typing.errors) / state.typing.currentIndex) * 100)
      : 100;

  $("live-wpm").textContent = `${wpm} WPM`;
  $("live-accuracy").textContent = `${accuracy}% ACC`;

  const progressPercent = (state.typing.currentIndex / state.typing.totalChars) * 100;
  $("lesson-progress-bar").style.width = `${progressPercent}%`;
}

function finishLesson() {
  state.typing.isFinished = true;
  inputField.blur();

  const elapsedMinutes = (new Date() - state.typing.startTime) / 60000;
  const finalWpm = Math.round((state.typing.totalChars / 5) / elapsedMinutes);
  const finalAccuracy = Math.round(((state.typing.totalChars - state.typing.errors) / state.typing.totalChars) * 100);

  if (!state.progress.lessonProgress[state.currentMode]) state.progress.lessonProgress[state.currentMode] = {};
  const prevBest = state.progress.lessonProgress[state.currentMode][state.currentLessonIndex] || { bestWPM: 0, bestAccuracy: 0 };

  state.progress.lessonProgress[state.currentMode][state.currentLessonIndex] = {
    completed: true,
    bestWPM: Math.max(prevBest.bestWPM, finalWpm),
    bestAccuracy: Math.max(prevBest.bestAccuracy, finalAccuracy)
  };

  saveProgress();

  $("final-wpm").textContent = finalWpm;
  $("final-accuracy").textContent = `${finalAccuracy}%`;

  $("next-lesson").textContent = state.currentLessonIndex === 6 ? "Get Certificate" : "Next Lesson";
  showScreen("results");
}

function showCertificate() {
  const mode = state.currentMode.toUpperCase();
  const stats = Object.values(state.progress.lessonProgress[state.currentMode] || {});
  const avgWpm = stats.length ? Math.round(stats.reduce((acc, s) => acc + s.bestWPM, 0) / stats.length) : 0;
  const avgAcc = stats.length ? Math.round(stats.reduce((acc, s) => acc + s.bestAccuracy, 0) / stats.length) : 0;

  $("cert-mode").textContent = `${mode} MODE`;
  $("cert-wpm").textContent = `${avgWpm} WPM (Avg)`;
  $("cert-accuracy").textContent = `${avgAcc}% Accuracy`;
  $("cert-date").textContent = new Date().toLocaleDateString();

  showScreen("certificate");
}

// Run AFTER the HTML is loaded
document.addEventListener("DOMContentLoaded", init);
