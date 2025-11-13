const ACCEPTED_SELECTOR = 'span[data-e2e-locator="submission-result"]';
const ACCEPTED_TEXT = 'accepted';
const CELEBRATION_DELAY_MS = 6000;
const REARM_DELAY_MS = 12000;
const SOUNDTRACK_PATH = 'OriginalSong.mp3';
const ROTATING_MESSAGES = [
  'Breaking: Or Shmuelof just solved bugs that were still in brainstorming.',
  'Investigators confirm: Or\'s runtime graph is now considered modern art.',
  'Fact: Gravity asked Or for permission before pulling that algorithm down.',
  'PSA: Or Shmuelof can now legally list "fire-breathing debugger" on LinkedIn.',
  'Rumor mill: NASA requested logs because that solution achieved escape velocity.',
  'Daily reminder: Or writes code so clean it squeaks in four languages.'
];
const ROTATING_INTERVAL_MS = 4200;
const FIREWORK_COUNT = 12;
const SONG_LYRICS = `
[Intro]
Ohhh Or Shmuelof,
Lisa on the left and you sat on my right,
Calculus one, first sight, first light,
Didn’t know that math could feel this bright…

[Verse 1]
We were lost in limits, pages full of scribbles,
You dropped your bag, we laughed at all the symbols,
Lisa in the middle, you slid into the row,
“Is this seat free?” and suddenly the time slowed.

Now it’s Infi nights, coffee, deadlines,
Linear algebra and highlighted lines,
Matrices dancing in your eyes when you say,
“Wait, is this a list or an array?”

[Pre-Chorus]
You joke I’ve got a math cheat code,
Open Uni stories that I always reload,
“Discrete math boy,” yeah, you tease me nonstop,
But we’re passing every test, we’re leveling up.

[Chorus]
Two Sum, one win, we just cracked the code,
First LeetCode solved and the confetti explodes,
From Calculus one to arrays on the screen,
You and me debugging like a power team.

Two Sum, one vibe, add our laughs, they flow,
Or Shmuelof shining like a status “in glow,”
From “what’s a matrix?” to “I solved it, look!”
We just rewrote the ending of the textbook.

[Verse 2]
You tried to pay me weekly for the questions you ask,
But friendship’s not a job, it’s not an hourly task,
So I said “Keep your money, I’ve got a better deal,”
Bring me אקטימל, that’s how we seal it real.

Sipping tiny bottles while we fight through the proofs,
Vectors on the table, dreams under the roof,
You say, “He’s good at math, you know what I mean?
He took discrete at the Open University!”

And I laugh ’cause you’re quoting my flex as a meme,
But that’s our inside joke, part of the team,
From sigma signs to graphs in the night,
We turn every problem into neon light.

[Pre-Chorus]
You joke I’ve got a math cheat code,
Open Uni stories that I always reload,
“Discrete math boy,” yeah, you tease me nonstop,
But we’re passing every test, we’re leveling up.

[Chorus]
Two Sum, one win, we just cracked the code,
First LeetCode solved and the confetti explodes,
From Calculus one to arrays on the screen,
You and me debugging like a power team.

Two Sum, one vibe, add our laughs, they flow,
Or Shmuelof shining like a status “in glow,”
From “what’s a matrix?” to “I solved it, look!”
We just rewrote the ending of the textbook.

[Bridge]
Index by index, we’re closing the gap,
Checking each value on this crazy map,
When the logic feels wrong and the bugs don’t quit,
We just shift our pointers and refactor it.

And when that first green checkmark finally appears,
We’ll raise our אקטימל bottles, cheer to all these years,
“From Calculus to coding, we’ve come so far,”
You solved Two Sum, girl, you’re a superstar.

[Breakdown / Chant]
O-O-Or Shmuelof, light up the room,
Every little victory goes “boom, boom, boom,”
Lisa in the back with the clapping hands,
Study-group legends, we don’t need a band.

[Final Chorus]
Two Sum, one win, yeah, you owned that fight,
First LeetCode down, now the future’s in sight,
From limits and lines to the code we run,
You plus me is the perfect sum.

Two Sum, one vibe, put this song on repeat,
Let the campus hear our victory beat,
From “what’s an array?” to “I’m in the zone,”
Or, tonight you’re in a league of your own.

[Outro]
Ohhh Or Shmuelof,
This is our proof, it’s more than a grade,
Friends, math, aktimel — memories we made,
Hit that run button, watch the test cases fly,
Two Sum solved, and we’re dancing under Pi. 🥳
`;
let celebrationScheduled = false;
let celebrationDisplayed = false;
let celebrationTimerId = null;
let rearmTimerId = null;
let soundtrackAudio = null;
let typewriterTimeouts = [];
let rotatingTimeoutId = null;
let rotatingIntervalId = null;
let rotatingIndex = 0;
let soundUnlockButton = null;
let awaitingSoundUnlock = false;
let pendingPointerUnlock = null;

function isAcceptedVisible() {
  const badge = document.querySelector(ACCEPTED_SELECTOR);
  if (!badge) {
    return false;
  }
  const text = (badge.textContent || '').trim().toLowerCase();
  return text === ACCEPTED_TEXT;
}

function createOverlay() {
  let overlay = document.getElementById('or-celebration-overlay');
  if (overlay) {
    clearTypewriterTimers();
    clearRotatingMessages();
    overlay.remove();
    stopSoundtrack();
  }

  overlay = document.createElement('div');
  overlay.id = 'or-celebration-overlay';

  const aurora = document.createElement('div');
  aurora.className = 'or-aurora';

  const inner = document.createElement('div');
  inner.className = 'or-celebration-inner';
  inner.innerHTML = `
    <div class="or-ribbon or-typewriter" data-typewriter-step="0.08" data-typewriter-hold="0.7">${wrapLetters('ACCEPTED ALERT // GENIUS DETECTED')}</div>
    <h1 class="or-headline or-typewriter" data-typewriter-step="0.07" data-typewriter-hold="0.5">${wrapLetters('OR SHMUELOF JUST GLITCHED LEETCODE')}</h1>
    <p class="or-subline or-typewriter" data-typewriter-step="0.06" data-typewriter-hold="0.5">${wrapLetters('THE SERVERS NOW ADDRESS HER AS QUEEN OF RUNTIME')}</p>
    <p class="or-storyline or-typewriter" data-typewriter-step="0.05" data-typewriter-hold="0.8">${wrapLetters('Breaking news: Or Shmuelof solved it so hard the runtime chart started sending thank-you notes.')}</p>
    <p class="or-tagline or-typewriter" data-typewriter-step="0.05" data-typewriter-hold="1.1">${wrapLetters('Please stay calm while we reinstall gravity after that flex...')}</p>
    <div class="or-rotating" aria-live="polite">
      <span class="or-rotating-label">Live Hype Feed</span>
      <span class="or-rotating-message"></span>
    </div>
    <section class="or-lyrics-panel collapsed">
      <div class="or-lyrics-header">
        <span class="or-lyrics-title">OriginalSong lyrics</span>
        <button type="button" class="or-lyrics-toggle" aria-expanded="false">Open lyrics</button>
      </div>
      <div class="or-lyrics-body" aria-hidden="true">
        <pre class="or-lyrics-text"></pre>
      </div>
    </section>
    <button type="button" class="or-celebration-close">Take that victory lap !!!</button>
  `;

  const confetti = document.createElement('div');
  confetti.className = 'or-confetti-container';
  populateConfetti(confetti);

  const fireworks = createFireworksLayer();

  overlay.appendChild(aurora);
  overlay.appendChild(confetti);
  overlay.appendChild(fireworks);
  overlay.appendChild(inner);

  const lyricsTextElement = inner.querySelector('.or-lyrics-text');
  if (lyricsTextElement) {
    lyricsTextElement.textContent = SONG_LYRICS.trim();
  }

  const lyricsPanel = inner.querySelector('.or-lyrics-panel');
  const lyricsBody = inner.querySelector('.or-lyrics-body');
  const lyricsToggle = inner.querySelector('.or-lyrics-toggle');
  if (lyricsPanel && lyricsBody && lyricsToggle) {
    const setLyricsState = (expanded) => {
      lyricsPanel.classList.toggle('collapsed', !expanded);
      lyricsBody.setAttribute('aria-hidden', String(!expanded));
      lyricsToggle.setAttribute('aria-expanded', String(expanded));
      lyricsToggle.textContent = expanded ? 'Hide lyrics' : 'Open lyrics';
    };
    lyricsToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const expanded = lyricsPanel.classList.contains('collapsed');
      setLyricsState(expanded);
    });
    setLyricsState(false);
  }

  overlay.addEventListener('click', (event) => {
    if (event.target.classList.contains('or-celebration-close') || event.target === overlay) {
      clearTypewriterTimers();
      clearRotatingMessages();
      overlay.remove();
      stopSoundtrack();
    }
  });

  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('or-celebration-visible');
    playSoundtrack();
    const sequenceDuration = runTypewriterSequence(inner);
    const rotatingTarget = inner.querySelector('.or-rotating-message');
    startRotatingMessages(rotatingTarget, sequenceDuration + 500);
  });
}

function populateConfetti(container) {
  const colors = ['#ffa3d7', '#ffd966', '#75fbfd', '#c3f584', '#ff8c42', '#e0aaff', '#f4a261', '#a5ffb7'];
  const totalPieces = 240;

  for (let i = 0; i < totalPieces; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'or-confetti-piece';
    piece.style.setProperty('--delay', `${Math.random() * 2}s`);
    piece.style.setProperty('--duration', `${3.2 + Math.random() * 1.5}s`);
    piece.style.setProperty('--x', `${Math.random() * 100}%`);
    piece.style.setProperty('--scale', `${0.5 + Math.random() * 1.1}`);
    piece.style.setProperty('--spin', Math.random() > 0.5 ? '1' : '-1');
    piece.style.setProperty('--drift', `${Math.round(Math.random() * 40 - 20)}px`);
    piece.style.backgroundColor = colors[i % colors.length];
    piece.style.opacity = `${0.6 + Math.random() * 0.4}`;
    piece.style.width = `${5 + Math.random() * 10}px`;
    piece.style.height = `${12 + Math.random() * 24}px`;

    const variantChance = Math.random();
    if (variantChance > 0.75) {
      piece.classList.add('or-confetti-piece-star');
    } else if (variantChance > 0.45) {
      piece.classList.add('or-confetti-piece-ribbon');
    }

    container.appendChild(piece);
  }
}

function createFireworksLayer() {
  const fireworks = document.createElement('div');
  fireworks.className = 'or-fireworks';
  for (let i = 0; i < FIREWORK_COUNT; i += 1) {
    const shell = document.createElement('span');
    shell.className = 'or-firework';
    shell.style.setProperty('--firework-x', `${Math.random() * 100}%`);
    shell.style.setProperty('--firework-delay', `${Math.random() * 2}s`);
    shell.style.setProperty('--firework-duration', `${3 + Math.random() * 1.4}s`);
    shell.style.setProperty('--firework-peak', `${45 + Math.random() * 35}vh`);
    shell.style.setProperty('--firework-color', `hsl(${Math.floor(Math.random() * 360)}, 85%, 70%)`);
    shell.style.setProperty('--firework-scale', `${0.9 + Math.random() * 0.7}`);

    const core = document.createElement('span');
    core.className = 'or-firework-core';

    const ring = document.createElement('span');
    ring.className = 'or-firework-ring';

    const trail = document.createElement('span');
    trail.className = 'or-firework-trail';

    const burst = document.createElement('span');
    burst.className = 'or-firework-burst';

    const sparkCount = 10;
    for (let sparkIndex = 0; sparkIndex < sparkCount; sparkIndex += 1) {
      const spark = document.createElement('span');
      spark.className = 'or-firework-spark';
      spark.style.setProperty('--spark-rotation', `${(360 / sparkCount) * sparkIndex}deg`);
      spark.style.setProperty('--spark-delay', `${Math.random() * 0.3}s`);
      spark.style.setProperty('--spark-length', `${14 + Math.random() * 18}px`);
      shell.appendChild(spark);
    }

    const burstDotCount = 18;
    for (let dotIndex = 0; dotIndex < burstDotCount; dotIndex += 1) {
      const dot = document.createElement('span');
      dot.className = 'or-firework-burst-dot';
      dot.style.setProperty('--burst-angle', `${(360 / burstDotCount) * dotIndex}deg`);
      dot.style.setProperty('--burst-distance', `${24 + Math.random() * 36}px`);
      burst.appendChild(dot);
    }

    shell.appendChild(trail);
    shell.appendChild(core);
    shell.appendChild(ring);
    shell.appendChild(burst);
    fireworks.appendChild(shell);
  }

  return fireworks;
}

function wrapLetters(text) {
  return text
    .split('')
    .map((character, index) => {
      const glyph = character === ' ' ? '&nbsp;' : character;
      return `<span class="or-letter" style="--char-index:${index}">${glyph}</span>`;
    })
    .join('');
}

function runTypewriterSequence(root) {
  clearTypewriterTimers();
  const segments = Array.from(root.querySelectorAll('.or-typewriter'));
  let delay = 0;

  segments.forEach((segment) => {
    segment.classList.remove('or-typewriter-active');
    const step = Number(segment.dataset.typewriterStep) || 0.06;
    const hold = Number(segment.dataset.typewriterHold) || 0.5;
    segment.style.setProperty('--typewriter-step', `${step}s`);
    const letters = segment.querySelectorAll('.or-letter').length || 1;
    const timerId = setTimeout(() => {
      segment.classList.add('or-typewriter-active');
    }, delay);
    typewriterTimeouts.push(timerId);
    delay += letters * step * 1000 + hold * 1000;
  });

  return delay;
}

function clearTypewriterTimers() {
  typewriterTimeouts.forEach((id) => clearTimeout(id));
  typewriterTimeouts = [];
}

function startRotatingMessages(target, initialDelay = 0) {
  if (!target) {
    return;
  }
  clearRotatingMessages();
  rotatingIndex = 0;

  const showMessage = () => {
    target.classList.remove('or-rotating-message-active');
    void target.offsetWidth;
    target.textContent = ROTATING_MESSAGES[rotatingIndex];
    requestAnimationFrame(() => target.classList.add('or-rotating-message-active'));
    rotatingIndex = (rotatingIndex + 1) % ROTATING_MESSAGES.length;
  };

  rotatingTimeoutId = setTimeout(() => {
    showMessage();
    rotatingIntervalId = setInterval(showMessage, ROTATING_INTERVAL_MS);
  }, Math.max(0, initialDelay));
}

function clearRotatingMessages() {
  if (rotatingTimeoutId) {
    clearTimeout(rotatingTimeoutId);
    rotatingTimeoutId = null;
  }
  if (rotatingIntervalId) {
    clearInterval(rotatingIntervalId);
    rotatingIntervalId = null;
  }
}

function promptSoundUnlock() {
  if (awaitingSoundUnlock) {
    return;
  }
  awaitingSoundUnlock = true;
  showSoundUnlockButton();
  pendingPointerUnlock = () => {
    playSoundtrack(true);
  };
  document.addEventListener('pointerdown', pendingPointerUnlock, { once: true });
}

function showSoundUnlockButton() {
  if (soundUnlockButton || !document.body) {
    return;
  }
  soundUnlockButton = document.createElement('button');
  soundUnlockButton.type = 'button';
  soundUnlockButton.className = 'or-sound-nudge';
  soundUnlockButton.textContent = 'Enable hype soundtrack';
  soundUnlockButton.addEventListener('click', (event) => {
    event.stopPropagation();
    playSoundtrack(true);
  });
  document.body.appendChild(soundUnlockButton);
}

function hideSoundUnlockButton() {
  awaitingSoundUnlock = false;
  if (pendingPointerUnlock) {
    document.removeEventListener('pointerdown', pendingPointerUnlock);
    pendingPointerUnlock = null;
  }
  if (soundUnlockButton) {
    soundUnlockButton.remove();
    soundUnlockButton = null;
  }
}

function ensureSoundtrack() {
  if (!soundtrackAudio) {
    soundtrackAudio = new Audio(chrome.runtime.getURL(SOUNDTRACK_PATH));
    soundtrackAudio.preload = 'auto';
    soundtrackAudio.volume = 0.9;
  }
  return soundtrackAudio;
}

function playSoundtrack(fromUserUnlock = false) {
  const audio = ensureSoundtrack();
  audio.currentTime = 0;
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise
      .then(() => {
        hideSoundUnlockButton();
      })
      .catch(() => {
        if (!fromUserUnlock) {
          promptSoundUnlock();
        }
      });
  }
}

function stopSoundtrack() {
  if (soundtrackAudio) {
    soundtrackAudio.pause();
    soundtrackAudio.currentTime = 0;
  }
  hideSoundUnlockButton();
}

function handleStateChange() {
  const accepted = isAcceptedVisible();
  if (accepted) {
    if (rearmTimerId) {
      clearTimeout(rearmTimerId);
      rearmTimerId = null;
    }
    if (!celebrationScheduled && !celebrationDisplayed) {
      celebrationScheduled = true;
      celebrationTimerId = setTimeout(() => {
        celebrationTimerId = null;
        celebrationScheduled = false;
        celebrationDisplayed = true;
        createOverlay();
      }, CELEBRATION_DELAY_MS);
    }
  } else {
    if (celebrationTimerId) {
      clearTimeout(celebrationTimerId);
      celebrationTimerId = null;
      celebrationScheduled = false;
    }
    if (celebrationDisplayed && !rearmTimerId) {
      rearmTimerId = setTimeout(() => {
        celebrationDisplayed = false;
        celebrationScheduled = false;
        rearmTimerId = null;
      }, REARM_DELAY_MS);
    }
  }
}

function installObserver() {
  if (!document.body) {
    return;
  }

  const observer = new MutationObserver(() => {
    handleStateChange();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  handleStateChange();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', installObserver, { once: true });
} else {
  installObserver();
}
