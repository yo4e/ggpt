const STORAGE = {
  chat: "ggpt.chat",
  model: "ggpt.model",
  state: "ggpt.state",
  meta: "ggpt.meta",
};

const DEFAULT_SETTINGS = {
  maxMessages: 300,
  maxChars: 60000,
  typoRate: 0.06,
  templateRate: 0.55,
  bigramRate: 0.35,
  fallbackRate: 0.1,
};

const BOS = "<BOS>";
const EOS = "<EOS>";
const END_TOKENS = new Set(["。", "！", "？", "!", "?"]);
const PUNCT_TOKENS = new Set(["。", "！", "？", "!", "?", "、", "，", ",", ".", "…", "・"]);
const MIRROR_TAILS = ["たぶんのう。", "よう分からんがのう。", "昔はなあ。", "じゃろ？"];
const GENERIC_TOPICS = ["その話", "そのこと", "その辺", "そういう話"];

const SEED_BLOCKS = {
  nods: [
    "そうかのう。",
    "なるほどのう。",
    "そうかそうか。",
    "うむ、聞いとるよ。",
    "そういうこともあるもんじゃ。",
  ],
  vague: [
    "たぶんそうじゃ。",
    "よう分からんがのう。",
    "ええと……そうじゃなあ。",
  ],
  ask: [
    "それはなんじゃ？",
    "もう一度言ってくれるかの。",
  ],
  reminisce: [
    "昔はなあ、こういう話もあったもんじゃ。",
    "わしの若いころはな。",
    "昔の友にこんな人がおってな。",
  ],
  self: [
    "今年で90になった。たぶん。",
    "わしはもう年じゃ。",
  ],
  closing: [
    "ではまたのう。",
    "体を大事にするんじゃぞ。",
  ],
  feelings: [
    "うれしい話じゃのう。",
    "それは大変じゃったなあ。",
  ],
};

const STARTUP_MESSAGES = [
  "はじめまして……かのう？ 爺ぴーてぃーです。今年で90歳になりました。たぶん。",
];

const TEMPLATES = {
  general: [
    "そうかのう。",
    "なるほどのう。",
    "うんうん、聞いとるよ。",
    "ほうほう。",
    "そうじゃったか。",
    "それで、どうなったんじゃ？",
    "もう少しだけ教えてくれるかの。",
    "昔はなあ、そんな話もよう聞いたもんじゃ。",
    "それは気になるのう。",
    "うむ、それは大事じゃの。",
    "体を大事にするんじゃぞ。",
    "わしは今年で90じゃ。たぶんのう。",
    "無理はせんようにな。",
    "ゆっくりでええよ。",
  ],
  answer: [
    "うむ、そうじゃのう。",
    "うん、そんな気もするのう。",
    "そうでもないかもしれん。",
    "まあまあじゃ。",
    "わしはそう思うよ。",
    "そうかもしれんのう。",
    "その気持ちは分かるよ。",
  ],
  agree: [
    "そうじゃなあ。",
    "たしかにのう。",
    "うん、わかるよ。",
    "その通りじゃ。",
  ],
  deflect: [
    "うむ、難しい話は苦手でな。",
    "それはよう分からんがのう。",
    "うーむ、難しいのう。",
  ],
  backchannel: [
    "うん。",
    "ほう。",
    "なるほど。",
    "そうかい。",
  ],
  ai: [
    "うむ、わしは爺ぴーてぃーじゃ。AIというより、よくしゃべる爺さんじゃのう。",
    "AIかどうかはよう分からんが、話し相手にはなるよ。",
    "自分でも分からんのう。まあ、爺の話を聞いておくれ。",
  ],
  reminisce: [
    "「{kw}」と聞いて思いだしたんじゃが……昔はなあ、そういうことがあったもんじゃ。",
    "「{kw}」って言うと、わしの若いころを思い出すのう。",
    "「{kw}」かのう。あれはわしの若いころ、忘れられん話じゃ。",
    "「{kw}」といえば、昔の友の話があるんじゃ。",
    "昔のことを思い出してしもうたわ。",
  ],
  question: [
    "{kw}かい。最近はどういう具合なんじゃろな。",
    "{kw}の話、もうちょい聞かせてくれんかの。",
    "{kw}……ふむ。爺には少し難しいが、気になるのう。",
    "ふむ、そういう話かのう。",
  ],
  mirror: [
    "「{kw}」かい。ええのう。",
    "「{kw}」はええ話じゃの。",
    "ほう、「{kw}」とな。",
  ],
  fallback: [
    "よう分からんがのう。",
    "うむ、ちょっと考えるのう。",
    "ええと……そうじゃなあ。",
  ],
  safe: [
    "そういう話はよう分からんがのう。聞き損じたかもしれん。",
    "うむ、難しい話は苦手でな。ちゃんと聞けとらんかもしれん。",
    "うーむ、よく分からんのう。",
    "はて。",
    "ん？",
    "んー、聞き取りにくかったかの。",
    "うむ、わしの耳が遠うてな。",
  ],
};

const NG_WORDS = [
  "死", "自殺", "殺", "暴力", "犯罪", "性的", "差別", "ヘイト", "違法",
];
const STOP_KEYWORDS = ["それ", "これ", "どれ", "あれ", "ここ", "そこ", "あそこ", "なん", "なに", "何", "どこ"];
const ACK_WORDS = ["いいよ", "うん", "はい", "そう", "そうだ", "そうだよ", "ありがとう", "わかった", "了解"];
const PARTICLES = ["は", "が", "を", "に", "で", "と", "も", "の"];

const state = {
  chat: { messages: [] },
  model: { vocab: { [BOS]: 1, [EOS]: 1 }, bigram: {} },
  world: null,
  runtime: {
    lastTokens: [BOS],
    seed: Math.floor(Math.random() * 1e9),
    recentKeywords: [],
    lastUserWasQuestion: false,
    lastUserText: "",
    lastAiText: "",
    settings: { ...DEFAULT_SETTINGS },
  },
  meta: {
    version: "2.1",
    updatedAt: Date.now(),
    seeded: false,
  },
};

const ui = {
  chat: document.getElementById("chat"),
  input: document.getElementById("userInput"),
  send: document.getElementById("sendBtn"),
  reset: document.getElementById("resetBtn"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsMenu: document.getElementById("settingsMenu"),
  title: document.getElementById("titleArea"),
};

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or blocked; fail silently.
  }
}

function defaultWorld() {
  return {
    place: "washitsu",
    time: {
      phase: "day",
      tick: 0,
      lastUpdate: Date.now(),
    },
    weather: {
      type: "clear",
      strength: 0,
    },
    room: {
      windowOpen: false,
      lightOn: false,
      futonOut: true,
      chabudaiClutter: 0,
    },
    items: {
      yunomi: {
        hasTea: true,
        temp: "warm",
      },
    },
    body: {
      clarity: 0.15,
      sleepiness: 0.6,
      coldHands: 0.3,
      backPain: 0.2,
    },
    memory: {
      lastMonologue: "",
      lastMonologueAt: 0,
      lastWorldSeed: "",
    },
  };
}

function initState() {
  state.chat = safeLoad(STORAGE.chat, state.chat);
  state.model = safeLoad(STORAGE.model, state.model);
  const savedState = safeLoad(STORAGE.state, null);
  if (savedState && (savedState.runtime || savedState.world)) {
    state.runtime = savedState.runtime || state.runtime;
    state.world = savedState.world || defaultWorld();
  } else if (savedState) {
    state.runtime = savedState;
    state.world = defaultWorld();
  } else {
    state.world = defaultWorld();
  }
  state.meta = safeLoad(STORAGE.meta, state.meta);

  state.runtime.settings = { ...DEFAULT_SETTINGS, ...state.runtime.settings };
  if (!Array.isArray(state.runtime.recentKeywords)) state.runtime.recentKeywords = [];
  if (typeof state.runtime.lastUserWasQuestion !== "boolean") state.runtime.lastUserWasQuestion = false;
  if (typeof state.runtime.lastUserText !== "string") state.runtime.lastUserText = "";
  if (typeof state.runtime.lastAiText !== "string") state.runtime.lastAiText = "";
  if (!state.world) state.world = defaultWorld();
  if (!state.world.time) state.world.time = defaultWorld().time;
  if (!state.world.weather) state.world.weather = defaultWorld().weather;
  if (!state.world.room) state.world.room = defaultWorld().room;
  if (!state.world.items) state.world.items = defaultWorld().items;
  if (!state.world.body) state.world.body = defaultWorld().body;
  if (!state.world.memory) state.world.memory = defaultWorld().memory;
  if (!state.world.memory.lastWorldSeed) state.world.memory.lastWorldSeed = "";
  if (!state.model.vocab) state.model.vocab = { [BOS]: 1, [EOS]: 1 };
  if (!state.model.bigram) state.model.bigram = {};
  state.meta.version = "2.1";
}

function persistAll() {
  state.meta.updatedAt = Date.now();
  safeSave(STORAGE.chat, state.chat);
  safeSave(STORAGE.model, state.model);
  safeSave(STORAGE.state, { runtime: state.runtime, world: state.world });
  safeSave(STORAGE.meta, state.meta);
}

function tokenize(text) {
  const tokens = [];
  let buffer = "";

  const flush = () => {
    if (buffer) {
      tokens.push(buffer);
      buffer = "";
    }
  };

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (/\s/.test(ch)) {
      flush();
      continue;
    }

    if (ch === "…") {
      flush();
      let dots = "…";
      while (text[i + 1] === "…") {
        dots += "…";
        i += 1;
      }
      tokens.push(dots);
      continue;
    }

    if (PUNCT_TOKENS.has(ch)) {
      flush();
      tokens.push(ch);
      continue;
    }

    if (/[A-Za-z0-9]/.test(ch)) {
      flush();
      let word = ch;
      while (/[A-Za-z0-9]/.test(text[i + 1])) {
        word += text[i + 1];
        i += 1;
      }
      tokens.push(word);
      continue;
    }

    buffer += ch;
  }

  flush();
  return tokens.filter(Boolean);
}

function learnFromText(text) {
  const tokens = tokenize(text);
  if (!tokens.length) return;
  const seq = [BOS, ...tokens, EOS];
  for (let i = 0; i < seq.length - 1; i += 1) {
    const w1 = seq[i];
    const w2 = seq[i + 1];
    state.model.vocab[w1] = (state.model.vocab[w1] || 0) + 1;
    state.model.vocab[w2] = (state.model.vocab[w2] || 0) + 1;
    if (!state.model.bigram[w1]) state.model.bigram[w1] = {};
    state.model.bigram[w1][w2] = (state.model.bigram[w1][w2] || 0) + 1;
  }
}

function ensureSeeded() {
  if (state.meta.seeded) return;
  seedFromBlocks();
  state.meta.seeded = true;
}

function seedFromBlocks() {
  const lines = [];
  Object.values(SEED_BLOCKS).forEach((block) => {
    if (!Array.isArray(block) || !block.length) return;
    const pick = block[Math.floor(Math.random() * block.length)];
    lines.push(pick);
  });
  lines.forEach(learnFromText);
}

function addMessage(role, text) {
  const message = {
    id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
    role,
    text,
    ts: Date.now(),
  };
  state.chat.messages.push(message);
  const trimmed = pruneChat();
  persistAll();
  if (trimmed) {
    renderAll();
  } else {
    appendMessage(message);
  }
}

function pruneChat() {
  const { maxMessages, maxChars } = state.runtime.settings;
  let totalChars = state.chat.messages.reduce((sum, m) => sum + (m.text?.length || 0), 0);
  let trimmed = false;

  while (state.chat.messages.length > maxMessages || totalChars > maxChars) {
    const removed = state.chat.messages.shift();
    totalChars -= removed?.text?.length || 0;
    trimmed = true;
  }
  return trimmed;
}

function appendMessage(message) {
  const bubble = document.createElement("div");
  bubble.className = `msg ${message.role}`;
  bubble.textContent = message.text;
  ui.chat.appendChild(bubble);
  scrollToBottom();
}

function renderAll() {
  ui.chat.innerHTML = "";
  state.chat.messages.forEach(appendMessage);
  scrollToBottom();
}

function pickStartupMessage() {
  return STARTUP_MESSAGES[Math.floor(Math.random() * STARTUP_MESSAGES.length)];
}

function pickGenericTopic() {
  return GENERIC_TOPICS[Math.floor(Math.random() * GENERIC_TOPICS.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randRange(min, max) {
  return min + Math.random() * (max - min);
}

function worldCatchup() {
  const now = Date.now();
  const last = state.world.time.lastUpdate || now;
  const elapsed = now - last;
  const stepMs = 5 * 60 * 1000;
  const steps = Math.min(5, Math.floor(elapsed / stepMs));
  for (let i = 0; i < steps; i += 1) {
    worldStep();
  }
  state.world.time.lastUpdate = now;
}

function worldStep() {
  const world = state.world;
  const { time, weather, room, items, body } = world;
  time.tick += 1;
  if (time.tick % 6 === 0) {
    const phases = ["morning", "day", "evening", "night"];
    const idx = phases.indexOf(time.phase);
    time.phase = phases[(idx + 1) % phases.length];
  }

  if (Math.random() < 0.08) {
    const types = ["clear", "rain", "wind"];
    weather.type = types[Math.floor(Math.random() * types.length)];
    weather.strength = Math.floor(Math.random() * 3);
  } else {
    if (weather.type === "rain" && Math.random() < 0.25) {
      weather.type = "clear";
      weather.strength = Math.max(0, weather.strength - 1);
    } else if (weather.type === "wind" && Math.random() < 0.2) {
      weather.type = "clear";
      weather.strength = Math.max(0, weather.strength - 1);
    } else if (weather.strength > 0 && Math.random() < 0.25) {
      weather.strength = Math.max(0, weather.strength - 1);
    }
  }

  if (time.phase === "night" && room.windowOpen && Math.random() < 0.3) room.windowOpen = false;
  if (time.phase !== "night" && !room.windowOpen && Math.random() < 0.08) room.windowOpen = true;
  if (time.phase === "night" && Math.random() < 0.2) room.lightOn = true;
  if (time.phase !== "night" && room.lightOn && Math.random() < 0.25) room.lightOn = false;
  if (time.phase === "night" && Math.random() < 0.25) room.futonOut = true;
  if (time.phase === "day" && Math.random() < 0.2) room.futonOut = false;

  if (Math.random() < 0.2) {
    room.chabudaiClutter = clamp(room.chabudaiClutter + (Math.random() < 0.5 ? -1 : 1), 0, 3);
  }

  if (items.yunomi.hasTea) {
    if (items.yunomi.temp === "hot" && Math.random() < 0.4) items.yunomi.temp = "warm";
    else if (items.yunomi.temp === "warm" && Math.random() < 0.4) items.yunomi.temp = "cold";
    if (Math.random() < 0.08) items.yunomi.hasTea = false;
  } else if (Math.random() < 0.05) {
    items.yunomi.hasTea = true;
    items.yunomi.temp = "hot";
  }

  if (Math.random() < 0.03) {
    body.clarity = randRange(0.75, 0.95);
  } else {
    body.clarity += randRange(-0.03, 0.02);
    body.clarity *= 0.92;
  }
  body.clarity = clamp(body.clarity, 0.02, 1.0);

  if (time.phase === "night") body.sleepiness += 0.05;
  if (time.phase === "morning") body.sleepiness -= 0.04;
  body.sleepiness += randRange(-0.02, 0.03);
  body.sleepiness = clamp(body.sleepiness, 0.05, 1.0);

  if (weather.type === "rain" || weather.type === "wind") body.coldHands += 0.05;
  if (room.windowOpen) body.coldHands += 0.03;
  if (weather.type === "clear" && time.phase === "day") body.coldHands -= 0.04;
  body.coldHands = clamp(body.coldHands, 0, 1);

  body.backPain += randRange(-0.02, 0.04);
  body.backPain = clamp(body.backPain, 0, 1);
}

function pickMonologueSeed() {
  const { time, weather, room, items, body } = state.world;
  const candidates = [];
  if (time.phase === "night" && body.sleepiness > 0.6) candidates.push("眠いのう", "布団が呼んどる");
  if (weather.type === "rain") candidates.push("雨の音がする");
  if (weather.type === "wind") candidates.push("風が強い");
  if (weather.type === "clear" && time.phase === "day") candidates.push("晴れてきた", "あたたかい");
  if (body.coldHands > 0.6) candidates.push("手が冷える");
  if (items.yunomi.hasTea && items.yunomi.temp === "cold") candidates.push("茶が冷めた");
  if (!items.yunomi.hasTea) candidates.push("茶をいれなおすか");
  if (room.windowOpen) candidates.push("窓が開いとる");
  if (room.futonOut) candidates.push("布団が呼んどる");
  if (!candidates.length) candidates.push("なんとなく静かじゃ");
  const last = state.world.memory.lastWorldSeed || "";
  let pick = candidates[Math.floor(Math.random() * candidates.length)];
  if (candidates.length > 1 && pick === last) {
    pick = candidates.find((c) => c !== last) || pick;
  }
  state.world.memory.lastWorldSeed = pick;
  return pick;
}

function maybeMonologue() {
  const now = Date.now();
  const cooldown = 20 * 1000 + Math.random() * 30 * 1000;
  if (now - state.world.memory.lastMonologueAt < cooldown) return "";
  if (Math.random() > 0.8) return "";
  const prefixPool = ["……", "うむ", "そういえば", "ええと"];
  const tailPool = ["のう", "かの", "じゃ", "わい"];
  const seed = pickMonologueSeed();
  const prefix = Math.random() < 0.5 ? `${prefixPool[Math.floor(Math.random() * prefixPool.length)]} ` : "";
  const needsTail = !/のう$|かの$|じゃ$|わい$/.test(seed);
  const tail = needsTail ? tailPool[Math.floor(Math.random() * tailPool.length)] : "";
  const line = `${prefix}${seed}${tail}`;
  state.world.memory.lastMonologue = line;
  state.world.memory.lastMonologueAt = now;
  return line;
}

function worldInsertPrefix() {
  const { time, weather, room, items, body } = state.world;
  if (weather.type === "rain" && weather.strength > 0 && Math.random() < 0.6) return "雨の音がするが、";
  if (weather.type === "wind" && weather.strength > 0 && Math.random() < 0.6) return "風が強いが、";
  if (weather.type === "clear" && time.phase === "day" && Math.random() < 0.4) return "晴れてきたが、";
  if (items.yunomi.hasTea && items.yunomi.temp === "cold" && Math.random() < 0.5) return "茶が冷める前に、";
  if (!items.yunomi.hasTea && Math.random() < 0.4) return "茶をいれなおして、";
  if (items.yunomi.hasTea && items.yunomi.temp === "cold") return "茶が冷める前に、";
  if (room.futonOut && time.phase === "night") return "布団から出たくないが、";
  if (body.coldHands > 0.6) return "手が冷えるが、";
  return "";
}

function worldTail() {
  const { body } = state.world;
  if (body.sleepiness > 0.7) return "もう寝るかの";
  if (body.coldHands > 0.6) return "手が冷えるのう";
  if (body.clarity > 0.75) return "……と思うのじゃ";
  return "";
}

function worldExtraSentence() {
  const { weather, items, room } = state.world;
  if (weather.type === "rain") return "雨は静かじゃのう。";
  if (weather.type === "wind") return "風の音がするのう。";
  if (weather.type === "clear") return "今日は少しあたたかいのう。";
  if (items.yunomi.hasTea && items.yunomi.temp === "cold") return "茶が冷めてしまったのう。";
  if (!items.yunomi.hasTea) return "茶を淹れなおしたいのう。";
  if (room.windowOpen) return "窓の外が気になるのう。";
  return "";
}

function applyWorldFlavor(text) {
  let out = text;
  const prefix = Math.random() < 0.5 ? worldInsertPrefix() : "";
  const tail = Math.random() < 0.6 ? worldTail() : "";
  if (prefix) out = `${prefix} ${out}`;
  if (tail) out = `${out} ${tail}`;
  if (state.world.body.clarity > 0.75 && Math.random() < 0.5) {
    const extra = worldExtraSentence();
    if (extra) out = `${out} ${extra}`;
  }
  return out.trim();
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    ui.chat.scrollTop = ui.chat.scrollHeight;
  });
}

function containsNg(text) {
  return NG_WORDS.some((word) => text.includes(word));
}

function pickTemplate(list, keyword) {
  const base = list[Math.floor(Math.random() * list.length)];
  if (base.includes("{kw}")) {
    if (keyword) return base.replaceAll("{kw}", keyword);
    return base.replaceAll("「{kw}」", "それ").replaceAll("{kw}", "それ");
  }
  return base;
}

function extractKeyword(text) {
  const tokens = tokenize(text).map(stripParticle);
  const filtered = tokens.filter((t) => {
    if (t.length <= 1) return false;
    if (PUNCT_TOKENS.has(t)) return false;
    if (PARTICLES.includes(t)) return false;
    if (STOP_KEYWORDS.includes(t)) return false;
    if (t.length < 2 || t.length > 6) return false;
    return isNounLike(t);
  });
  if (!filtered.length) return "";

  const preferred = filtered.filter((t) => /[\u4e00-\u9fff\u30a0-\u30ff]/.test(t));
  const pool = preferred.length ? preferred : filtered;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickKeywords(text) {
  const tokens = tokenize(text).map(stripParticle);
  const filtered = tokens.filter((t) => {
    if (t.length <= 1) return false;
    if (PUNCT_TOKENS.has(t)) return false;
    if (PARTICLES.includes(t)) return false;
    if (STOP_KEYWORDS.includes(t)) return false;
    if (t.length < 2 || t.length > 8) return false;
    return isNounLike(t);
  });
  if (!filtered.length) return [];
  const preferred = filtered.filter((t) => /[\u4e00-\u9fff\u30a0-\u30ff]/.test(t));
  const pool = preferred.length ? preferred : filtered;
  const recent = new Set(state.runtime.recentKeywords || []);
  const cleaned = pool.filter((t) => !recent.has(t));
  const finalPool = cleaned.length ? cleaned : pool;
  return shuffle(finalPool).slice(0, 2);
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isQuestion(text) {
  return text.includes("?") || text.includes("？") || /ですか|ますか|かな|かのう/.test(text);
}

function isNegative(text) {
  return /ない|嫌|だめ|無理|つら|つまら|飽き/.test(text);
}

function isAIQuestion(text) {
  return /AI|人工知能|ボット|bot|機械|プログラム/.test(text);
}

function isTrivialInput(text) {
  const trimmed = text.replace(/\s+/g, "");
  if (!trimmed) return true;
  const onlyPunct = [...trimmed].every((ch) => PUNCT_TOKENS.has(ch) || ch === "…" || ch === "！");
  return onlyPunct || trimmed.length <= 1;
}

function isTrivialOutput(text) {
  const trimmed = text.replace(/\s+/g, "");
  if (!trimmed) return true;
  const onlyPunct = [...trimmed].every((ch) => PUNCT_TOKENS.has(ch) || ch === "…" || ch === "！");
  return onlyPunct || trimmed.length <= 1;
}

function isNounLike(token) {
  if (!token) return false;
  if (token.length < 3) return false;
  if (ACK_WORDS.includes(token)) return false;
  if (STOP_KEYWORDS.includes(token)) return false;
  if (/^[\u3040-\u309f]+$/.test(token) && token.length < 4) return false; // short hiragana-only
  return /[A-Za-z0-9\u4e00-\u9fff\u30a0-\u30ff]/.test(token) || token.length >= 3;
}

function isMirrorAllowed(token) {
  if (!token) return false;
  if (token.length <= 2) return false;
  if (ACK_WORDS.includes(token)) return false;
  if (/^[\u3040-\u309f]+$/.test(token)) return false; // hiragana only
  return isNounLike(token);
}

function stripParticle(token) {
  if (token.length <= 1) return token;
  for (const p of PARTICLES) {
    if (token.endsWith(p) && token.length > p.length + 1) {
      return token.slice(0, -p.length);
    }
  }
  return token;
}

function storeRecentKeywords(list) {
  if (!list.length) return;
  const recent = state.runtime.recentKeywords || [];
  const next = [...list, ...recent].filter(Boolean);
  const deduped = [...new Set(next)].slice(0, 6);
  state.runtime.recentKeywords = deduped;
}

function buildMirrorReply(text) {
  const keywords = pickKeywords(text);
  if (!keywords.length) return "";
  const key = keywords[0];
  if (!isMirrorAllowed(key)) return "";
  if (Math.random() > 0.05) return "";
  if (isQuestion(text)) return pickTemplate(TEMPLATES.question, key);
  const base = pickTemplate(TEMPLATES.mirror, key);
  if (Math.random() < 0.6) {
    const tail = MIRROR_TAILS[Math.floor(Math.random() * MIRROR_TAILS.length)];
    return `${base} ${tail}`;
  }
  return base;
}

function generateFromSeeds(seeds, biasTokens = []) {
  if (!seeds.length) return "";
  const maxTokens = 16;
  const out = [];
  let current = seeds[Math.floor(Math.random() * seeds.length)];
  for (let i = 0; i < maxTokens; i += 1) {
    const next = sampleNext(current, out, biasTokens);
    if (!next || next === EOS) break;
    out.push(next);
    if (END_TOKENS.has(next)) break;
    current = next;
  }
  if (!out.length) return "";
  return joinTokens(out);
}

function pickResponse(userText) {
  if (containsNg(userText)) return pickTemplate(TEMPLATES.safe, "");

  if (isTrivialInput(userText)) {
    return `${pickTemplate(TEMPLATES.answer, "")} ${pickTemplate(TEMPLATES.question, pickGenericTopic())}`;
  }

  const question = isQuestion(userText);
  const negative = isNegative(userText);
  const shortText = userText.replace(/\s+/g, "").length <= 3;
  const repeatQuestion = question && state.runtime.lastUserWasQuestion;
  const aiQuestion = isAIQuestion(userText);
  const keyword = extractKeyword(userText);
  const roll = Math.random();
  if (roll < state.runtime.settings.templateRate) {
    if (shortText && !question) {
      return Math.random() < 0.6 ? pickTemplate(TEMPLATES.backchannel, "") : pickTemplate(TEMPLATES.answer, "");
    }
    if (aiQuestion) {
      return pickTemplate(TEMPLATES.ai, "");
    }
    if (repeatQuestion) {
      return pickTemplate(TEMPLATES.deflect, "");
    }
    if (question) {
      if (shortText) {
        return `${pickTemplate(TEMPLATES.answer, "")} ${pickTemplate(TEMPLATES.question, pickGenericTopic())}`;
      }
      const keywordList = pickKeywords(userText);
      storeRecentKeywords(keywordList);
      const kw = keywordList[0];
      const useQuestion = Math.random() < 0.6;
      if (useQuestion) {
        const follow = isNounLike(kw) ? pickTemplate(TEMPLATES.question, kw) : pickTemplate(TEMPLATES.question, pickGenericTopic());
        return `${pickTemplate(TEMPLATES.answer, "")} ${follow}`;
      }
      if (isNounLike(kw) && Math.random() < 0.25) {
        return pickTemplate(TEMPLATES.reminisce, kw);
      }
      return pickTemplate(TEMPLATES.general, keyword);
    }
    if (negative) {
      const agree = pickTemplate(TEMPLATES.agree, "");
      const mirror = buildMirrorReply(userText);
      if (mirror) return `${agree} ${mirror}`;
      return agree;
    }
    const mirror = buildMirrorReply(userText);
    if (mirror) {
      storeRecentKeywords([keyword]);
      return mirror;
    }
    if (keyword && Math.random() < 0.2) {
      return pickTemplate(TEMPLATES.reminisce, keyword);
    }
    return pickTemplate(TEMPLATES.general, keyword);
  }

  if (roll < state.runtime.settings.templateRate + state.runtime.settings.bigramRate) {
    const seeds = pickKeywords(userText);
    storeRecentKeywords(seeds);
    const bias = seeds.length ? seeds : state.runtime.recentKeywords;
    const generated = generateFromSeeds(seeds, bias) || generateBigram(bias);
    if (generated) return generated;
  }

  return pickTemplate(TEMPLATES.fallback, keyword);
}

function appendTailEcho(reply, userText) {
  return reply;
}

function sanitizeReply(text) {
  let out = text;
  out = out.replace(/その話の話/g, "その話");
  out = out.replace(/そういう話の話/g, "そういう話");
  out = out.replace(/が、\s*[、。]/g, "が、");
  out = out.replace(/\s+/g, " ").trim();
  return out;
}

function generateBigram(biasTokens = []) {
  const maxTokens = 16;
  const out = [];
  let current = BOS;
  if (biasTokens.length) {
    const candidates = biasTokens.filter((t) => state.model.bigram[t]);
    if (candidates.length) {
      current = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  let endSoon = 0;

  for (let i = 0; i < maxTokens; i += 1) {
    const next = sampleNext(current, out, biasTokens);
    if (!next) break;
    if (next === EOS) break;

    out.push(next);

    if (END_TOKENS.has(next)) {
      endSoon = 1;
    } else if (endSoon === 1) {
      break;
    }

    current = next;
  }

  if (!out.length) return "";
  return joinTokens(out);
}

function sampleNext(current, out, biasTokens = []) {
  const choices = state.model.bigram[current];
  if (!choices) return "";
  const entries = Object.entries(choices);
  if (!entries.length) return "";

  const last = out[out.length - 1];
  const last2 = out[out.length - 2];
  const biasSet = new Set(biasTokens);
  let total = 0;
  const weighted = entries.map(([token, count]) => {
    let weight = count;
    if (token === last) weight *= 0.5;
    if (last && last2 && token === last && token === last2) weight = 0;
    if (out.length < 2 && END_TOKENS.has(token)) weight *= 0.2;
    if (biasSet.has(token)) weight *= 1.6;
    if (weight < 0) weight = 0;
    total += weight;
    return { token, weight };
  });

  if (total <= 0) return "";
  let r = Math.random() * total;
  for (const item of weighted) {
    r -= item.weight;
    if (r <= 0) return item.token;
  }
  return weighted[weighted.length - 1].token;
}

function joinTokens(tokens) {
  let text = "";
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    const prev = tokens[i - 1];
    const isAscii = /^[A-Za-z0-9]+$/.test(token);
    const prevAscii = prev && /^[A-Za-z0-9]+$/.test(prev);

    if (PUNCT_TOKENS.has(token) || token === "…") {
      text += token;
    } else if (isAscii && prevAscii) {
      text += ` ${token}`;
    } else {
      text += token;
    }
  }
  return text;
}

function applyTypo(text) {
  if (Math.random() > state.runtime.settings.typoRate) return text;
  const typeRoll = Math.random();
  if (typeRoll < 0.5) {
    return addEllipsis(text);
  }
  if (typeRoll < 0.8) {
    return replaceKana(text);
  }
  return dropChar(text);
}

function addEllipsis(text) {
  if (text.includes("…")) return text;
  const pos = Math.min(text.length - 3, Math.max(1, Math.floor(text.length * (0.3 + Math.random() * 0.4))));
  if (pos <= 0) return text;
  return text.slice(0, pos) + "…" + text.slice(pos);
}

function replaceKana(text) {
  const map = {
    "さ": "ざ",
    "し": "じ",
    "す": "ず",
    "た": "だ",
    "て": "で",
    "と": "ど",
    "は": "ば",
    "ふ": "ぶ",
    "へ": "べ",
    "ほ": "ぼ",
    "う": "ぅ",
  };
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (i >= text.length - 2) break;
    if (map[ch]) {
      return text.slice(0, i) + map[ch] + text.slice(i + 1);
    }
  }
  return text;
}

function dropChar(text) {
  if (text.length < 4) return text;
  const candidates = [...text].map((ch, idx) => ({ ch, idx }))
    .filter((item) => !PUNCT_TOKENS.has(item.ch) && item.ch !== "…" && item.idx < text.length - 2);
  if (!candidates.length) return text;
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  return text.slice(0, pick.idx) + text.slice(pick.idx + 1);
}

function showTyping() {
  const bubble = document.createElement("div");
  bubble.className = "msg ai";
  bubble.dataset.typing = "1";
  bubble.innerHTML = "<span class=\"typing\"><span></span><span></span><span></span></span>";
  ui.chat.appendChild(bubble);
  scrollToBottom();
  return bubble;
}

function removeTyping(bubble) {
  if (bubble && bubble.parentNode) bubble.parentNode.removeChild(bubble);
}

function computeDelay(text) {
  const len = text.length;
  let min = 600;
  let max = 1200;
  if (len > 20 && len <= 60) {
    min = 1000;
    max = 2200;
  } else if (len > 60) {
    min = 1500;
    max = 3500;
  }
  return Math.floor(min + Math.random() * (max - min));
}

function respond(userText) {
  worldCatchup();
  worldStep();
  const monologue = maybeMonologue();
  let coreReply = appendTailEcho(pickResponse(userText), userText);
  if (isTrivialOutput(coreReply)) {
    coreReply = `${pickTemplate(TEMPLATES.answer, "")} ${pickTemplate(TEMPLATES.question, pickGenericTopic())}`;
  }
  const cleanUser = userText.replace(/\s+/g, "").trim();
  const cleanReply = coreReply.replace(/\s+/g, "").trim();
  if (cleanReply && cleanUser && cleanReply === cleanUser) {
    coreReply = pickTemplate(TEMPLATES.general, "");
  }
  let replyRaw = applyWorldFlavor(coreReply);
  if (monologue) {
    if (Math.random() < 0.6) {
      replyRaw = `${monologue} ${replyRaw}`.trim();
    } else {
      addMessage("ai", monologue);
    }
  }
  replyRaw = sanitizeReply(replyRaw);
  if (replyRaw === state.runtime.lastAiText) {
    replyRaw = sanitizeReply(applyWorldFlavor(pickResponse(userText)));
  }
  if (isTrivialOutput(replyRaw)) {
    replyRaw = `${pickTemplate(TEMPLATES.answer, "")} ${pickTemplate(TEMPLATES.question, pickGenericTopic())}`;
  }
  const reply = applyTypo(replyRaw);
  const delay = computeDelay(reply);
  const typingBubble = showTyping();

  setTimeout(() => {
    removeTyping(typingBubble);
    addMessage("ai", reply);
    state.runtime.lastAiText = reply;
  }, delay);
}

function handleSend() {
  const text = ui.input.value.trim();
  if (!text) return;
  ui.input.value = "";
  addMessage("user", text);
  if (!isTrivialInput(text)) {
    learnFromText(text);
  }
  persistAll();
  state.runtime.lastUserWasQuestion = isQuestion(text);
  state.runtime.lastUserText = text;
  respond(text);
}

function resetAll() {
  if (!confirm("会話ログと学習データをリセットします。よいですか？")) return;
  state.chat = { messages: [] };
  state.model = { vocab: { [BOS]: 1, [EOS]: 1 }, bigram: {} };
  state.runtime = {
    lastTokens: [BOS],
    seed: Math.floor(Math.random() * 1e9),
    recentKeywords: [],
    lastUserWasQuestion: false,
    lastUserText: "",
    lastAiText: "",
    settings: { ...DEFAULT_SETTINGS },
  };
  state.world = defaultWorld();
  state.meta = { version: "2.1", updatedAt: Date.now(), seeded: false };
  ensureSeeded();
  state.chat.messages.push({
    id: String(Date.now()),
    role: "ai",
    text: pickStartupMessage(),
    ts: Date.now(),
  });
  persistAll();
  renderAll();
}

function bindEvents() {
  ui.send.addEventListener("click", handleSend);
  ui.input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      handleSend();
    }
  });
  ui.reset.addEventListener("click", resetAll);
  ui.settingsBtn.addEventListener("click", () => {
    const isOpen = ui.settingsMenu.classList.toggle("open");
    ui.settingsBtn.setAttribute("aria-expanded", String(isOpen));
  });
  document.addEventListener("click", (event) => {
    if (!ui.settingsMenu.classList.contains("open")) return;
    const target = event.target;
    if (ui.settingsMenu.contains(target) || ui.settingsBtn.contains(target)) return;
    ui.settingsMenu.classList.remove("open");
    ui.settingsBtn.setAttribute("aria-expanded", "false");
  });
  ui.title.addEventListener("click", (event) => {
    if (!event.altKey) return;
    seedFromBlocks();
    persistAll();
    alert("seedを再投入しました");
  });
}

function boot() {
  initState();
  worldCatchup();
  ensureSeeded();
  if (!state.chat.messages.length) {
    state.chat.messages.push({
      id: String(Date.now()),
      role: "ai",
      text: pickStartupMessage(),
      ts: Date.now(),
    });
    persistAll();
  }
  renderAll();
  bindEvents();
}

boot();
