const ANKI_VERSION = 6;
const STORE_KEY = "anki-study-cockpit-state-v1";
const ANKI_FALLBACK_CARD_LIMIT = 500;

const demoDecks = [
  {
    name: "Demo: Dutch A2",
    cards: [
      {
        id: "demo-nl-1",
        front: "zorgvuldig",
        back: "仔細的；謹慎的",
        phonetic: "zor-kh-vul-dikh",
        example: "Ze leest de brief zorgvuldig voordat ze antwoordt.",
        due: "到期：立即",
        source: "demo",
        lang: "nl-NL",
        tags: ["important"]
      },
      {
        id: "demo-nl-2",
        front: "de afspraak",
        back: "約定；預約",
        phonetic: "af-spraak",
        example: "Ik heb morgen een afspraak bij de tandarts.",
        due: "到期：1 天",
        source: "demo",
        lang: "nl-NL",
        tags: []
      },
      {
        id: "demo-nl-3",
        front: "misschien",
        back: "也許；可能",
        phonetic: "mis-schien",
        example: "Misschien gaan we vanavond naar de markt.",
        due: "到期：2 天",
        source: "demo",
        lang: "nl-NL",
        tags: ["foggy"]
      },
      {
        id: "demo-nl-4",
        front: "onthouden",
        back: "記住",
        phonetic: "ont-hou-den",
        example: "Ik probeer nieuwe woorden hardop te onthouden.",
        due: "到期：3 天",
        source: "demo",
        lang: "nl-NL",
        tags: []
      }
    ]
  },
  {
    name: "Demo: English Vocabulary",
    cards: [
      {
        id: "demo-en-1",
        front: "meticulous",
        back: "一絲不苟的；極其仔細的",
        phonetic: "/məˈtɪkjələs/",
        example: "She is meticulous in checking every detail.",
        due: "到期：立即",
        source: "demo",
        lang: "en-US",
        tags: ["known"]
      },
      {
        id: "demo-en-2",
        front: "benevolent",
        back: "仁慈的；善意的",
        phonetic: "/bəˈnevələnt/",
        example: "The teacher gave a benevolent smile.",
        due: "到期：1 天",
        source: "demo",
        lang: "en-US",
        tags: []
      },
      {
        id: "demo-en-3",
        front: "endeavor",
        back: "努力；嘗試",
        phonetic: "/ɪnˈdevər/",
        example: "Learning a language is a daily endeavor.",
        due: "到期：2 天",
        source: "demo",
        lang: "en-US",
        tags: []
      }
    ]
  }
];

const DUTCH_VOICE_LABEL = "Google Nederlands · nl-NL";
const DUTCH_VOICE_NAME = "Google Nederlands";
const DUTCH_LANG = "nl-NL";

const ratingCopy = {
  1: { label: "Again", minutes: "< 1 分鐘", className: "again" },
  2: { label: "Hard", minutes: "5 分鐘", className: "hard" },
  3: { label: "Good", minutes: "15 分鐘", className: "good" },
  4: { label: "Easy", minutes: "4 天", className: "easy" }
};

const els = {
  body: document.body,
  connectionTitle: document.querySelector("#connection-title"),
  connectionDetail: document.querySelector("#connection-detail"),
  connectionCard: document.querySelector("#connection-card"),
  statusDot: document.querySelector("#status-dot"),
  syncButton: document.querySelector("#sync-button"),
  themeButton: document.querySelector("#theme-button"),
  deckSelect: document.querySelector("#deck-select"),
  reloadDeck: document.querySelector("#reload-deck"),
  progressDone: document.querySelector("#progress-done"),
  progressTotal: document.querySelector("#progress-total"),
  progressBar: document.querySelector("#progress-bar"),
  progressPercent: document.querySelector("#progress-percent"),
  deckNewCount: document.querySelector("#deck-new-count"),
  deckLearnCount: document.querySelector("#deck-learn-count"),
  deckReviewCount: document.querySelector("#deck-review-count"),
  timeRing: document.querySelector("#time-ring"),
  timeLeft: document.querySelector("#time-left"),
  queueCount: document.querySelector("#queue-count"),
  queueList: document.querySelector("#queue-list"),
  queueFilters: document.querySelector(".queue-filters"),
  sortButton: document.querySelector("#sort-button"),
  frontTab: document.querySelector("#front-tab"),
  backTab: document.querySelector("#back-tab"),
  fullscreenButton: document.querySelector("#fullscreen-button"),
  flashcard: document.querySelector("#flashcard"),
  cardType: document.querySelector("#card-type"),
  cardDue: document.querySelector("#card-due"),
  cardFront: document.querySelector("#card-front"),
  cardPhonetic: document.querySelector("#card-phonetic"),
  voiceSelect: document.querySelector("#voice-select"),
  answerInput: document.querySelector("#answer-input"),
  checkAnswer: document.querySelector("#check-answer"),
  listenAnswer: document.querySelector("#listen-answer"),
  hintButton: document.querySelector("#hint-button"),
  answerFeedback: document.querySelector("#answer-feedback"),
  answerBox: document.querySelector("#answer-box"),
  cardBack: document.querySelector("#card-back"),
  cardExample: document.querySelector("#card-example"),
  speakFront: document.querySelector("#speak-front"),
  speakBack: document.querySelector("#speak-back"),
  speakExample: document.querySelector("#speak-example"),
  revealButton: document.querySelector("#reveal-button"),
  skipButton: document.querySelector("#skip-button"),
  ratingButtons: document.querySelectorAll(".rating"),
  sideTabs: document.querySelectorAll(".side-tab"),
  sideSections: document.querySelectorAll(".side-section"),
  noteInput: document.querySelector("#note-input"),
  tagButtons: document.querySelectorAll(".tag-button"),
  saveNote: document.querySelector("#save-note"),
  historyList: document.querySelector("#history-list"),
  aiGenerate: document.querySelector("#ai-generate"),
  aiStatus: document.querySelector("#ai-status"),
  aiContent: document.querySelector("#ai-content"),
  manualForm: document.querySelector("#manual-form"),
  manualFront: document.querySelector("#manual-front"),
  manualBack: document.querySelector("#manual-back"),
  ankiSettingsForm: document.querySelector("#anki-settings-form"),
  ankiSettingsModal: document.querySelector("#anki-settings-modal"),
  ankiApiUrl: document.querySelector("#anki-api-url"),
  ankiApiKey: document.querySelector("#anki-api-key"),
  aiApiUrl: document.querySelector("#ai-api-url"),
  closeAnkiSettings: document.querySelector("#close-anki-settings"),
  settingsModalDismiss: document.querySelectorAll("[data-close-anki-settings]"),
  resetAnkiSettings: document.querySelector("#reset-anki-settings"),
  fileInput: document.querySelector("#file-input"),
  statusLine: document.querySelector("#status-line")
};

const saved = readSavedState();
let lastSettingsTrigger = null;

const state = {
  connected: false,
  dataSource: "demo",
  decks: demoDecks.map((deck) => deck.name),
  localDecks: saved.localDecks || structuredClone(demoDecks),
  selectedDeck: saved.selectedDeck || demoDecks[0].name,
  cards: [],
  currentIndex: saved.currentIndex || 0,
  completed: saved.completed || {},
  notes: saved.notes || {},
  tags: saved.tags || {},
  history: saved.history || [],
  filter: saved.filter || "all",
  sortAsc: saved.sortAsc ?? true,
  revealed: false,
  hintLevel: 0,
  sideTab: saved.sideTab || "notes",
  voiceURI: DUTCH_LANG,
  darkMode: saved.darkMode || false,
  voices: [],
  deckStats: null,
  ankiUrl: saved.ankiUrl || readAnkiUrlParam() || getDefaultAnkiEndpoint(),
  ankiKey: saved.ankiKey || "",
  aiUrl: saved.aiUrl || readAiUrlParam() || getDefaultAiEndpoint(),
  aiHelp: {},
  aiLoading: false,
  aiError: "",
  lastAnkiError: ""
};

if (state.darkMode) {
  document.body.classList.add("dark");
}

bindEvents();
loadVoices();
renderAnkiSettings();
renderSideTab();
connectAndLoad();

function bindEvents() {
  els.connectionCard.addEventListener("click", openAnkiSettings);
  els.closeAnkiSettings.addEventListener("click", closeAnkiSettingsModal);
  els.settingsModalDismiss.forEach((element) => {
    element.addEventListener("click", closeAnkiSettingsModal);
  });
  els.syncButton.addEventListener("click", connectAndLoad);
  els.reloadDeck.addEventListener("click", () => loadSelectedDeck(true));
  els.themeButton.addEventListener("click", toggleTheme);
  els.deckSelect.addEventListener("change", () => {
    state.selectedDeck = els.deckSelect.value;
    state.currentIndex = 0;
    state.revealed = false;
    resetAnswerInput();
    saveState();
    loadSelectedDeck(state.connected);
  });

  els.queueFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter;
    saveState();
    render();
  });

  els.sortButton.addEventListener("click", () => {
    state.sortAsc = !state.sortAsc;
    saveState();
    renderQueue();
  });

  els.queueList.addEventListener("click", (event) => {
    const item = event.target.closest("[data-card-index]");
    if (!item) return;
    state.currentIndex = Number(item.dataset.cardIndex);
    state.revealed = false;
    resetAnswerInput();
    saveState();
    render();
  });

  els.frontTab.addEventListener("click", () => setRevealed(false));
  els.backTab.addEventListener("click", () => setRevealed(true));
  els.revealButton.addEventListener("click", () => setRevealed(true));
  els.skipButton.addEventListener("click", nextCard);
  els.fullscreenButton.addEventListener("click", () => document.body.classList.toggle("focus-mode"));

  els.speakFront.addEventListener("click", () => speakCurrent("front", els.speakFront));
  els.speakBack.addEventListener("click", () => speakCurrent("back", els.speakBack));
  els.speakExample.addEventListener("click", () => speakCurrent("example", els.speakExample));
  els.listenAnswer.addEventListener("click", () => playSpellingAnswer());
  els.hintButton.addEventListener("click", showNextHint);
  els.checkAnswer.addEventListener("click", checkTypedAnswer);
  els.answerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      checkTypedAnswer();
    }
  });
  els.voiceSelect.addEventListener("change", () => {
    state.voiceURI = DUTCH_LANG;
    saveState();
  });

  els.ratingButtons.forEach((button) => {
    button.addEventListener("click", () => gradeCurrentCard(Number(button.dataset.ease)));
  });

  els.sideTabs.forEach((button) => {
    button.addEventListener("click", () => {
      state.sideTab = button.dataset.sideTab;
      saveState();
      renderSideTab();
    });
  });

  els.saveNote.addEventListener("click", saveCurrentNote);
  els.noteInput.addEventListener("input", () => {
    const card = currentCard();
    if (!card) return;
    state.notes[card.id] = els.noteInput.value;
    saveState();
  });

  els.tagButtons.forEach((button) => {
    button.addEventListener("click", () => toggleTag(button.dataset.tag));
  });

  els.aiGenerate.addEventListener("click", generateAiCoach);
  els.manualForm.addEventListener("submit", addManualCard);
  els.fileInput.addEventListener("change", importTextFile);
  els.ankiSettingsForm.addEventListener("submit", saveAnkiSettings);
  els.resetAnkiSettings.addEventListener("click", resetAnkiSettings);

  document.addEventListener("keydown", handleKeyboard);

  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  }
}

async function connectAndLoad() {
  if (!state.ankiUrl) {
    state.connected = false;
    state.dataSource = "demo";
    state.decks = state.localDecks.map((deck) => deck.name);
    setStatus("offline", "請設定 Anki API URL", "AnkiConnect 尚未連線");
    await loadSelectedDeck(false);
    return;
  }

  setStatus("checking", "正在檢查 AnkiConnect", state.ankiUrl);

  try {
    const version = await ankiInvoke("version");
    const decks = await ankiInvoke("deckNames");
    state.connected = true;
    state.dataSource = "anki";
    state.decks = decks.length ? decks : demoDecks.map((deck) => deck.name);
    if (!state.decks.includes(state.selectedDeck)) {
      state.selectedDeck = state.decks[0] || demoDecks[0].name;
    }
    setStatus("connected", "已連線到 AnkiConnect", `版本 ${version} · ${state.ankiUrl}`);
    await loadSelectedDeck(true);
  } catch (error) {
    state.connected = false;
    state.dataSource = "demo";
    state.decks = state.localDecks.map((deck) => deck.name);
    if (!state.decks.includes(state.selectedDeck)) {
      state.selectedDeck = state.decks[0] || demoDecks[0].name;
    }
    state.lastAnkiError = error.message;
    setStatus("offline", "使用示範資料", "AnkiConnect 尚未連線");
    await loadSelectedDeck(false);
  }
}

async function loadSelectedDeck(forceAnki) {
  renderDeckOptions();

  if (state.connected && forceAnki) {
    try {
      const result = await loadAnkiCards(state.selectedDeck);
      state.cards = result.cards;
      state.deckStats = result.stats;
      if (!state.cards.length) {
        state.cards = getLocalDeckCards(state.selectedDeck);
        updateStatusLine("這個牌組目前沒有可載入卡片，暫用示範資料。");
      } else {
        updateStatusLine(formatDeckLoadMessage(state.cards.length, state.deckStats));
      }
    } catch (error) {
      state.cards = getLocalDeckCards(state.selectedDeck);
      state.deckStats = null;
      updateStatusLine(`Anki 讀取失敗，暫用示範資料：${error.message}`);
    }
  } else {
    state.cards = getLocalDeckCards(state.selectedDeck);
    state.deckStats = null;
    updateStatusLine("示範資料已載入。");
  }

  state.currentIndex = clamp(state.currentIndex, 0, Math.max(state.cards.length - 1, 0));
  state.revealed = false;
  resetAnswerInput();
  saveState();
  render();
}

async function loadAnkiCards(deckName) {
  const deckQuery = `deck:${quoteSearch(deckName)}`;
  const stats = await getAnkiDeckStats(deckName);
  const learnIds = limitCards(await findCards(`${deckQuery} is:learn`), stats?.learn_count);
  const reviewIds = limitCards(await findCards(`${deckQuery} is:review is:due`), stats?.review_count);
  const newIds = stats?.new_count ? limitCards(await findCards(`${deckQuery} is:new`), stats.new_count) : [];
  const scheduledIds = [...new Set([...learnIds, ...reviewIds, ...newIds])];
  const ids = scheduledIds.length
    ? scheduledIds
    : limitCards(await findCards(`${deckQuery} is:due`), ANKI_FALLBACK_CARD_LIMIT);

  if (!ids.length) {
    return { cards: [], stats };
  }

  const info = await ankiInvoke("cardsInfo", { cards: ids });
  return {
    cards: info.map(normalizeAnkiCard),
    stats
  };
}

async function getAnkiDeckStats(deckName) {
  try {
    const result = await ankiInvoke("getDeckStats", { decks: [deckName] });
    return Object.values(result).find((deck) => deck.name === deckName) || Object.values(result)[0] || null;
  } catch {
    return null;
  }
}

async function findCards(query) {
  return ankiInvoke("findCards", { query });
}

function limitCards(ids, limit) {
  if (!Number.isFinite(limit)) return ids;
  return ids.slice(0, Math.max(0, limit));
}

function formatDeckLoadMessage(count, stats) {
  if (!stats) {
    return `已載入 ${count} 張 Anki 卡片。`;
  }

  return `已載入 ${count} 張 Anki 待學習卡片（新卡片 ${stats.new_count} / 學習中 ${stats.learn_count} / 已到期 ${stats.review_count}）。`;
}

async function ankiInvoke(action, params = {}) {
  const requestPayload = { action, version: ANKI_VERSION, params };
  if (state.ankiKey) {
    requestPayload.key = state.ankiKey;
  }

  const response = await fetch(state.ankiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestPayload)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const responsePayload = await response.json();
  if (responsePayload.error) {
    throw new Error(responsePayload.error);
  }
  return responsePayload.result;
}

function normalizeAnkiCard(card) {
  const fields = card.fields || {};
  const fieldEntries = Object.entries(fields).map(([name, value]) => ({
    name,
    rawValue: value?.value || "",
    value: stripHtml(value?.value || "")
  }));

  if (isClozeCard(card, fieldEntries)) {
    return normalizeClozeCard(card, fieldEntries);
  }

  const front = pickField(fieldEntries, ["Front", "Word", "Expression", "Term", "Question", "正面", "單字"]) || stripHtml(card.question || "") || "未命名卡片";
  const back = pickField(fieldEntries, ["Back", "Meaning", "Definition", "Answer", "Translation", "背面", "意思"]) || stripHtml(card.answer || "") || "尚無答案";
  const phonetic = pickField(fieldEntries, ["IPA", "Pronunciation", "Phonetic", "發音", "音標"]) || "";
  const example = pickField(fieldEntries, ["Example", "Sentence", "例句"]) || "";

  return {
    id: `anki-${card.cardId}`,
    ankiId: card.cardId,
    noteId: card.note,
    front,
    back,
    phonetic,
    example,
    expectedAnswers: [back],
    speech: {
      front: extractDutchSpeechText(front),
      back: extractDutchSpeechText(back),
      example: extractDutchSpeechText(example)
    },
    due: formatDue(card),
    source: "anki",
    lang: inferCardLanguage(`${front} ${back}`, card.deckName),
    tags: card.note ? state.tags[`anki-${card.cardId}`] || [] : []
  };
}

function normalizeClozeCard(card, fieldEntries) {
  const textField = pickRawField(fieldEntries, ["Text", "文字"]);
  const extra = pickField(fieldEntries, ["Extra", "Back Extra", "背面額外內容", "背面額外内容"]);
  const clozeIndex = Number(card.ord ?? 0) + 1;
  const clozeFront = stripHtml(renderClozeText(textField, clozeIndex, "question"));
  const clozeBack = stripHtml(renderClozeText(textField, clozeIndex, "answer"));
  const expectedAnswers = collectClozeAnswers(textField, clozeIndex);

  return {
    id: `anki-${card.cardId}`,
    ankiId: card.cardId,
    noteId: card.note,
    front: clozeFront || stripHtml(card.question || "") || "未命名克漏字",
    back: clozeBack || stripHtml(card.answer || "") || "尚無答案",
    phonetic: DUTCH_LANG,
    example: extra,
    expectedAnswers,
    speech: {
      front: extractDutchSpeechText(renderClozeText(textField, clozeIndex, "question")),
      back: extractDutchSpeechText(renderClozeText(textField, clozeIndex, "answer")),
      example: extractDutchSpeechText(extra)
    },
    due: formatDue(card),
    source: "anki",
    lang: DUTCH_LANG,
    tags: card.note ? state.tags[`anki-${card.cardId}`] || [] : []
  };
}

function isClozeCard(card, fieldEntries) {
  const modelName = String(card.modelName || "");
  const textField = pickRawField(fieldEntries, ["Text", "文字"]);
  return /cloze|克漏字/i.test(modelName) || /\{\{c\d+::/.test(textField);
}

function pickField(entries, names) {
  const normalizedNames = names.map((name) => name.toLowerCase());
  const exact = entries.find((entry) => normalizedNames.includes(entry.name.toLowerCase()));
  if (exact?.value) return exact.value;
  const fuzzy = entries.find((entry) => normalizedNames.some((name) => entry.name.toLowerCase().includes(name)));
  return fuzzy?.value || "";
}

function pickRawField(entries, names) {
  const normalizedNames = names.map((name) => name.toLowerCase());
  const exact = entries.find((entry) => normalizedNames.includes(entry.name.toLowerCase()));
  if (exact?.rawValue) return exact.rawValue;
  const fuzzy = entries.find((entry) => normalizedNames.some((name) => entry.name.toLowerCase().includes(name)));
  return fuzzy?.rawValue || "";
}

function renderClozeText(input, targetIndex, mode) {
  const text = String(input || "");
  let output = "";
  let index = 0;

  while (index < text.length) {
    const cloze = readClozeAt(text, index);
    if (!cloze) {
      output += text[index];
      index += 1;
      continue;
    }

    if (mode === "question" && cloze.index === targetIndex) {
      output += cloze.hint ? `[${stripHtml(renderClozeText(cloze.hint, targetIndex, mode))}]` : "[...]";
    } else {
      output += renderClozeText(cloze.content, targetIndex, mode);
    }
    index = cloze.end;
  }

  return output;
}

function collectClozeAnswers(input, targetIndex) {
  const text = String(input || "");
  const answers = [];
  let index = 0;

  while (index < text.length) {
    const cloze = readClozeAt(text, index);
    if (!cloze) {
      index += 1;
      continue;
    }

    if (cloze.index === targetIndex) {
      const answer = stripHtml(renderClozeText(cloze.content, targetIndex, "answer"));
      if (answer) answers.push(answer);
    }
    answers.push(...collectClozeAnswers(cloze.content, targetIndex));
    index = cloze.end;
  }

  return [...new Set(answers)];
}

function readClozeAt(text, start) {
  const match = text.slice(start).match(/^\{\{c(\d+)::/);
  if (!match) return null;

  let depth = 1;
  let cursor = start + match[0].length;
  const bodyStart = cursor;

  while (cursor < text.length) {
    if (text.startsWith("{{c", cursor)) {
      depth += 1;
      cursor += 3;
      continue;
    }
    if (text.startsWith("}}", cursor)) {
      depth -= 1;
      if (depth === 0) {
        const body = text.slice(bodyStart, cursor);
        const parts = splitClozeBody(body);
        return {
          index: Number(match[1]),
          content: parts.content,
          hint: parts.hint,
          end: cursor + 2
        };
      }
      cursor += 2;
      continue;
    }
    cursor += 1;
  }

  return null;
}

function splitClozeBody(body) {
  let depth = 0;
  for (let index = 0; index < body.length - 1; index += 1) {
    if (body.startsWith("{{c", index)) {
      depth += 1;
      index += 2;
      continue;
    }
    if (body.startsWith("}}", index)) {
      depth = Math.max(0, depth - 1);
      index += 1;
      continue;
    }
    if (depth === 0 && body.startsWith("::", index)) {
      return {
        content: body.slice(0, index),
        hint: body.slice(index + 2)
      };
    }
  }
  return { content: body, hint: "" };
}

function formatDue(card) {
  if (card.queue === 0) return "新卡";
  if (card.queue === 1 || card.queue === 3) return "學習中";
  if (card.due === 0 || card.queue === 2) return "到期";
  return card.type === 0 ? "新卡" : "複習";
}

function render() {
  renderDeckOptions();
  renderProgress();
  renderDeckStats();
  renderQueue();
  renderCard();
  renderNotes();
  renderAiCoach();
  renderHistory();
}

function renderDeckOptions() {
  els.deckSelect.innerHTML = state.decks.map((deck) => (
    `<option value="${escapeHtml(deck)}"${deck === state.selectedDeck ? " selected" : ""}>${escapeHtml(deck)}</option>`
  )).join("");
}

function renderProgress() {
  const total = state.cards.length;
  const doneCount = state.cards.filter((card) => state.completed[card.id]).length;
  const percent = total ? Math.round((doneCount / total) * 100) : 0;
  const remaining = Math.max(total - doneCount, 0);
  const minutes = Math.max(remaining * 2, 0);

  els.progressDone.textContent = String(doneCount);
  els.progressTotal.textContent = String(total);
  els.progressPercent.textContent = `${percent}%`;
  els.progressBar.style.width = `${percent}%`;
  els.timeRing.textContent = String(minutes);
  els.timeLeft.textContent = `${minutes} 分鐘`;
  els.queueCount.textContent = `${filteredCards().length} 張`;
}

function renderDeckStats() {
  const stats = currentDeckStats();
  els.deckNewCount.textContent = String(stats.new);
  els.deckLearnCount.textContent = String(stats.learn);
  els.deckReviewCount.textContent = String(stats.review);
}

function currentDeckStats() {
  if (state.deckStats) {
    return {
      new: state.deckStats.new_count || 0,
      learn: state.deckStats.learn_count || 0,
      review: state.deckStats.review_count || 0
    };
  }

  return state.cards.reduce((counts, card) => {
    if (card.due === "新卡") counts.new += 1;
    if (card.due === "學習中") counts.learn += 1;
    if (card.due === "到期") counts.review += 1;
    return counts;
  }, { new: 0, learn: 0, review: 0 });
}

function renderQueue() {
  const cards = filteredCards();
  const html = cards.map(({ card, index }, visibleIndex) => {
    const marked = (state.tags[card.id] || card.tags || []).length > 0;
    return `
      <li class="queue-item ${index === state.currentIndex ? "is-active" : ""}">
        <button type="button" data-card-index="${index}" aria-label="切換到 ${escapeHtml(card.front)}">
          <span class="queue-index">${visibleIndex + 1}</span>
          <span>
            <span class="queue-title">${escapeHtml(card.front)}</span>
            <span class="queue-due">${escapeHtml(card.due)}${marked ? " · 已標記" : ""}</span>
          </span>
        </button>
      </li>
    `;
  }).join("");

  els.queueList.innerHTML = html || `<li class="queue-item"><span></span><span class="queue-due">目前沒有卡片</span></li>`;

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === state.filter);
  });
}

function renderCard() {
  const card = currentCard();
  const hasCard = Boolean(card);

  [els.revealButton, els.skipButton, els.speakFront, els.speakBack, els.speakExample, els.checkAnswer, els.listenAnswer, els.hintButton, ...els.ratingButtons].forEach((button) => {
    button.disabled = !hasCard;
  });
  els.answerInput.disabled = !hasCard;

  if (!card) {
    els.cardType.textContent = "學習卡";
    els.cardDue.textContent = "空";
    els.cardFront.textContent = "沒有卡片";
    els.cardPhonetic.textContent = "";
    els.cardBack.textContent = "請新增或匯入卡片";
    els.cardExample.textContent = "";
    els.answerInput.value = "";
    els.answerFeedback.textContent = "沒有可練習的卡片。";
    renderHintControls(card);
    return;
  }

  els.cardType.textContent = card.source === "anki" ? "Anki 卡" : "示範卡";
  els.cardDue.textContent = card.due || "待複習";
  els.cardFront.textContent = card.front;
  els.cardPhonetic.textContent = card.phonetic || card.lang || "";
  els.cardBack.textContent = state.revealed ? card.back : "按下顯示答案";
  els.cardExample.textContent = state.revealed ? card.example || "這張卡沒有例句。" : "顯示答案後會出現例句。";
  els.answerInput.placeholder = card.expectedAnswers?.length ? "typ het ontbrekende woord" : "typ het antwoord";
  renderVoiceOptions();
  renderHintControls(card);

  els.answerBox.classList.toggle("is-hidden", !state.revealed);
  document.querySelector(".example-box").classList.toggle("is-hidden", !state.revealed);
  els.frontTab.classList.toggle("is-active", !state.revealed);
  els.backTab.classList.toggle("is-active", state.revealed);
  els.revealButton.querySelector("span").textContent = state.revealed ? "答案已顯示" : "顯示答案";
  if (state.revealed && !els.answerFeedback.dataset.checked) {
    const answers = answerList(card);
    els.answerFeedback.textContent = answers.length ? `答案：${answers.join(" / ")}` : "答案已顯示。";
  }
}

function renderNotes() {
  const card = currentCard();
  els.noteInput.value = card ? state.notes[card.id] || "" : "";

  const tags = card ? new Set([...(card.tags || []), ...(state.tags[card.id] || [])]) : new Set();
  els.tagButtons.forEach((button) => {
    button.classList.toggle("is-active", tags.has(button.dataset.tag));
  });
}

function renderAiCoach() {
  const card = currentCard();
  const content = card ? state.aiHelp[card.id] || "" : "";

  els.aiGenerate.disabled = !card || state.aiLoading || !state.aiUrl;
  els.aiGenerate.textContent = state.aiLoading ? "產生中..." : content ? "重新講解" : "講解這張";
  els.aiContent.textContent = content;
  els.aiStatus.className = "ai-status";

  if (!card) {
    els.aiStatus.textContent = "沒有可講解的卡片。";
  } else if (!state.aiUrl) {
    els.aiStatus.textContent = "請先在連線設定填入 AI API URL。";
  } else if (state.aiLoading) {
    els.aiStatus.textContent = "AI 正在整理這張卡。";
  } else if (state.aiError) {
    els.aiStatus.textContent = `AI 講解失敗：${state.aiError}`;
    els.aiStatus.classList.add("is-error");
  } else if (content) {
    els.aiStatus.textContent = "已產生這張卡的學習講解。";
  } else {
    els.aiStatus.textContent = "按下講解這張，產生意思、例句與發音提示。";
  }
}

function renderHistory() {
  const recent = state.history.slice(0, 7);
  els.historyList.innerHTML = recent.map((item) => `
    <li>
      <span><strong>${escapeHtml(item.front)}</strong><br>${escapeHtml(item.grade)}</span>
      <time>${escapeHtml(item.when)}</time>
    </li>
  `).join("") || `<li><span>尚無記錄</span><time></time></li>`;
}

function renderSideTab() {
  els.sideTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sideTab === state.sideTab);
  });

  els.sideSections.forEach((section) => {
    const expected = `${state.sideTab}-panel`;
    section.classList.toggle("is-active", section.id === expected);
  });
}

function renderAnkiSettings() {
  els.ankiApiUrl.value = state.ankiUrl;
  els.ankiApiKey.value = state.ankiKey;
  els.aiApiUrl.value = state.aiUrl;
}

function openAnkiSettings() {
  lastSettingsTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : els.connectionCard;
  renderAnkiSettings();
  els.ankiSettingsModal.hidden = false;
  document.body.classList.add("modal-open");
  updateStatusLine("請填入 Anki API URL；儲存後會自動重新連線。");

  window.requestAnimationFrame(() => {
    els.ankiApiUrl.focus();
    els.ankiApiUrl.select();
  });
}

function closeAnkiSettingsModal() {
  if (els.ankiSettingsModal.hidden) return;
  els.ankiSettingsModal.hidden = true;
  document.body.classList.remove("modal-open");

  if (lastSettingsTrigger && document.contains(lastSettingsTrigger)) {
    lastSettingsTrigger.focus();
  }
}

function filteredCards() {
  const cards = state.cards.map((card, index) => ({ card, index }));
  const filtered = cards.filter(({ card }) => {
    if (state.filter === "marked") {
      return [...(card.tags || []), ...(state.tags[card.id] || [])].length > 0;
    }
    if (state.filter === "due") {
      return /立即|到期|學習|新卡|due/i.test(card.due);
    }
    return true;
  });

  return filtered.sort((a, b) => {
    if (state.sortAsc) return a.index - b.index;
    return b.index - a.index;
  });
}

function currentCard() {
  return state.cards[state.currentIndex] || null;
}

function setRevealed(value) {
  const shouldReadFullAnswer = value && !state.revealed;
  state.revealed = value;
  renderCard();
  if (shouldReadFullAnswer) {
    speakCurrent("back", els.speakBack);
  }
}

function nextCard() {
  if (!state.cards.length) return;
  state.currentIndex = (state.currentIndex + 1) % state.cards.length;
  state.revealed = false;
  resetAnswerInput();
  saveState();
  render();
}

function resetAnswerInput() {
  if (!els.answerInput || !els.answerFeedback) return;
  els.answerInput.value = "";
  els.answerFeedback.textContent = "先聽答案或輸入缺字；需要時可以用提示。";
  delete els.answerFeedback.dataset.checked;
  els.answerFeedback.className = "";
  state.hintLevel = 0;
  state.aiError = "";
  renderHintControls(currentCard());
}

function checkTypedAnswer() {
  const card = currentCard();
  if (!card) return;

  const typed = normalizeAnswer(els.answerInput.value);
  const answers = answerList(card);
  const normalizedAnswers = answers.map(normalizeAnswer).filter(Boolean);
  delete els.answerFeedback.dataset.checked;

  if (!typed) {
    els.answerFeedback.textContent = "先輸入答案。";
    els.answerFeedback.className = "is-warn";
    return;
  }

  const correct = normalizedAnswers.length
    ? normalizedAnswers.every((answer) => typed === answer || typed.includes(answer))
    : false;

  els.answerFeedback.dataset.checked = "true";
  if (correct && !state.revealed) {
    setRevealed(true);
  }
  els.answerFeedback.className = correct ? "is-correct" : "is-wrong";
  els.answerFeedback.textContent = correct
    ? "答對了。"
    : "還差一點，再聽一次或用下一段提示。";
}

function answerList(card) {
  return (card.expectedAnswers?.length ? card.expectedAnswers : [card.back])
    .map((answer) => stripHtml(answer))
    .filter(Boolean);
}

function renderHintControls(card) {
  const answer = primarySpellingAnswer(card);
  const speechText = answer ? extractDutchSpeechText(answer) : "";

  els.listenAnswer.disabled = !card || !speechText;
  els.hintButton.disabled = !card || !answer || state.revealed;
  els.hintButton.textContent = state.hintLevel >= 3 ? "再聽一次" : `提示 ${state.hintLevel + 1}`;
}

function showNextHint() {
  const card = currentCard();
  const answer = primarySpellingAnswer(card);
  if (!card || state.revealed || !answer) return;

  delete els.answerFeedback.dataset.checked;
  els.answerFeedback.className = "";
  state.hintLevel = Math.min(state.hintLevel + 1, 3);

  if (state.hintLevel === 1) {
    const first = firstAnswerLetter(answer);
    els.answerFeedback.textContent = first ? `提示 1：開頭是 ${first}` : "提示 1：這題沒有文字答案。";
  } else if (state.hintLevel === 2) {
    els.answerFeedback.textContent = `提示 2：${formatAnswerShape(answer)}`;
  } else {
    const played = playSpellingAnswer({ updateFeedback: false });
    els.answerFeedback.textContent = played ? "提示 3：已播放答案發音。" : "提示 3：這題沒有可播放的荷蘭發音。";
    els.answerFeedback.className = played ? "" : "is-warn";
  }

  renderHintControls(card);
}

function playSpellingAnswer(options = {}) {
  const { updateFeedback = true } = options;
  const card = currentCard();
  const answer = primarySpellingAnswer(card);
  const text = answer ? extractDutchSpeechText(answer) : "";

  if (!card || !text) {
    if (updateFeedback) {
      delete els.answerFeedback.dataset.checked;
      els.answerFeedback.className = "is-warn";
      els.answerFeedback.textContent = "這題沒有可播放的荷蘭發音。";
    }
    return false;
  }

  speak(text, card.lang, els.listenAnswer);
  if (updateFeedback) {
    delete els.answerFeedback.dataset.checked;
    els.answerFeedback.className = "";
    els.answerFeedback.textContent = "已播放缺字發音，試著拼出來。";
  }
  return true;
}

function primarySpellingAnswer(card) {
  if (!card) return "";
  const answers = answerList(card);
  return answers.find((answer) => extractDutchSpeechText(answer)) || answers[0] || "";
}

function firstAnswerLetter(answer) {
  return Array.from(answer.trim()).find((char) => /[\p{L}\p{N}]/u.test(char)) || "";
}

function formatAnswerShape(answer) {
  let hasShownFirst = false;
  return Array.from(answer.trim())
    .map((char) => {
      if (/[\p{L}\p{N}]/u.test(char)) {
        if (!hasShownFirst) {
          hasShownFirst = true;
          return char;
        }
        return "_";
      }
      if (/\s/u.test(char)) return " / ";
      return char;
    })
    .join(" ")
    .replace(/\s+\/\s+/g, " / ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeAnswer(value) {
  return stripHtml(value)
    .toLocaleLowerCase("nl-NL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function gradeCurrentCard(ease) {
  const card = currentCard();
  if (!card) return;

  if (!state.revealed) {
    setRevealed(true);
    return;
  }

  const rating = ratingCopy[ease];
  state.completed[card.id] = { ease, at: Date.now() };
  state.history.unshift({
    id: card.id,
    front: card.front,
    grade: rating.label,
    when: new Intl.DateTimeFormat("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date())
  });
  state.history = state.history.slice(0, 40);

  if (state.connected && card.ankiId) {
    try {
      await ankiInvoke("answerCards", {
        answers: [{ cardId: Number(card.ankiId), ease }]
      });
      updateStatusLine(`已送出 ${rating.label} 到 Anki。`);
    } catch (error) {
      updateStatusLine(`本機已記錄 ${rating.label}。Anki 評分未寫入：${error.message}`);
    }
  } else {
    updateStatusLine(`本機已記錄 ${rating.label}。`);
  }

  saveState();
  nextCard();
}

function saveCurrentNote() {
  const card = currentCard();
  if (!card) return;
  state.notes[card.id] = els.noteInput.value;
  saveState();
  updateStatusLine("筆記已儲存。");
}

async function generateAiCoach() {
  const card = currentCard();
  if (!card || state.aiLoading) return;

  state.sideTab = "ai";
  state.aiLoading = true;
  state.aiError = "";
  saveState();
  renderSideTab();
  renderAiCoach();

  try {
    const text = await aiInvoke(card);
    state.aiHelp[card.id] = text;
    state.aiError = "";
    updateStatusLine("AI 講解已產生。");
  } catch (error) {
    state.aiError = error.message;
    updateStatusLine(`AI 講解失敗：${error.message}`);
  } finally {
    state.aiLoading = false;
    renderAiCoach();
  }
}

async function aiInvoke(card) {
  const prompt = buildAiPrompt(card);
  const payload = {
    messages: [
      {
        role: "system",
        content: "你是荷蘭語 A2/B1 詞彙教練。用繁體中文教學，荷蘭文保留原文。回答要精準、實用、可直接拿來複習。"
      },
      { role: "user", content: prompt }
    ],
    temperature: 0.35
  };

  let response = await postAiPayload(payload);
  if (!response.ok && [400, 404, 422].includes(response.status)) {
    response = await postAiPayload({ prompt, temperature: 0.35 });
  }

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(responseText || `HTTP ${response.status}`);
  }

  const parsed = parseAiResponse(responseText);
  const text = extractAiText(parsed);
  if (!text) {
    throw new Error("AI 回傳格式沒有可顯示的文字。");
  }
  return text.trim();
}

function postAiPayload(payload) {
  return fetch(state.aiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

function buildAiPrompt(card) {
  const target = targetWordForAi(card);
  const fullSentence = card.speech?.back || extractDutchSpeechText(card.back) || card.back;
  const meaning = stripHtml(card.back || "");
  const example = stripHtml(card.example || "");
  const answers = answerList(card).join(" / ");

  return `請針對這張 Anki 卡教我真的學會這個荷蘭語單字或片語。

目標：${target}
題目：${stripHtml(card.front)}
答案：${answers || meaning}
完整句：${fullSentence}
補充：${example || "無"}

請固定用以下段落，總長控制在 500 字以內：
1. 核心意思：用繁體中文講清楚，不要只翻譯。
2. 怎麼用：說明常見搭配、語感、容易混淆的點。
3. 發音：用台灣學習者看得懂的方式拆音，並標出重音或容易錯的音。
4. 例句：給 2 句 A2/B1 荷蘭文例句，每句附繁中翻譯。
5. 記憶鉤子：給一個短短的記憶法。
6. 小練習：給一題填空題，不要立刻給答案。`;
}

function targetWordForAi(card) {
  const answers = answerList(card);
  const dutchAnswer = answers.find((answer) => extractDutchSpeechText(answer));
  return dutchAnswer || extractDutchSpeechText(card.front) || answers[0] || stripHtml(card.front);
}

function parseAiResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractAiText(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value.output_text === "string") return value.output_text;
  if (typeof value.text === "string") return value.text;
  if (typeof value.content === "string") return value.content;
  if (typeof value.message === "string") return value.message;
  if (typeof value.result === "string") return value.result;
  if (value.result) return extractAiText(value.result);

  const choice = value.choices?.[0];
  if (choice?.message?.content) return extractAiText(choice.message.content);
  if (choice?.text) return extractAiText(choice.text);

  const output = value.output?.[0]?.content?.[0];
  if (output?.text) return output.text;

  return "";
}

function saveAnkiSettings(event) {
  event.preventDefault();
  state.ankiUrl = normalizeAnkiUrl(els.ankiApiUrl.value);
  state.ankiKey = els.ankiApiKey.value.trim();
  state.aiUrl = normalizeApiUrl(els.aiApiUrl.value);
  state.currentIndex = 0;
  state.revealed = false;
  saveState();
  renderAnkiSettings();
  closeAnkiSettingsModal();
  connectAndLoad();
}

function resetAnkiSettings() {
  state.ankiUrl = getDefaultAnkiEndpoint();
  state.ankiKey = "";
  state.aiUrl = getDefaultAiEndpoint();
  state.currentIndex = 0;
  state.revealed = false;
  saveState();
  renderAnkiSettings();
  connectAndLoad();
}

function normalizeAnkiUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

function normalizeApiUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

async function toggleTag(tag) {
  const card = currentCard();
  if (!card) return;

  const tags = new Set(state.tags[card.id] || card.tags || []);
  if (tags.has(tag)) {
    tags.delete(tag);
  } else {
    tags.add(tag);
  }
  state.tags[card.id] = [...tags];
  saveState();
  renderNotes();
  renderQueue();

  if (state.connected && card.noteId && tags.has(tag)) {
    try {
      await ankiInvoke("addTags", { notes: [Number(card.noteId)], tags: `study-cockpit-${tag}` });
      updateStatusLine(`已同步標籤：${tag}`);
    } catch (error) {
      updateStatusLine(`標籤已存在本機。Anki 同步失敗：${error.message}`);
    }
  } else {
    updateStatusLine(`標籤已更新：${tag}`);
  }
}

async function addManualCard(event) {
  event.preventDefault();
  const front = els.manualFront.value.trim();
  const back = els.manualBack.value.trim();
  if (!front || !back) {
    updateStatusLine("正面與背面都需要內容。");
    return;
  }

  const card = {
    id: `local-${Date.now()}`,
    front,
    back,
    phonetic: "",
    example: "",
    due: "新卡",
    source: state.connected ? "anki" : "local",
    lang: inferCardLanguage(front, state.selectedDeck),
    tags: []
  };

  if (state.connected && !state.selectedDeck.startsWith("Demo:")) {
    try {
      const noteId = await ankiInvoke("addNote", {
        note: {
          deckName: state.selectedDeck,
          modelName: "Basic",
          fields: { Front: front, Back: back },
          tags: ["study-cockpit"]
        }
      });
      card.noteId = noteId;
      card.id = `anki-new-${noteId}`;
      updateStatusLine("已新增到 Anki。");
    } catch (error) {
      updateStatusLine(`已新增到本機。Anki 新增失敗：${error.message}`);
    }
  } else {
    updateStatusLine("已新增到本機。");
  }

  addCardsToLocalDeck(state.selectedDeck, [card]);
  state.cards.unshift(card);
  state.currentIndex = 0;
  state.revealed = false;
  els.manualFront.value = "";
  els.manualBack.value = "";
  resetAnswerInput();
  saveState();
  render();
}

async function importTextFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const text = await file.text();
  const cards = parseCardsFromText(text);
  if (!cards.length) {
    updateStatusLine("沒有讀到可匯入的卡片。");
    return;
  }

  addCardsToLocalDeck(state.selectedDeck, cards);
  state.cards = [...cards, ...state.cards];
  state.currentIndex = 0;
  state.revealed = false;
  resetAnswerInput();
  saveState();
  render();
  updateStatusLine(`已匯入 ${cards.length} 張卡片。`);
  event.target.value = "";
}

function parseCardsFromText(text) {
  return text.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const parts = splitCardLine(line);
      if (parts.length < 2) return null;
      return {
        id: `import-${Date.now()}-${index}`,
        front: parts[0],
        back: parts[1],
        phonetic: parts[2] || "",
        example: parts[3] || "",
        due: "新卡",
        source: "local",
        lang: inferCardLanguage(parts[0], state.selectedDeck),
        tags: []
      };
    })
    .filter(Boolean);
}

function splitCardLine(line) {
  if (line.includes("\t")) return line.split("\t").map((part) => part.trim());
  if (line.includes(",")) return parseCsvLine(line);
  if (line.includes(" - ")) return line.split(" - ").map((part) => part.trim());
  return [];
}

function parseCsvLine(line) {
  const parts = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      parts.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  parts.push(current.trim());
  return parts;
}

function addCardsToLocalDeck(deckName, cards) {
  let deck = state.localDecks.find((item) => item.name === deckName);
  if (!deck) {
    deck = { name: deckName, cards: [] };
    state.localDecks.push(deck);
  }
  deck.cards.unshift(...cards);
}

function getLocalDeckCards(deckName) {
  const deck = state.localDecks.find((item) => item.name === deckName) || state.localDecks[0];
  return structuredClone(deck?.cards || []);
}

function speakCurrent(field, activeButton = els.speakFront) {
  const card = currentCard();
  if (!card || !("speechSynthesis" in window)) return;

  const text = {
    front: card.speech?.front || card.front,
    back: card.speech?.back || card.back,
    example: card.speech?.example || card.example
  }[field];

  speak(text || card.front, card.lang, activeButton);
}

function speak(text, fallbackLang, activeButton = els.speakFront) {
  const cleanText = extractDutchSpeechText(text);
  if (!cleanText || !("speechSynthesis" in window)) {
    updateStatusLine("沒有可朗讀的荷蘭文內容。");
    return;
  }

  window.speechSynthesis.cancel();
  [els.speakFront, els.speakBack, els.speakExample, els.listenAnswer].forEach((button) => {
    button.classList.remove("is-speaking");
  });

  const utterance = new SpeechSynthesisUtterance(cleanText);
  const voice = bestDutchVoice();
  if (voice) {
    utterance.voice = voice;
  }
  utterance.lang = DUTCH_LANG;
  utterance.rate = 0.86;
  utterance.pitch = 1;

  activeButton.classList.add("is-speaking");
  utterance.onend = () => activeButton.classList.remove("is-speaking");
  utterance.onerror = () => activeButton.classList.remove("is-speaking");

  window.speechSynthesis.speak(utterance);
}

function loadVoices() {
  if (!("speechSynthesis" in window)) {
    els.voiceSelect.innerHTML = `<option>Speech unavailable</option>`;
    els.voiceSelect.disabled = true;
    return;
  }

  state.voices = window.speechSynthesis.getVoices();
  renderVoiceOptions();
}

function renderVoiceOptions() {
  state.voiceURI = DUTCH_LANG;
  els.voiceSelect.innerHTML = `<option value="${DUTCH_LANG}" selected>${DUTCH_VOICE_LABEL}</option>`;
  els.voiceSelect.disabled = false;
}

function bestDutchVoice() {
  return state.voices.find((voice) => voice.name === DUTCH_VOICE_NAME && voice.lang === DUTCH_LANG)
    || state.voices.find((voice) => voice.lang === DUTCH_LANG)
    || state.voices.find((voice) => voice.lang.toLowerCase().startsWith("nl"))
    || state.voices[0]
    || null;
}

function handleKeyboard(event) {
  if (!els.ankiSettingsModal.hidden) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAnkiSettingsModal();
    }
    return;
  }

  const target = event.target;
  const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;
  if (isTyping) return;

  if (event.key === " ") {
    event.preventDefault();
    setRevealed(!state.revealed);
  }
  if (event.key === "ArrowRight") nextCard();
  if (event.key >= "1" && event.key <= "4") {
    gradeCurrentCard(Number(event.key));
  }
}

function toggleTheme() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle("dark", state.darkMode);
  saveState();
}

function setStatus(mode, title, detail) {
  els.connectionTitle.textContent = title;
  els.connectionDetail.textContent = detail;
  els.statusDot.classList.toggle("connected", mode === "connected");
  els.statusDot.classList.toggle("offline", mode === "offline");
  updateStatusLine(detail);
}

function updateStatusLine(message) {
  els.statusLine.textContent = message;
}

function getDefaultAnkiEndpoint() {
  const localHosts = new Set(["", "localhost", "127.0.0.1", "::1"]);
  return localHosts.has(window.location.hostname) ? "http://127.0.0.1:8765" : "";
}

function getDefaultAiEndpoint() {
  return window.location.origin ? `${window.location.origin}/api/cli-proxy` : "/api/cli-proxy";
}

function readAnkiUrlParam() {
  const value = new URLSearchParams(window.location.search).get("ankiUrl");
  return value ? normalizeAnkiUrl(value) : "";
}

function readAiUrlParam() {
  const value = new URLSearchParams(window.location.search).get("aiUrl");
  return value ? normalizeApiUrl(value) : "";
}

function quoteSearch(value) {
  return `"${String(value).replaceAll('"', '\\"')}"`;
}

function inferLanguage(text) {
  if (/[\u4e00-\u9fff]/.test(text)) return "zh-TW";
  if (/[äöüß]|\b(het|de|een|zijn|niet|voor|van|ik|jij|wij)\b/i.test(text)) return "nl-NL";
  if (/[\u3040-\u30ff]/.test(text)) return "ja-JP";
  return "en-US";
}

function inferCardLanguage(text, deckName = "") {
  if (/dutch|nederlands|nl\b/i.test(deckName)) return "nl-NL";
  if (/english|toeic|ielts|toefl|en\b/i.test(deckName)) return "en-US";
  return inferLanguage(text);
}

function stripHtml(value) {
  const withoutCode = String(value)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/\[\[type:[^\]]+\]\]/gi, " ");
  const template = document.createElement("template");
  template.innerHTML = withoutCode
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(div|p|li|tr|h[1-6])>/gi, "\n");
  return (template.content.textContent || "").replace(/\s+/g, " ").trim();
}

function extractDutchSpeechText(value) {
  const text = stripHtml(value)
    .replace(/\[\.\.\.\]|\[[^\]]+\]/g, " ");
  const beforeChinese = text.split(/[\u3400-\u9fff]/)[0] || text;
  const beforeGloss = beforeChinese.split(/\s[\/／|｜]\s/)[0] || beforeChinese;
  const beforeMeta = beforeGloss.split(/\s+\(/)[0] || beforeGloss;
  return beforeMeta
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^A-Za-zÀ-ÖØ-öø-ÿ'’.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function readSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveState() {
  const payload = {
    selectedDeck: state.selectedDeck,
    localDecks: state.localDecks,
    currentIndex: state.currentIndex,
    completed: state.completed,
    notes: state.notes,
    tags: state.tags,
    history: state.history,
    filter: state.filter,
    sortAsc: state.sortAsc,
    sideTab: state.sideTab,
    voiceURI: DUTCH_LANG,
    darkMode: state.darkMode,
    ankiUrl: state.ankiUrl,
    ankiKey: state.ankiKey,
    aiUrl: state.aiUrl
  };
  localStorage.setItem(STORE_KEY, JSON.stringify(payload));
}
