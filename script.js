let currentQuestion = 0;
let score = 0;
let selectedLanguage = '';
let playerName = "Player"; 
let shuffledQuestions = [];
let timerInterval;
const QUESTION_TIME = 15; 
let timeLeft = QUESTION_TIME;

const questions = {
  Python: [
    { q: "Which data type stores True/False?", a: ["int", "bool", "str"], correct: 1 },
    { q: "What keyword defines a function?", a: ["def", "func", "function"], correct: 0 },
    { q: "Which symbol is used for comments?", a: ["//", "#", "--"], correct: 1 },
    { q: "Which loop repeats while true?", a: ["for", "while", "loop"], correct: 1 },
    { q: "How do you print text?", a: ["echo", "print()", "console.log"], correct: 1 }
  ],
  JavaScript: [
    { q: "Which keyword declares a variable?", a: ["var", "int", "define"], correct: 0 },
    { q: "How do you write a comment?", a: ["//", "#", "--"], correct: 0 },
    { q: "Which function shows output?", a: ["print()", "console.log()", "echo"], correct: 1 },
    { q: "What is used for arrays?", a: ["{}", "[]", "()"], correct: 1 },
    { q: "Which loop repeats while true?", a: ["for", "while", "loop"], correct: 1 }
  ],
  Swift: [
    { q: "What keyword defines a function?", a: ["def", "func", "function"], correct: 1 },
    { q: "Which symbol starts a comment?", a: ["//", "#", "--"], correct: 0 },
    { q: "How do you declare a variable?", a: ["let", "var", "int"], correct: 1 },
    { q: "Which type stores text?", a: ["String", "Text", "str"], correct: 0 },
    { q: "What is used for arrays?", a: ["{}", "[]", "()"], correct: 1 }
  ],
  C: [
    { q: "Which header is needed for printf?", a: ["stdio.h", "iostream", "main.h"], correct: 0 },
    { q: "Which symbol starts a comment?", a: ["//", "#", "--"], correct: 0 },
    { q: "What keyword defines a function?", a: ["void", "func", "def"], correct: 0 },
    { q: "Which type stores characters?", a: ["char", "string", "text"], correct: 0 },
    { q: "Which loop repeats while true?", a: ["for", "while", "loop"], correct: 1 }
  ]
};

// -----------------------------
// Screen Functions
// -----------------------------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(div => div.style.display = "none");
  document.getElementById(id).style.display = "block";
}

function showInstructions() { showScreen("instructions-screen"); }
function showLanguageSelection() { showScreen("language-screen"); }
function showNameScreen() { showScreen("name-screen"); }

// -----------------------------
// Name Functions
// -----------------------------
function saveName() {
  const input = document.getElementById("player-name").value.trim();
  if (input !== "") playerName = input;
  showInstructions();
}

// -----------------------------
// Quiz Functions
// -----------------------------
function startQuiz(language) {
  selectedLanguage = language;
  currentQuestion = 0;
  score = 0;

  shuffledQuestions = [...questions[selectedLanguage]];
  shuffledQuestions.sort(() => Math.random() - 0.5);

  showScreen("quiz-screen");
  showQuestion();
}

function showQuestion() {
  clearInterval(timerInterval);
  timeLeft = QUESTION_TIME;
  updateTimerDisplay();

  const q = shuffledQuestions[currentQuestion];

  updateProgressBar();

  document.getElementById("question-number").innerText = `Question ${currentQuestion + 1}`;
  document.getElementById("question-text").innerText = q.q;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = '';

  // Shuffle options and mark correct answer
  const shuffledOptions = q.a.map((text, index) => ({ text, originalIndex: index }));
  shuffledOptions.sort(() => Math.random() - 0.5);

  shuffledOptions.forEach(({ text, originalIndex }) => {
    const btn = document.createElement("button");
    btn.innerText = text;
    if (originalIndex === q.correct) btn.dataset.correct = "true";
    btn.onclick = () => checkAnswer(btn);
    optionsDiv.appendChild(btn);
  });

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoNextQuestion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerDiv = document.getElementById("timer");
  timerDiv.innerText = `Time: ${timeLeft}s`;
}

// -----------------------------
// Check Answer
// -----------------------------
function checkAnswer(btn) {
  clearInterval(timerInterval);
  const optionsButtons = Array.from(document.getElementById("options").children);
  optionsButtons.forEach(b => b.disabled = true);

  if (btn.dataset.correct === "true") {
    score++;
    btn.style.backgroundColor = "green";
  } else {
    btn.style.backgroundColor = "red";
    const correctBtn = optionsButtons.find(b => b.dataset.correct === "true");
    if (correctBtn) correctBtn.style.backgroundColor = "green";
  }

  currentQuestion++;
  setTimeout(() => {
    if (currentQuestion < shuffledQuestions.length) showQuestion();
    else showResult();
  }, 600);
}

// -----------------------------
// Auto next question if time runs out
// -----------------------------
function autoNextQuestion() {
  const optionsButtons = Array.from(document.getElementById("options").children);
  const correctBtn = optionsButtons.find(b => b.dataset.correct === "true");
  optionsButtons.forEach(b => b.disabled = true);
  if (correctBtn) correctBtn.style.backgroundColor = "green";

  currentQuestion++;
  setTimeout(() => {
    if (currentQuestion < shuffledQuestions.length) showQuestion();
    else showResult();
  }, 600);
}

// -----------------------------
// Progress Bar
// -----------------------------
function updateProgressBar() {
  const percent = (currentQuestion / shuffledQuestions.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

// -----------------------------
// Results
// -----------------------------
function showResult() {
  showScreen("result-screen");
  const total = shuffledQuestions.length;
  let message = "";

  if (score === total) message = `Amazing, ${playerName}! Perfect score! You're a coding master!`;
  else if (score >= 4) message = `Great job, ${playerName}! You know your stuff!`;
  else if (score >= 2) message = `Not bad, ${playerName}! Keep practicing.`;
  else message = `Don't worry, ${playerName}, keep learning and you'll get better!`;

  document.getElementById("score-text").innerText =
    `Your score is ${score} out of ${total}\n${message}`;

  if (score >= 4) {
    const duration = 2000;
    const end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 5, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
}

// -----------------------------
// Restart
// -----------------------------
function restartGame() {
  selectedLanguage = '';
  currentQuestion = 0;
  score = 0;
  playerName = "Player";
  clearInterval(timerInterval);
  showScreen("start-screen");
}
