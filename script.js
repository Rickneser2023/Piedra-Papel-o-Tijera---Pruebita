/* =============================================
   PIEDRA, PAPEL O TIJERA — script.js
   ============================================= */

const CHOICES = ['piedra', 'papel', 'tijera'];

const ICONS = {
  piedra: '🪨',
  papel:  '📄',
  tijera: '✂️',
};

// Quién le gana a quién: BEATS[a] = b → a le gana a b
const BEATS = {
  piedra: 'tijera',
  papel:  'piedra',
  tijera: 'papel',
};

const MESSAGES = {
  win:  ['¡Ganaste! 🎉', '¡Excelente jugada!', '¡Eres increíble! 🏆', '¡Aplastaste a la CPU!'],
  lose: ['¡Perdiste! 😅', 'La CPU te venció...', 'Mala suerte, intenta de nuevo.', '¡La CPU fue más lista!'],
  draw: ['¡Empate! 🤝', 'Igual que la CPU...', 'Ninguno gana esta vez.', 'Muy cerrado, ¡de nuevo!'],
};

// ── Estado ──────────────────────────────────────
let state = {
  scores: { player: 0, cpu: 0, draw: 0 },
  round: 0,
  history: [],
  locked: false,
};

// ── Elementos del DOM ───────────────────────────
const playerScoreEl  = document.getElementById('player-score');
const cpuScoreEl     = document.getElementById('cpu-score');
const drawScoreEl    = document.getElementById('draw-score');
const playerChoiceEl = document.getElementById('player-choice');
const cpuChoiceEl    = document.getElementById('cpu-choice');
const resultBanner   = document.getElementById('result-banner');
const resultText     = document.getElementById('result-text');
const historyList    = document.getElementById('history-list');
const resetBtn       = document.getElementById('reset-btn');
const choiceButtons  = document.querySelectorAll('.choice-btn');

// ── Lógica del juego ─────────────────────────────
function cpuChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function evaluate(player, cpu) {
  if (player === cpu)          return 'draw';
  if (BEATS[player] === cpu)   return 'win';
  return 'lose';
}

function randomMessage(type) {
  const arr = MESSAGES[type];
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Actualizar UI ────────────────────────────────
function bumpScore(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // reflow para reiniciar animación
  el.classList.add('bump');
  el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
}

function updateScoreboard() {
  playerScoreEl.textContent = state.scores.player;
  cpuScoreEl.textContent    = state.scores.cpu;
  drawScoreEl.textContent   = state.scores.draw;
}

function showResult(outcome) {
  resultBanner.className = 'result-banner ' + outcome;
  resultText.textContent = randomMessage(outcome);
}

function animateChoice(el, icon) {
  el.classList.remove('pop', 'shake');
  void el.offsetWidth;
  el.textContent = icon;
  el.classList.add('pop');
}

function addHistoryItem(round, playerC, cpuC, outcome) {
  // Quitar mensaje vacío si existe
  const empty = historyList.querySelector('.history-empty');
  if (empty) empty.remove();

  const li = document.createElement('li');

  const labels = { win: 'Ganaste', lose: 'Perdiste', draw: 'Empate' };
  const badgeClass = { win: 'badge-win', lose: 'badge-lose', draw: 'badge-draw' };

  li.innerHTML = `
    <span class="round-num">#${round}</span>
    <span class="round-desc">${ICONS[playerC]} vs ${ICONS[cpuC]}</span>
    <span class="round-badge ${badgeClass[outcome]}">${labels[outcome]}</span>
  `;

  historyList.insertBefore(li, historyList.firstChild);
}

// ── Jugar ────────────────────────────────────────
function play(playerC) {
  if (state.locked) return;
  state.locked = true;

  const cpu     = cpuChoice();
  const outcome = evaluate(playerC, cpu);

  // Animaciones de elección
  playerChoiceEl.classList.add('shake');
  cpuChoiceEl.classList.add('shake');

  setTimeout(() => {
    animateChoice(playerChoiceEl, ICONS[playerC]);
    animateChoice(cpuChoiceEl,    ICONS[cpu]);

    // Actualizar puntuación
    if (outcome === 'win')       state.scores.player++;
    else if (outcome === 'lose') state.scores.cpu++;
    else                         state.scores.draw++;

    state.round++;
    updateScoreboard();
    showResult(outcome);

    // Bump del marcador ganador
    if (outcome === 'win')       bumpScore(playerScoreEl);
    else if (outcome === 'lose') bumpScore(cpuScoreEl);
    else                         bumpScore(drawScoreEl);

    addHistoryItem(state.round, playerC, cpu, outcome);

    state.locked = false;
  }, 380);
}

// ── Reset ─────────────────────────────────────────
function reset() {
  state.scores   = { player: 0, cpu: 0, draw: 0 };
  state.round    = 0;
  state.history  = [];
  state.locked   = false;

  updateScoreboard();

  playerChoiceEl.textContent = '❓';
  cpuChoiceEl.textContent    = '❓';

  resultBanner.className = 'result-banner';
  resultText.textContent = 'Elige tu jugada';

  historyList.innerHTML = '<li class="history-empty">Aún no hay rondas jugadas.</li>';
}

// ── Eventos ───────────────────────────────────────
choiceButtons.forEach(btn => {
  btn.addEventListener('click', () => play(btn.dataset.choice));
});

resetBtn.addEventListener('click', reset);