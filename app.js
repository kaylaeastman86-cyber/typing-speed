// Typing Speed Master - app.js

const CONTENT = {
    basics: {
        lesson1: "asdf jkl; asdf jkl; a s d f j k l ; asdf jkl; a s d f j k l ; aa ss dd ff jj kk ll ;; asdfjkl;",
        lesson2: "qwer uiop qwer uiop q w e r u i o p qwer uiop q w e r u i o p qq ww ee rr uu ii oo pp qweruiop",
        lesson3: "zxcv m,./ zxcv m,./ z x c v m , . / zxcv m,./ z x c v m , . / zz xx cc vv mm ,, .. // zxcvm,./"
    },
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

// State Management
let state = {
    currentMode: 'casual',
    currentLessonIndex: 0,
    lessons: [],
    progress: {
        lastLesson: 0,
        lessonProgress: {}
    },
    typing: {
        startTime: null,
        currentIndex: 0,
        errors: 0,
        totalChars: 0,
        isFinished: false
    }
};

// DOM Elements
const screens = {
    landing: document.getElementById('screen-landing'),
    lessons: document.getElementById('screen-lessons'),
    typing: document.getElementById('screen-typing'),
    results: document.getElementById('screen-results'),
    certificate: document.getElementById('screen-certificate')
};

const inputField = document.getElementById('typing-input');
const textDisplay = document.getElementById('text-display');

// Initialization
function init() {
    loadProgress();
    setupEventListeners();
    checkResume();
}

function loadProgress() {
    const saved = localStorage.getItem('typing_master_progress');
    if (saved) {
        state.progress = JSON.parse(saved);
        if (!state.progress.lessonProgress) state.progress.lessonProgress = {};
    } else {
        state.progress = {
            lessonProgress: {},
            lastMode: null,
            lastLessonIndex: 0
        };
    }
}

function checkResume() {
    const badge = document.getElementById('resume-badge');
    if (state.progress.lastMode && state.progress.lastLessonIndex !== undefined) {
        badge.style.display = 'inline-flex';
        const modeName = state.progress.lastMode.charAt(0).toUpperCase() + state.progress.lastMode.slice(1);
        document.getElementById('resume-text').textContent = `Resume: Lesson ${state.progress.lastLessonIndex + 1} (${modeName})`;
        
        document.getElementById('btn-resume').onclick = () => {
            selectMode(state.progress.lastMode);
            startLesson(state.progress.lastLessonIndex);
        };
    } else {
        badge.style.display = 'none';
    }
}

function saveProgress() {
    state.progress.lastMode = state.currentMode;
    state.progress.lastLessonIndex = state.currentLessonIndex;
    localStorage.setItem('typing_master_progress', JSON.stringify(state.progress));
}

function setupEventListeners() {
    // Mode Selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            selectMode(card.dataset.mode);
        });
    });

    // Navigation
    document.getElementById('back-to-modes').addEventListener('click', () => showScreen('landing'));
    document.getElementById('back-to-lessons').addEventListener('click', () => showScreen('lessons'));

    // Typing
    inputField.addEventListener('input', handleTyping);

    // Results Actions
    document.getElementById('retry-lesson').addEventListener('click', () => startLesson(state.currentLessonIndex));
    document.getElementById('next-lesson').addEventListener('click', () => {
        if (state.currentLessonIndex < 6) {
            startLesson(state.currentLessonIndex + 1);
        } else {
            showCertificate();
        }
    });

    // Certificate
    document.getElementById('close-cert').addEventListener('click', () => showScreen('lessons'));
    document.getElementById('download-cert').addEventListener('click', () => {
        alert('Certificate download would start here in a real app!');
    });
}

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    
    if (screenId === 'lessons') {
        renderLessons();
    }
}

function selectMode(mode) {
    state.currentMode = mode;
    state.lessons = CONTENT[mode];
    document.getElementById('current-mode-display').textContent = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    showScreen('lessons');
}

function renderLessons() {
    const list = document.getElementById('lessons-list');
    list.innerHTML = '';
    
    // Calculate total progress
    let completedCount = 0;
    for (let i = 0; i < 7; i++) {
        if (state.progress.lessonProgress[state.currentMode]?.[i]?.completed) {
            completedCount++;
        }
    }
    
    const totalPercent = (completedCount / 7) * 100;
    document.getElementById('total-progress-bar').style.width = `${totalPercent}%`;
    document.getElementById('progress-text').textContent = `${completedCount}/7 Lessons Completed`;

    state.lessons.forEach((lesson, index) => {
        const item = document.createElement('div');
        const isLocked = index > 0 && !state.progress.lessonProgress[state.currentMode]?.[index - 1]?.completed;
        const isCompleted = state.progress.lessonProgress[state.currentMode]?.[index]?.completed;

        item.className = `lesson-item ${isLocked ? 'locked' : ''}`;
        item.innerHTML = `
            <div class="lesson-info">
                <h4>Lesson ${index + 1}: ${lesson.title}</h4>
                <p>${lesson.focus}</p>
                ${isCompleted ? `<p class="best-stats">Best: ${state.progress.lessonProgress[state.currentMode][index].bestWPM} WPM | ${state.progress.lessonProgress[state.currentMode][index].bestAccuracy}% ACC</p>` : ''}
            </div>
            <div class="lesson-status">
                ${isLocked ? '🔒' : (isCompleted ? '✅' : '▶️')}
            </div>
        `;

        if (!isLocked) {
            item.addEventListener('click', () => startLesson(index));
        }
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

    document.getElementById('typing-lesson-title').textContent = `Lesson ${index + 1}: ${lesson.title}`;
    document.getElementById('lesson-focus').textContent = `Focus: ${lesson.focus}`;
    document.getElementById('live-wpm').textContent = '0 WPM';
    document.getElementById('live-accuracy').textContent = '100% ACC';
    document.getElementById('lesson-progress-bar').style.width = '0%';
    
    renderText(lesson.text);
    inputField.value = '';
    showScreen('typing');
    setTimeout(() => inputField.focus(), 100);
}

function renderText(text) {
    textDisplay.innerHTML = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'char';
        if (i === 0) span.classList.add('current');
        textDisplay.appendChild(span);
    });
}

function handleTyping(e) {
    if (state.typing.isFinished) return;

    if (!state.typing.startTime) {
        state.typing.startTime = new Date();
    }

    const value = e.target.value;
    const targetText = state.lessons[state.currentLessonIndex].text;
    const charElements = textDisplay.querySelectorAll('.char');

    // Reset styles
    charElements.forEach(el => el.classList.remove('current', 'correct', 'incorrect'));

    let errors = 0;
    for (let i = 0; i < value.length; i++) {
        if (i >= targetText.length) break;
        
        if (value[i] === targetText[i]) {
            charElements[i].classList.add('correct');
        } else {
            charElements[i].classList.add('incorrect');
            errors++;
        }
    }

    state.typing.currentIndex = value.length;
    state.typing.errors = errors;

    if (state.typing.currentIndex < targetText.length) {
        charElements[state.typing.currentIndex].classList.add('current');
    }

    // Update Live Stats
    updateLiveStats();

    // Check completion
    if (value.length >= targetText.length) {
        finishLesson();
    }
}

function updateLiveStats() {
    const elapsedMinutes = (new Date() - state.typing.startTime) / 60000;
    const wpm = elapsedMinutes > 0 ? Math.round((state.typing.currentIndex / 5) / elapsedMinutes) : 0;
    const accuracy = state.typing.currentIndex > 0 
        ? Math.round(((state.typing.currentIndex - state.typing.errors) / state.typing.currentIndex) * 100) 
        : 100;

    document.getElementById('live-wpm').textContent = `${wpm} WPM`;
    document.getElementById('live-accuracy').textContent = `${accuracy}% ACC`;
    
    const progressPercent = (state.typing.currentIndex / state.typing.totalChars) * 100;
    document.getElementById('lesson-progress-bar').style.width = `${progressPercent}%`;
}

function finishLesson() {
    state.typing.isFinished = true;
    inputField.blur();
    const elapsedMinutes = (new Date() - state.typing.startTime) / 60000;
    const finalWpm = Math.round((state.typing.totalChars / 5) / elapsedMinutes);
    const finalAccuracy = Math.round(((state.typing.totalChars - state.typing.errors) / state.typing.totalChars) * 100);

    // Update Progress
    if (!state.progress.lessonProgress[state.currentMode]) {
        state.progress.lessonProgress[state.currentMode] = {};
    }

    const prevBest = state.progress.lessonProgress[state.currentMode][state.currentLessonIndex] || { bestWPM: 0, bestAccuracy: 0 };
    
    state.progress.lessonProgress[state.currentMode][state.currentLessonIndex] = {
        completed: true,
        bestWPM: Math.max(prevBest.bestWPM, finalWpm),
        bestAccuracy: Math.max(prevBest.bestAccuracy, finalAccuracy)
    };

    saveProgress();

    // Show Results
    document.getElementById('final-wpm').textContent = finalWpm;
    document.getElementById('final-accuracy').textContent = `${finalAccuracy}%`;
    
    if (state.currentLessonIndex === 6) {
        document.getElementById('next-lesson').textContent = 'Get Certificate';
    } else {
        document.getElementById('next-lesson').textContent = 'Next Lesson';
    }

    showScreen('results');
}

function showCertificate() {
    const mode = state.currentMode.toUpperCase();
    const stats = Object.values(state.progress.lessonProgress[state.currentMode]);
    const avgWpm = Math.round(stats.reduce((acc, s) => acc + s.bestWPM, 0) / stats.length);
    const avgAcc = Math.round(stats.reduce((acc, s) => acc + s.bestAccuracy, 0) / stats.length);

    document.getElementById('cert-mode').textContent = `${mode} MODE`;
    document.getElementById('cert-wpm').textContent = `${avgWpm} WPM (Avg)`;
    document.getElementById('cert-accuracy').textContent = `${avgAcc}% Accuracy`;
    document.getElementById('cert-date').textContent = new Date().toLocaleDateString();

    showScreen('certificate');
}

// Start the app
init();// Typing Speed Master - app.js

const CONTENT = {
    basics: {
        lesson1: "asdf jkl; asdf jkl; a s d f j k l ; asdf jkl; a s d f j k l ; aa ss dd ff jj kk ll ;; asdfjkl;",
        lesson2: "qwer uiop qwer uiop q w e r u i o p qwer uiop q w e r u i o p qq ww ee rr uu ii oo pp qweruiop",
        lesson3: "zxcv m,./ zxcv m,./ z x c v m , . / zxcv m,./ z x c v m , . / zz xx cc vv mm ,, .. // zxcvm,./"
    },
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
        { title: "Code syntax", focus: "Markdown/Docs", text: "# Introduction to Biology\\n## Section 1: Cell Structure\\n- Nucleus\\n- Mitochondria" },
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

// State Management
let state = {
    currentMode: 'casual',
    currentLessonIndex: 0,
    lessons: [],
    progress: {
        lastLesson: 0,
        lessonProgress: {}
    },
    typing: {
        startTime: null,
        currentIndex: 0,
        errors: 0,
        totalChars: 0,
        isFinished: false
    }
};

// DOM Elements
const screens = {
    landing: document.getElementById('screen-landing'),
    lessons: document.getElementById('screen-lessons'),
    typing: document.getElementById('screen-typing'),
    results: document.getElementById('screen-results'),
    certificate: document.getElementById('screen-certificate')
};

const inputField = document.getElementById('typing-input');
const textDisplay = document.getElementById('text-display');

// Initialization
function init() {
    loadProgress();
    setupEventListeners();
    checkResume();
}

function loadProgress() {
    const saved = localStorage.getItem('typing_master_progress');
    if (saved) {
        state.progress = JSON.parse(saved);
        if (!state.progress.lessonProgress) state.progress.lessonProgress = {};
    } else {
        state.progress = {
            lessonProgress: {},
            lastMode: null,
            lastLessonIndex: 0
        };
    }
}

function checkResume() {
    const badge = document.getElementById('resume-badge');
    if (state.progress.lastMode && state.progress.lastLessonIndex !== undefined) {
        badge.style.display = 'inline-flex';
        const modeName = state.progress.lastMode.charAt(0).toUpperCase() + state.progress.lastMode.slice(1);
        document.getElementById('resume-text').textContent = `Resume: Lesson ${state.progress.lastLessonIndex + 1} (${modeName})`;
        
        document.getElementById('btn-resume').onclick = () => {
            selectMode(state.progress.lastMode);
            startLesson(state.progress.lastLessonIndex);
        };
    } else {
        badge.style.display = 'none';
    }
}

function saveProgress() {
    state.progress.lastMode = state.currentMode;
    state.progress.lastLessonIndex = state.currentLessonIndex;
    localStorage.setItem('typing_master_progress', JSON.stringify(state.progress));
}

function setupEventListeners() {
    // Mode Selection
    document.querySelectorAll('.mode-card').forEach(card => {
        card.addEventListener('click', () => {
            selectMode(card.dataset.mode);
        });
    });

    // Navigation
    document.getElementById('back-to-modes').addEventListener('click', () => showScreen('landing'));
    document.getElementById('back-to-lessons').addEventListener('click', () => showScreen('lessons'));

    // Typing
    inputField.addEventListener('input', handleTyping);

    // Results Actions
    document.getElementById('retry-lesson').addEventListener('click', () => startLesson(state.currentLessonIndex));
    document.getElementById('next-lesson').addEventListener('click', () => {
        if (state.currentLessonIndex < 6) {
            startLesson(state.currentLessonIndex + 1);
        } else {
            showCertificate();
        }
    });

    // Certificate
    document.getElementById('close-cert').addEventListener('click', () => showScreen('lessons'));
    document.getElementById('download-cert').addEventListener('click', () => {
        alert('Certificate download would start here in a real app!');
    });
}

function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.add('active');
    
    if (screenId === 'lessons') {
        renderLessons();
    }
}

function selectMode(mode) {
    state.currentMode = mode;
    state.lessons = CONTENT[mode];
    document.getElementById('current-mode-display').textContent = `Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    showScreen('lessons');
}

function renderLessons() {
    const list = document.getElementById('lessons-list');
    list.innerHTML = '';
    
    // Calculate total progress
    let completedCount = 0;
    for (let i = 0; i < 7; i++) {
        if (state.progress.lessonProgress[state.currentMode]?.[i]?.completed) {
            completedCount++;
        }
    }
    
    const totalPercent = (completedCount / 7) * 100;
    document.getElementById('total-progress-bar').style.width = `${totalPercent}%`;
    document.getElementById('progress-text').textContent = `${completedCount}/7 Lessons Completed`;

    state.lessons.forEach((lesson, index) => {
        const item = document.createElement('div');
        const isLocked = index > 0 && !state.progress.lessonProgress[state.currentMode]?.[index - 1]?.completed;
        const isCompleted = state.progress.lessonProgress[state.currentMode]?.[index]?.completed;

        item.className = `lesson-item ${isLocked ? 'locked' : ''}`;
        item.innerHTML = `
            <div class="lesson-info">
                <h4>Lesson ${index + 1}: ${lesson.title}</h4>
                <p>${lesson.focus}</p>
                ${isCompleted ? `<p class="best-stats">Best: ${state.progress.lessonProgress[state.currentMode][index].bestWPM} WPM | ${state.progress.lessonProgress[state.currentMode][index].bestAccuracy}% ACC</p>` : ''}
            </div>
            <div class="lesson-status">
                ${isLocked ? '🔒' : (isCompleted ? '✅' : '▶️')}
            </div>
        `;

        if (!isLocked) {
            item.addEventListener('click', () => startLesson(index));
        }
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

    document.getElementById('typing-lesson-title').textContent = `Lesson ${index + 1}: ${lesson.title}`;
    document.getElementById('lesson-focus').textContent = `Focus: ${lesson.focus}`;
    document.getElementById('live-wpm').textContent = '0 WPM';
    document.getElementById('live-accuracy').textContent = '100% ACC';
    document.getElementById('lesson-progress-bar').style.width = '0%';
    
    renderText(lesson.text);
    inputField.value = '';
    showScreen('typing');
    setTimeout(() => inputField.focus(), 100);
}

function renderText(text) {
    textDisplay.innerHTML = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'char';
        if (i === 0) span.classList.add('current');
        textDisplay.appendChild(span);
    });
}

function handleTyping(e) {
    if (state.typing.isFinished) return;

    if (!state.typing.startTime) {
        state.typing.startTime = new Date();
    }

    const value = e.target.value;
    const targetText = state.lessons[state.currentLessonIndex].text;
    const charElements = textDisplay.querySelectorAll('.char');

    // Reset styles
    charElements.forEach(el => el.classList.remove('current', 'correct', 'incorrect'));

    let errors = 0;
    for (let i = 0; i < value.length; i++) {
        if (i >= targetText.length) break;
        
        if (value[i] === targetText[i]) {
            charElements[i].classList.add('correct');
        } else {
            charElements[i].classList.add('incorrect');
            errors++;
        }
    }

    state.typing.currentIndex = value.length;
    state.typing.errors = errors;

    if (state.typing.currentIndex < targetText.length) {
        charElements[state.typing.currentIndex].classList.add('current');
    }

    // Update Live Stats
    updateLiveStats();

    // Check completion
    if (value.length >= targetText.length) {
        finishLesson();
    }
}

function updateLiveStats() {
    const elapsedMinutes = (new Date() - state.typing.startTime) / 60000;
    const wpm = elapsedMinutes > 0 ? Math.round((state.typing.currentIndex / 5) / elapsedMinutes) : 0;
    const accuracy = state.typing.currentIndex > 0 
        ? Math.round(((state.typing.currentIndex - state.typing.errors) / state.typing.currentIndex) * 100) 
        : 100;

    document.getElementById('live-wpm').textContent = `${wpm} WPM`;
    document.getElementById('live-accuracy').textContent = `${accuracy}% ACC`;
    
    const progressPercent = (state.typing.currentIndex / state.typing.totalChars) * 100;
    document.getElementById('lesson-progress-bar').style.width = `${progressPercent}%`;
}

function finishLesson() {
    state.typing.isFinished = true;
    inputField.blur();
    const elapsedMinutes = (new Date() - state.typing.startTime) / 60000;
    const finalWpm = Math.round((state.typing.totalChars / 5) / elapsedMinutes);
    const finalAccuracy = Math.round(((state.typing.totalChars - state.typing.errors) / state.typing.totalChars) * 100);

    // Update Progress
    if (!state.progress.lessonProgress[state.currentMode]) {
        state.progress.lessonProgress[state.currentMode] = {};
    }

    const prevBest = state.progress.lessonProgress[state.currentMode][state.currentLessonIndex] || { bestWPM: 0, bestAccuracy: 0 };
    
    state.progress.lessonProgress[state.currentMode][state.currentLessonIndex] = {
        completed: true,
        bestWPM: Math.max(prevBest.bestWPM, finalWpm),
        bestAccuracy: Math.max(prevBest.bestAccuracy, finalAccuracy)
    };

    saveProgress();

    // Show Results
    document.getElementById('final-wpm').textContent = finalWpm;
    document.getElementById('final-accuracy').textContent = `${finalAccuracy}%`;
    
    if (state.currentLessonIndex === 6) {
        document.getElementById('next-lesson').textContent = 'Get Certificate';
    } else {
        document.getElementById('next-lesson').textContent = 'Next Lesson';
    }

    showScreen('results');
}

function showCertificate() {
    const mode = state.currentMode.toUpperCase();
    const stats = Object.values(state.progress.lessonProgress[state.currentMode]);
    const avgWpm = Math.round(stats.reduce((acc, s) => acc + s.bestWPM, 0) / stats.length);
    const avgAcc = Math.round(stats.reduce((acc, s) => acc + s.bestAccuracy, 0) / stats.length);

    document.getElementById('cert-mode').textContent = `${mode} MODE`;
    document.getElementById('cert-wpm').textContent = `${avgWpm} WPM (Avg)`;
    document.getElementById('cert-accuracy').textContent = `${avgAcc}% Accuracy`;
    document.getElementById('cert-date').textContent = new Date().toLocaleDateString();

    showScreen('certificate');
}

// Start the app
init();
