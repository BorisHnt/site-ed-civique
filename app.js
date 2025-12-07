const i18n = {
  fr: {
    heroEyebrow: "Sessions de quiz",
    heroTitle: "Quiz d’éducation civique",
    heroDesc: "Choisissez un thème puis lancez 10 ou 20 questions (40 en mode mix).",
    start: "Lancer une session",
    dataLoading: "Chargement des questions…",
    dataReady: (count) => `${count} questions prêtes.`,
    dataError: "Impossible de charger les questions.",
    quizEyebrow: "En cours",
    quizPlaceholder: "Choisissez une session et appuyez sur « Lancer ».",
    prev: "Précédent",
    next: "Suivant",
    finish: "Terminer",
    mainMenu: "Menu principal",
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
    revisionLabel: "Mode fiches de révision",
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
    heroEyebrow: "Quiz sessions",
    heroTitle: "Civics quiz",
    heroDesc: "Pick a theme, then start 10, 20 or 40 questions.",
    start: "Start a session",
    dataLoading: "Loading questions…",
    dataReady: (count) => `${count} questions ready.`,
    dataError: "Could not load question data.",
    quizEyebrow: "In progress",
    quizPlaceholder: "Pick a session and hit “Start”.",
    prev: "Previous",
    next: "Next",
    finish: "Finish",
    mainMenu: "Main menu",
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
    revisionLabel: "Flashcard mode",
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
  themeSelector: document.getElementById("theme-selector"),
  langFr: document.getElementById("lang-fr"),
  langEn: document.getElementById("lang-en"),
  sessionButtons: Array.from(document.querySelectorAll(".session-btn")),
  startBtn: document.getElementById("start-btn"),
  startLabel: document.getElementById("start-label"),
  dataStatus: document.getElementById("data-status"),
  heroEyebrow: document.getElementById("hero-eyebrow"),
  heroTitle: document.getElementById("hero-title"),
  heroDesc: document.getElementById("hero-desc"),
  revisionToggle: document.getElementById("revision-toggle"),
  revisionLabel: document.getElementById("revision-label"),
  quizEyebrow: document.getElementById("quiz-eyebrow"),
  quizTitle: document.getElementById("quiz-title"),
  quizBody: document.getElementById("quiz-body"),
  quizPlaceholder: document.getElementById("quiz-placeholder"),
  progressBadge: document.getElementById("progress-badge"),
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
  selectedTheme: "mix",
  sessionSize: 10,
  revisionMode: localStorage.getItem("civique-revision") === "1",
  reviewPause: false,
  allQuestions: [],
  themeQuestions: {},
  session: [],
  currentIndex: 0,
  answers: {},
  finished: false,
  history: loadHistory()
  ,
  route: "home"
};

const themesConfig = [
  {
    id: "mix",
    color: "#72c2f0",
    label: { fr: "Mix des thèmes", en: "Mixed themes" },
    short: { fr: "Mix des thèmes", en: "Mixed themes" }
  },
  {
    id: "principles",
    color: "#ff8bf9",
    label: { fr: "Principes et symboles de la République", en: "Principles and Symbols of the Republic" },
    short: { fr: "Principes et symboles", en: "Principles & Symbols" },
    files: {
      fr: "data/themes/principes-et-symboles-de-la-republique.json",
      en: "data/themes/principes-et-symboles-de-la-republique-EN.json"
    }
  },
  {
    id: "institutions",
    color: "#8ed68b",
    label: { fr: "Institutions politiques et démocratie", en: "Political Institutions and Democracy" },
    short: { fr: "Institutions et démocratie", en: "Institutions & Democracy" },
    files: {
      fr: "data/themes/institutions-politiques-et-democratie.json",
      en: "data/themes/institutions-politiques-et-democratie-EN.json"
    }
  },
  {
    id: "history",
    color: "#ffe96f",
    label: { fr: "Histoire de France", en: "History of France" },
    short: { fr: "Histoire de France", en: "History of France" },
    files: {
      fr: "data/themes/histoire-de-france.json",
      en: "data/themes/histoire-de-france-EN.json"
    }
  },
  {
    id: "rights",
    color: "#ff8fa3",
    label: { fr: "Droits et devoirs du citoyen", en: "Rights and Duties of the Citizen" },
    short: { fr: "Droits et devoirs", en: "Rights & Duties" },
    files: {
      fr: "data/themes/droits-et-devoirs-du-citoyen.json",
      en: "data/themes/droits-et-devoirs-du-citoyen-EN.json"
    }
  },
  {
    id: "daily",
    color: "#ffaf6e",
    label: { fr: "Vie quotidienne et intégration en France", en: "Daily Life and Integration in France" },
    short: { fr: "Vie quotidienne", en: "Daily life" },
    files: {
      fr: "data/themes/vie-quotidienne-et-integration-en-france.json",
      en: "data/themes/vie-quotidienne-et-integration-en-france-EN.json"
    }
  },
  {
    id: "geography",
    color: "#94ecd6",
    label: { fr: "Géographie et culture", en: "Geography and Culture" },
    short: { fr: "Géographie & culture", en: "Geography & Culture" },
    files: {
      fr: "data/themes/geographie-et-culture.json",
      en: "data/themes/geographie-et-culture-EN.json"
    }
  }
];

function getThemeById(id) {
  return themesConfig.find((t) => t.id === id) || themesConfig[0];
}

function t(key, ...args) {
  const value = i18n[state.language]?.[key];
  if (typeof value === "function") return value(...args);
  return value ?? key;
}

async function setLanguage(lang) {
  const previousSessionIds = state.session.map((q) => q.id);
  const previousAnswers = { ...state.answers };
  const wasFinished = state.finished;
  state.language = lang === "fr" ? "fr" : "en";
  localStorage.setItem("civique-lang", state.language);
  document.documentElement.lang = state.language;
  setLanguageButtons();
  await loadQuestions();
  // Rebuild current session with the new language dataset if possible
  if (previousSessionIds.length) {
    const byId = new Map(state.allQuestions.map((q) => [q.id, q]));
    state.session = previousSessionIds.map((id) => byId.get(id)).filter(Boolean);
    state.answers = {};
    state.session.forEach((q) => {
      if (previousAnswers[q.id]) state.answers[q.id] = previousAnswers[q.id];
    });
    if (state.currentIndex >= state.session.length) {
      state.currentIndex = 0;
    }
    state.finished = wasFinished && state.session.length > 0;
  }
  syncTexts();
  renderThemeButtons();
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
  const wantsQuizz = route === "quizz";
  const hasSession = state.session.length > 0;
  state.route = wantsQuizz && hasSession ? "quizz" : "home";
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
  try {
    const themeEntries = await Promise.all(
      themesConfig
        .filter((t) => t.id !== "mix")
        .map(async (t) => {
          const file = t.files?.[state.language] || t.files?.fr;
          const res = await fetch(file);
          if (!res.ok) throw new Error("fetch failed");
          const json = await res.json();
          const normalized = normalizeQuestions(json).map((q) => ({
            ...q,
            category: t.label[state.language] || t.label.fr,
            themeId: t.id
          }));
          return { id: t.id, data: normalized };
        })
    );
    const themeMap = {};
    themeEntries.forEach(({ id, data }) => {
      themeMap[id] = data;
    });
    state.themeQuestions = themeMap;
    state.allQuestions = themeEntries.flatMap((e) => e.data);
    elements.dataStatus.textContent = t("dataReady", state.allQuestions.length);
    return;
  } catch (e) {
    // fallback to global JSON or TXT
    const fromJson = await (async () => {
      try {
        const res = await fetch(state.language === "en" ? "data/questions-en.json" : "data/questions.json");
        if (!res.ok) return null;
        const json = await res.json();
        return normalizeQuestions(json);
      } catch (err) {
        return null;
      }
    })();

    if (fromJson) {
      const withIds = attachThemeId(fromJson);
      state.allQuestions = withIds;
      state.themeQuestions = themesConfig
        .filter((t) => t.id !== "mix")
        .reduce((acc, t) => {
          acc[t.id] = withIds.filter((q) => q.themeId === t.id);
          return acc;
        }, {});
      elements.dataStatus.textContent = t("dataReady", state.allQuestions.length);
      return;
    }

    elements.dataStatus.textContent = t("dataError");
    showSnackbar(t("dataError"));
  }
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

function attachThemeId(list) {
  if (!Array.isArray(list)) return list;
  const clean = (str) => (str || "").replace(/^\d+\)\.\s*/, "").trim();
  list.forEach((q) => {
    if (q.themeId) return;
    const found = themesConfig.find((t) => {
      const fr = clean(t.label?.fr);
      const en = clean(t.label?.en);
      const cat = clean(q.category);
      return fr === cat || en === cat;
    });
    if (found) q.themeId = found.id;
  });
  return list;
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
  const pool = getThemePool(state.selectedTheme);
  if (!pool.length) {
    showSnackbar("Aucune question pour ce thème.");
    return;
  }
  if (!getAllowedSizes().includes(state.sessionSize)) {
    state.sessionSize = getAllowedSizes()[0];
  }
  const size = Math.min(state.sessionSize, pool.length);
  state.session = shuffle(pool).slice(0, size);
  state.currentIndex = 0;
  state.answers = {};
  state.finished = false;
  state.reviewPause = false;
  setRoute("quizz");
  renderQuestion();
}

function renderQuestion() {
  elements.quizBody.innerHTML = "";
  elements.quizPlaceholder.textContent = "";
  const quizCard = document.querySelector(".quiz-card");
  if (!state.session.length) {
    if (quizCard) quizCard.classList.add("hidden");
    elements.quizTitle.textContent = "";
    elements.progressBadge.textContent = "";
    elements.nextBtn.disabled = true;
    return;
  } else if (quizCard) {
    quizCard.classList.remove("hidden");
  }

  if (state.finished) {
    renderSummary();
    return;
  }

  const question = state.session[state.currentIndex];
  const total = state.session.length;
  setQuizTitleWithDot(t("questionOf", state.currentIndex + 1, total), question);
  elements.progressBadge.textContent = `${state.currentIndex + 1} / ${total}`;

  const container = document.createElement("div");
  container.className = "question-container";

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
    if (state.reviewPause) {
      btn.disabled = true;
    }
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
      if (state.reviewPause) return;
      state.answers[question.id] = opt.key;
      state.reviewPause = false;
      renderQuestion();
    });
    options.appendChild(btn);
  });

  container.append(progress, title, category, options);

  const feedback = buildRevisionFeedback(question);
  if (feedback) container.append(feedback);

  elements.quizBody.append(container);
  updateNavButtons();
}

function updateNavButtons() {
  if (state.finished) {
    elements.nextLabel.textContent = t("start");
    elements.nextBtn.disabled = false;
  } else {
    elements.nextLabel.textContent = state.currentIndex === state.session.length - 1 ? t("finish") : t("next");
    elements.nextBtn.disabled = !state.session.length;
  }
}

function nextStep() {
  if (!state.session.length || state.finished) return;
  const question = state.session[state.currentIndex];
  if (state.revisionMode && state.reviewPause) {
    state.reviewPause = false;
    if (state.currentIndex === state.session.length - 1) {
      finalizeSession();
    } else {
      state.currentIndex += 1;
      renderQuestion();
    }
    return;
  }
  if (!state.answers[question.id]) {
    showSnackbar(t("selectAnswerPrompt"));
    return;
  }
  const isCorrect = state.answers[question.id].toLowerCase() === question.answerLetter?.toLowerCase();
  if (state.revisionMode && !isCorrect) {
    state.reviewPause = true;
    renderQuestion();
    return;
  }
  if (state.currentIndex === state.session.length - 1) {
    finalizeSession();
  } else {
    state.currentIndex += 1;
    renderQuestion();
  }
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
  state.reviewPause = false;
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
  setQuizTitleWithDot(t("summarySubtitle"));
  elements.progressBadge.textContent = t("scoreOn", score, total);
  updateNavButtons();
}

function buildTooltip(res) {
  const userOpt = res.question.options.find((o) => o.key === res.userAnswer);
  const correctOpt = res.question.options.find((o) => o.key === res.question.answerLetter);
  return `
    <strong>${t("tooltipTitleWrong")}</strong><br/>
    ${res.question.prompt}<br/><br/>
    ${t("tooltipYourAnswer")}: ${userOpt ? userOpt.text : "—"}<br/>
    ${t("tooltipCorrect")}: ${correctOpt ? correctOpt.text : "—"}<br/>
    ${t("tooltipExplanation")}: ${res.explanation || ""}
  `;
}

function buildRevisionFeedback(question) {
  if (!state.revisionMode || !state.reviewPause) return null;
  const userAnswer = state.answers[question.id];
  if (!userAnswer) return null;
  const isCorrect = userAnswer.toLowerCase() === question.answerLetter?.toLowerCase();
  if (isCorrect) return null;
  const wrap = document.createElement("div");
  wrap.className = "revision-feedback";
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = t("tooltipTitleWrong");
  const your = document.createElement("div");
  your.className = "muted";
  const userOpt = question.options.find((o) => o.key === userAnswer);
  your.innerHTML = `<strong>${t("tooltipYourAnswer")}:</strong> ${userOpt ? userOpt.text : "—"}`;
  const correct = document.createElement("div");
  correct.className = "muted";
  const correctOpt = question.options.find((o) => o.key === question.answerLetter);
  correct.innerHTML = `<strong>${t("tooltipCorrect")}:</strong> ${correctOpt ? correctOpt.text : "—"}`;
  const expl = document.createElement("div");
  expl.className = "muted";
  expl.innerHTML = question.explanation || "";
  wrap.append(title, your, correct, expl);
  return wrap;
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
  if (elements.revisionLabel) {
    elements.revisionLabel.textContent = state.language === "fr" ? "Mode fiches de révision" : t("revisionLabel");
  }
  if (elements.revisionToggle) {
    elements.revisionToggle.textContent = state.language === "fr" ? "Mode fiches de révision" : t("revisionLabel");
  }
  elements.startLabel.textContent = t("start");
  const themeLabel = document.getElementById("theme-label");
  const sizeLabel = document.getElementById("size-label");
  if (themeLabel) themeLabel.textContent = state.language === "fr" ? "Thèmes" : "Themes";
  if (sizeLabel) sizeLabel.textContent = state.language === "fr" ? "Nombre de questions" : "Number of questions";
  elements.quizEyebrow.textContent = t("quizEyebrow");
  elements.quizPlaceholder.textContent = t("quizPlaceholder");
  elements.nextLabel.textContent = t("next");
  elements.historyEyebrow.textContent = t("historyEyebrow");
  elements.historyTitle.textContent = t("historyTitle");
  elements.historyPlaceholder.textContent = t("historyEmpty");
}

function setQuizTitleWithDot(text, question) {
  elements.quizTitle.textContent = "";
  if (state.selectedTheme === "mix" && question?.category) {
    const dot = document.createElement("span");
    dot.className = "question-dot header-dot";
    const themeConf =
      (question.themeId && getThemeById(question.themeId)) ||
      themesConfig.find((t) => t.label.fr === question.category || t.label.en === question.category) ||
      themesConfig[0];
    dot.style.background = themeConf.color || themesConfig[0].color;
    elements.quizTitle.appendChild(dot);
  }
  elements.quizTitle.appendChild(document.createTextNode(text || ""));
}

function setActiveSessionButton(size) {
  elements.sessionButtons.forEach((btn) => {
    const value = Number(btn.dataset.size);
    const allowed = getAllowedSizes().includes(value);
    btn.style.display = allowed ? "" : "none";
    btn.classList.toggle("active", value === size && allowed);
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

function renderThemeButtons() {
  if (!elements.themeSelector) return;
  const buttons = Array.from(elements.themeSelector.querySelectorAll(".theme-btn"));
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    const id = btn.dataset.theme || "mix";
    const conf = getThemeById(id);
    const dot = btn.querySelector(".theme-dot");
    if (dot) dot.style.background = conf.color || themesConfig[0].color;
    const label = btn.querySelector("span:last-child");
    if (label) label.textContent = conf.short[state.language] || conf.short.fr;
    btn.classList.toggle("active", state.selectedTheme === id);
  });
}

function getAllowedSizes() {
  return [10, 20, 40];
}

function getThemePool(themeId) {
  if (themeId === "mix") {
    if (state.allQuestions.length) return state.allQuestions;
  }
  if (state.themeQuestions && state.themeQuestions[themeId]) {
    return state.themeQuestions[themeId];
  }
  return state.allQuestions.filter((q) => q.themeId === themeId);
}

function init() {
  setTheme(state.theme);
  setLanguageButtons();
  renderThemeButtons();
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

  if (elements.themeSelector) {
    elements.themeSelector.addEventListener("click", (e) => {
      const btn = e.target.closest(".theme-btn");
      if (!btn) return;
      state.selectedTheme = btn.dataset.theme || "mix";
      renderThemeButtons();
      if (!getAllowedSizes().includes(state.sessionSize)) {
        state.sessionSize = getAllowedSizes()[0];
        setActiveSessionButton(state.sessionSize);
      }
      renderQuestion();
    });
  }

  elements.langFr.addEventListener("click", () => setLanguage("fr"));
  elements.langEn.addEventListener("click", () => setLanguage("en"));
  elements.themeToggle.addEventListener("click", () => setTheme(state.theme === "light" ? "dark" : "light"));
  elements.startBtn.addEventListener("click", startSession);
  if (elements.revisionToggle) {
    const setRevisionUI = () => {
      elements.revisionToggle.classList.toggle("active", state.revisionMode);
      elements.revisionToggle.setAttribute("aria-pressed", state.revisionMode ? "true" : "false");
    };
    setRevisionUI();
    elements.revisionToggle.addEventListener("click", () => {
      state.revisionMode = !state.revisionMode;
      localStorage.setItem("civique-revision", state.revisionMode ? "1" : "0");
      setRevisionUI();
      state.reviewPause = false;
      renderQuestion();
    });
  }
  elements.nextBtn.addEventListener("click", () => {
    if (state.finished) {
      state.finished = false;
      startSession();
    } else {
      nextStep();
    }
  });

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

  renderQuestion();
}

init();
