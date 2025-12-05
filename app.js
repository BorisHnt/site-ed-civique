const i18n = {
  fr: {
    heroEyebrow: "Mobile-first",
    heroTitle: "Quiz d’éducation civique",
    heroDesc: "Sessions de 10, 20 ou 40 questions, corrigées instantanément.",
    start: "Lancer une session",
    dataLoading: "Chargement des questions…",
    dataReady: (count) => `${count} questions prêtes.`,
    dataError: "Impossible de charger Questions001.txt.",
    quizEyebrow: "En cours",
    quizPlaceholder: "Choisissez une session et appuyez sur « Lancer ».",
    prev: "Précédent",
    next: "Suivant",
    finish: "Terminer",
    selectAnswerPrompt: "Choisissez une réponse pour continuer.",
    summaryTitle: "Session terminée",
    summarySubtitle: "Votre note",
    gridHint: "Touchez un carré rouge pour voir la correction.",
    mistakesTitle: "Toutes les réponses",
    mistakesEmpty: "Aucune question dans cette session.",
    historyEyebrow: "Historique",
    historyTitle: "Vos dernières notes",
    historyEmpty: "Aucun questionnaire complété pour l’instant.",
    scoreOn: (score, total) => `${score}/${total}`,
    tooltipTitleWrong: "Correction",
    tooltipYourAnswer: "Votre réponse",
    tooltipCorrect: "Bonne réponse",
    tooltipExplanation: "Pourquoi",
    sessionLabel: (size) => `Session ${size} questions`,
    previewTitle: "Mode rapide",
    previewDesc: "Corrections claires, inspiration material + fiches de révision.",
    previewMode: "Light / Dark",
    wrongShort: "Faux",
    correctShort: "Juste",
    loading: "Chargement…",
    percent: (p) => `${p}%`,
    dateLabel: "Date",
    questionOf: (n, total) => `Question ${n} / ${total}`
  },
  en: {
    heroEyebrow: "Mobile-first",
    heroTitle: "Civics quiz",
    heroDesc: "10, 20 or 40-question sprints with instant feedback.",
    start: "Start a session",
    dataLoading: "Loading questions…",
    dataReady: (count) => `${count} questions ready.`,
    dataError: "Could not load Questions001.txt.",
    quizEyebrow: "In progress",
    quizPlaceholder: "Pick a session and hit “Start”.",
    prev: "Previous",
    next: "Next",
    finish: "Finish",
    selectAnswerPrompt: "Select an answer to continue.",
    summaryTitle: "Session complete",
    summarySubtitle: "Your score",
    gridHint: "Tap a red square to review the mistake.",
    mistakesTitle: "All answers",
    mistakesEmpty: "No questions in this session.",
    historyEyebrow: "Recap",
    historyTitle: "Your recent scores",
    historyEmpty: "No quiz completed yet.",
    scoreOn: (score, total) => `${score}/${total}`,
    tooltipTitleWrong: "Correction",
    tooltipYourAnswer: "Your answer",
    tooltipCorrect: "Correct answer",
    tooltipExplanation: "Why",
    sessionLabel: (size) => `${size}-question run`,
    previewTitle: "Quick mode",
    previewDesc: "Clean corrections, material-inspired flashcard vibe.",
    previewMode: "Light / Dark",
    wrongShort: "Wrong",
    correctShort: "Right",
    loading: "Loading…",
    percent: (p) => `${p}%`,
    dateLabel: "Date",
    questionOf: (n, total) => `Question ${n} / ${total}`
  }
};

const elements = {
  app: document.querySelector(".app-shell"),
  themeToggle: document.getElementById("theme-toggle"),
  themeIcon: document.getElementById("theme-icon"),
  langFr: document.getElementById("lang-fr"),
  langEn: document.getElementById("lang-en"),
  sessionButtons: Array.from(document.querySelectorAll(".session-btn")),
  startBtn: document.getElementById("start-btn"),
  startLabel: document.getElementById("start-label"),
  dataStatus: document.getElementById("data-status"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroDesc: document.getElementById("hero-desc"),
  previewTitle: document.getElementById("preview-title"),
  previewDesc: document.getElementById("preview-desc"),
  previewMode: document.getElementById("preview-mode"),
  quizEyebrow: document.getElementById("quiz-eyebrow"),
  quizTitle: document.getElementById("quiz-title"),
  quizBody: document.getElementById("quiz-body"),
  quizPlaceholder: document.getElementById("quiz-placeholder"),
  progressBadge: document.getElementById("progress-badge"),
  prevBtn: document.getElementById("prev-btn"),
  prevLabel: document.getElementById("prev-label"),
  nextBtn: document.getElementById("next-btn"),
  nextLabel: document.getElementById("next-label"),
  historyEyebrow: document.getElementById("history-eyebrow"),
  historyTitle: document.getElementById("history-title"),
  historyBody: document.getElementById("history-body"),
  historyPlaceholder: document.getElementById("history-placeholder"),
  historyCount: document.getElementById("history-count"),
  historyClear: document.getElementById("history-clear"),
  tooltip: document.getElementById("tooltip"),
  snackbar: document.getElementById("snackbar")
};

const state = {
  language: localStorage.getItem("civique-lang") || (navigator.language?.startsWith("fr") ? "fr" : "en"),
  theme: localStorage.getItem("civique-theme") || "light",
  sessionSize: 10,
  allQuestions: [],
  session: [],
  currentIndex: 0,
  answers: {},
  finished: false,
  history: loadHistory()
  ,
  route: "home"
};

function t(key, ...args) {
  const value = i18n[state.language]?.[key];
  if (typeof value === "function") return value(...args);
  return value ?? key;
}

function setLanguage(lang) {
  state.language = lang === "fr" ? "fr" : "en";
  localStorage.setItem("civique-lang", state.language);
  document.documentElement.lang = state.language;
  setLanguageButtons();
  syncTexts();
  renderHistory();
  if (state.finished) renderSummary();
  else renderQuestion();
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  localStorage.setItem("civique-theme", state.theme);
  document.documentElement.dataset.theme = state.theme;
  elements.app.dataset.theme = state.theme;
  elements.themeIcon.textContent = state.theme === "dark" ? "light_mode" : "dark_mode";
}

function getRouteFromHash() {
  if (window.location.hash === "#/quizz") return "quizz";
  return "home";
}

function setRoute(route) {
  state.route = route === "quizz" ? "quizz" : "home";
  document.body.dataset.route = state.route;
  if (state.route === "quizz") {
    if (window.location.hash !== "#/quizz") {
      history.replaceState({}, "", "#/quizz");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    if (window.location.hash !== "#/") {
      history.replaceState({}, "", "#/");
    }
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem("civique-history");
    if (!raw) return [];
    return JSON.parse(raw) ?? [];
  } catch (e) {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem("civique-history", JSON.stringify(state.history.slice(0, 25)));
}

async function loadQuestions() {
  elements.dataStatus.textContent = t("dataLoading");
  const tryJson = async () => {
    try {
      const res = await fetch("data/questions.json");
      if (!res.ok) return null;
      const json = await res.json();
      const normalized = normalizeQuestions(json);
      if (!normalized.length) return null;
      return normalized;
    } catch (e) {
      return null;
    }
  };

  const tryTxt = async () => {
    try {
      const res = await fetch("Questions001.txt");
      if (!res.ok) return null;
      const text = await res.text();
      const parsed = parseQuestions(text);
      return parsed;
    } catch (e) {
      return null;
    }
  };

  const fromJson = await tryJson();
  if (fromJson) {
    state.allQuestions = fromJson;
    elements.dataStatus.textContent = t("dataReady", state.allQuestions.length);
    return;
  }

  const fromTxt = await tryTxt();
  if (fromTxt) {
    state.allQuestions = fromTxt;
    elements.dataStatus.textContent = t("dataReady", state.allQuestions.length);
    return;
  }

  elements.dataStatus.textContent = t("dataError");
  showSnackbar(t("dataError"));
}

function parseQuestions(text) {
  const lines = text.split(/\r?\n/);
  let category = "Général";
  const rawQuestions = [];
  let current = null;
  let readingExplanation = false;
  let qId = 0;

  const isHeading = (line) => {
    if (!line) return false;
    if (/^[\.\-–—]+$/.test(line)) return false;
    if (/^\d+\./.test(line)) return false;
    if (/^[a-d][.)]/i.test(line)) return false;
    if (/^réponse/i.test(line)) return false;
    if (line.includes("?")) return false;
    if (line.length > 80) return false;
    return true;
  };

  const pushCurrent = () => {
    if (current) {
      rawQuestions.push({ ...current });
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (isHeading(line)) {
      pushCurrent();
      current = null;
      readingExplanation = false;
      category = line;
      continue;
    }

    const qMatch = line.match(/^(\d+)[.)]?\s*(.*)/);
    if (qMatch) {
      const promptCandidate = qMatch[2].trim();
      if (!promptCandidate.includes("?") && promptCandidate.split(" ").length <= 6) {
        // Looks like a section title rather than a question.
        pushCurrent();
        current = null;
        readingExplanation = false;
        category = promptCandidate;
        continue;
      }
      pushCurrent();
      current = {
        id: `q${++qId}`,
        prompt: promptCandidate,
        options: [],
        answerLetter: null,
        answer: "",
        explanation: "",
        category
      };
      readingExplanation = false;
      continue;
    }

    const questionMark = line.match(/^(.*\?)$/);
    if (questionMark) {
      pushCurrent();
      current = {
        id: `q${++qId}`,
        prompt: questionMark[1],
        options: [],
        answerLetter: null,
        answer: "",
        explanation: "",
        category
      };
      readingExplanation = false;
      continue;
    }

    if (!current) continue;

    const optMatch = line.match(/^([a-d])[.)]\s*(.*)/i);
    if (optMatch) {
      current.options.push({ key: optMatch[1].toLowerCase(), text: optMatch[2].trim() });
      continue;
    }

    const ansMatch = line.match(/^(réponse|bonne réponse)\s*:\s*([a-d])[.)]?\s*(.*)/i);
    if (ansMatch) {
      current.answerLetter = ansMatch[2].toLowerCase();
      current.explanation = ansMatch[3].trim();
      readingExplanation = true;
      continue;
    }

    if (readingExplanation) {
      current.explanation += (current.explanation ? " " : "") + line;
    } else {
      current.prompt += " " + line;
    }
  }

  pushCurrent();
  const cleaned = rawQuestions.filter(
    (q) => q.answerLetter && q.options && q.options.length >= 2
  );
  return cleaned;
}

function normalizeQuestions(data) {
  if (!Array.isArray(data)) return [];
  return data
    .map((q, idx) => {
      const options = Array.isArray(q.options)
        ? q.options
            .map((opt) => ({
              key: String(opt.key || "").toLowerCase(),
              text: String(opt.text || "").trim()
            }))
            .filter((opt) => opt.key && opt.text)
        : [];
      const answerLetter = String(q.answerLetter || "").toLowerCase();
      return {
        id: q.id || `q${idx + 1}`,
        prompt: String(q.prompt || "").trim(),
        options,
        answerLetter,
        explanation: String(q.explanation || "").trim(),
        category: String(q.category || "Général").trim()
      };
    })
    .filter((q) => q.prompt && q.options.length >= 2 && q.answerLetter);
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startSession() {
  if (!state.allQuestions.length) {
    showSnackbar(t("dataError"));
    loadQuestions();
    return;
  }
  setRoute("quizz");
  state.session = shuffle(state.allQuestions).slice(0, state.sessionSize);
  state.currentIndex = 0;
  state.answers = {};
  state.finished = false;
  renderQuestion();
}

function renderQuestion() {
  elements.quizBody.innerHTML = "";
  elements.quizPlaceholder.textContent = "";
  if (!state.session.length) {
    elements.quizPlaceholder.textContent = t("quizPlaceholder");
    elements.quizBody.appendChild(elements.quizPlaceholder);
    elements.quizTitle.textContent = t("sessionLabel", state.sessionSize);
    elements.progressBadge.textContent = "0 / 0";
    updateNavButtons();
    return;
  }

  if (state.finished) {
    renderSummary();
    return;
  }

  const question = state.session[state.currentIndex];
  const total = state.session.length;
  elements.quizTitle.textContent = t("questionOf", state.currentIndex + 1, total);
  elements.progressBadge.textContent = `${state.currentIndex + 1} / ${total}`;

  const progress = document.createElement("div");
  progress.className = "progress";
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  bar.style.width = `${((state.currentIndex + 1) / total) * 100}%`;
  progress.appendChild(bar);

  const title = document.createElement("p");
  title.className = "question-title";
  title.innerHTML = question.prompt;

  const category = document.createElement("p");
  category.className = "muted";
  category.textContent = question.category;

  const options = document.createElement("div");
  options.className = "options";
  question.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    if (state.answers[question.id] === opt.key) {
      btn.classList.add("selected");
    }

    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = opt.key.toUpperCase();

    const text = document.createElement("span");
    text.innerHTML = opt.text;

    btn.appendChild(letter);
    btn.appendChild(text);
    btn.addEventListener("click", () => {
      state.answers[question.id] = opt.key;
      renderQuestion();
    });
    options.appendChild(btn);
  });

  elements.quizBody.append(progress, title, category, options);
  updateNavButtons();
}

function updateNavButtons() {
  elements.prevLabel.textContent = t("prev");
  elements.nextLabel.textContent = state.currentIndex === state.session.length - 1 ? t("finish") : t("next");
  elements.prevBtn.disabled = state.currentIndex === 0 || state.finished;
}

function nextStep() {
  if (!state.session.length || state.finished) return;
  const question = state.session[state.currentIndex];
  if (!state.answers[question.id]) {
    showSnackbar(t("selectAnswerPrompt"));
    return;
  }
  if (state.currentIndex === state.session.length - 1) {
    finalizeSession();
  } else {
    state.currentIndex += 1;
    renderQuestion();
  }
}

function prevStep() {
  if (!state.session.length || state.currentIndex === 0 || state.finished) return;
  state.currentIndex -= 1;
  renderQuestion();
}

function finalizeSession() {
  state.finished = true;
  const total = state.session.length;
  const results = state.session.map((q) => {
    const userAnswer = state.answers[q.id];
    const correct = userAnswer && userAnswer.toLowerCase() === q.answerLetter?.toLowerCase();
    return {
      question: q,
      userAnswer,
      correct,
      explanation: q.explanation
    };
  });
  const score = results.filter((r) => r.correct).length;
  const percent = Math.round((score / total) * 100);
  state.history.unshift({
    id: Date.now(),
    score,
    total,
    percent,
    date: new Date().toISOString()
  });
  saveHistory();
  renderSummary();
  renderHistory();
}

function renderSummary() {
  const total = state.session.length;
  const results = state.session.map((q) => {
    const userAnswer = state.answers[q.id];
    const correct = userAnswer && userAnswer.toLowerCase() === q.answerLetter?.toLowerCase();
    return {
      question: q,
      userAnswer,
      correct,
      explanation: q.explanation
    };
  });
  const score = results.filter((r) => r.correct).length;
  const percent = Math.round((score / total) * 100);

  elements.quizBody.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = "summary";

  const title = document.createElement("h3");
  title.textContent = t("summaryTitle");

  const scoreRow = document.createElement("div");
  scoreRow.className = "score";
  const main = document.createElement("span");
  main.className = "main";
  main.textContent = t("scoreOn", score, total);
  const sub = document.createElement("span");
  sub.className = "sub";
  sub.textContent = t("percent", percent);
  scoreRow.append(main, sub);

  const hint = document.createElement("p");
  hint.className = "muted";
  hint.textContent = t("gridHint");

  const grid = document.createElement("div");
  grid.className = "result-grid";
  results.forEach((res, idx) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "result-cell " + (res.correct ? "ok" : "ko");
    cell.textContent = `${idx + 1}`;
    if (!res.correct) {
      cell.addEventListener("click", () => {
        showTooltip(buildTooltip(res));
      });
    } else {
      cell.title = t("correctShort");
    }
    grid.appendChild(cell);
  });

  const reviewBlock = document.createElement("div");
  reviewBlock.className = "mistake-list";
  const reviewTitle = document.createElement("h4");
  reviewTitle.textContent = t("mistakesTitle");
  reviewBlock.appendChild(reviewTitle);
  if (!results.length) {
    const ok = document.createElement("p");
    ok.className = "muted";
    ok.textContent = t("mistakesEmpty");
    reviewBlock.appendChild(ok);
  } else {
    results.forEach((item, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "mistake-item";
      const status = document.createElement("span");
      status.className = "status-dot " + (item.correct ? "ok" : "ko");
      const qTitle = document.createElement("p");
      qTitle.className = "question-title small";
      qTitle.innerHTML = `${idx + 1}. ${item.question.prompt}`;
      const answerLine = document.createElement("p");
      answerLine.className = "muted";
      const userOpt = item.question.options.find((o) => o.key === item.userAnswer);
      answerLine.innerHTML = `<strong>${t("tooltipYourAnswer")}:</strong> ${userOpt ? userOpt.text : "—"}`;
      const correctLine = document.createElement("p");
      correctLine.className = "muted";
      const correctOpt = item.question.options.find((o) => o.key === item.question.answerLetter);
      correctLine.innerHTML = `<strong>${t("tooltipCorrect")}:</strong> ${correctOpt ? correctOpt.text : "—"}`;
      const expl = document.createElement("p");
      expl.className = "muted";
      expl.innerHTML = item.explanation || "";
      wrap.append(status, qTitle, answerLine, correctLine, expl);
      reviewBlock.appendChild(wrap);
    });
  }

  summary.append(title, scoreRow, hint, grid, reviewBlock);
  elements.quizBody.appendChild(summary);
  elements.quizTitle.textContent = t("summarySubtitle");
  elements.progressBadge.textContent = t("scoreOn", score, total);
  elements.nextLabel.textContent = t("start");
  elements.prevBtn.disabled = true;
}

function buildTooltip(res) {
  const correctOpt = res.question.options.find((o) => o.key === res.question.answerLetter);
  const userOpt = res.question.options.find((o) => o.key === res.userAnswer);
  return `
    <strong>${t("tooltipTitleWrong")}</strong><br/>
    ${res.question.prompt}<br/><br/>
    ${t("tooltipYourAnswer")}: ${userOpt ? userOpt.text : "—"}<br/>
    ${t("tooltipCorrect")}: ${correctOpt ? correctOpt.text : "—"}<br/>
    ${t("tooltipExplanation")}: ${res.explanation || ""}
  `;
}

let tooltipTimeout;
function showTooltip(html) {
  elements.tooltip.innerHTML = html;
  elements.tooltip.classList.remove("hidden");
  clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(() => {
    elements.tooltip.classList.add("hidden");
  }, 6000);
}

let snackbarTimeout;
function showSnackbar(message) {
  elements.snackbar.textContent = message;
  elements.snackbar.classList.remove("hidden");
  clearTimeout(snackbarTimeout);
  snackbarTimeout = setTimeout(() => {
    elements.snackbar.classList.add("hidden");
  }, 2800);
}

function renderHistory() {
  elements.historyBody.innerHTML = "";
  elements.historyCount.textContent = state.history.length;
  if (!state.history.length) {
    elements.historyBody.appendChild(elements.historyPlaceholder);
    elements.historyPlaceholder.textContent = t("historyEmpty");
    return;
  }
  state.history.slice(0, 12).forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    const meta = document.createElement("div");
    meta.className = "meta";
    const title = document.createElement("strong");
    title.textContent = t("sessionLabel", item.total);
    const date = document.createElement("span");
    date.className = "muted";
    date.textContent = formatDate(item.date);
    meta.append(title, date);

    const chip = document.createElement("div");
    chip.className = "score-chip";
    chip.textContent = `${item.score}/${item.total} · ${item.percent}%`;
    row.append(meta, chip);
    elements.historyBody.appendChild(row);
  });
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleString(state.language === "fr" ? "fr-FR" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch (e) {
    return dateStr;
  }
}

function syncTexts() {
  elements.heroEyebrow.textContent = t("heroEyebrow");
  elements.heroTitle.textContent = t("heroTitle");
  elements.heroDesc.textContent = t("heroDesc");
  elements.startLabel.textContent = t("start");
  elements.quizEyebrow.textContent = t("quizEyebrow");
  elements.quizPlaceholder.textContent = t("quizPlaceholder");
  elements.prevLabel.textContent = t("prev");
  elements.nextLabel.textContent = t("next");
  elements.historyEyebrow.textContent = t("historyEyebrow");
  elements.historyTitle.textContent = t("historyTitle");
  elements.historyPlaceholder.textContent = t("historyEmpty");
  elements.previewTitle.textContent = t("previewTitle");
  elements.previewDesc.textContent = t("previewDesc");
  elements.previewMode.textContent = t("previewMode");
}

function setActiveSessionButton(size) {
  elements.sessionButtons.forEach((btn) => {
    const value = Number(btn.dataset.size);
    if (value === size) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function setLanguageButtons() {
  if (state.language === "fr") {
    elements.langFr.classList.add("active");
    elements.langEn.classList.remove("active");
  } else {
    elements.langEn.classList.add("active");
    elements.langFr.classList.remove("active");
  }
}

function init() {
  setTheme(state.theme);
  setLanguageButtons();
  syncTexts();
  renderHistory();
  loadQuestions();
  setRoute(getRouteFromHash());

  elements.sessionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.sessionSize = Number(btn.dataset.size);
      setActiveSessionButton(state.sessionSize);
    });
  });

  setActiveSessionButton(state.sessionSize);

  elements.langFr.addEventListener("click", () => setLanguage("fr"));
  elements.langEn.addEventListener("click", () => setLanguage("en"));
  elements.themeToggle.addEventListener("click", () => setTheme(state.theme === "light" ? "dark" : "light"));
  elements.startBtn.addEventListener("click", startSession);
  elements.nextBtn.addEventListener("click", () => {
    if (state.finished) {
      state.finished = false;
      startSession();
    } else {
      nextStep();
    }
  });
  elements.prevBtn.addEventListener("click", prevStep);

  document.addEventListener("click", (e) => {
    if (!elements.tooltip.contains(e.target)) {
      elements.tooltip.classList.add("hidden");
    }
  });

  elements.historyClear.addEventListener("click", () => {
    state.history = [];
    saveHistory();
    renderHistory();
  });

  window.addEventListener("hashchange", () => setRoute(getRouteFromHash()));
}

init();
