# Or's LeetCode Hype Squad

This lightweight Chromium extension watches the submission result banner on LeetCode (`<span data-e2e-locator="submission-result">Accepted</span>`) and instantly launches a full-screen celebration for Or whenever the submission is accepted.

## Install locally

1. Open Chrome (or Brave/Edge) and go to `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select this folder (`C:\My_Project\Or`).
4. Visit any LeetCode submission page and run a solution. The overlay fires the moment the Accepted badge appears.

> Tip: Reload the extension from the extensions page whenever you tweak the files; no browser restart is required.

## Customizing the celebration

- **Message text**: edit the `<h1>` and `<p>` strings inside `content.js:createOverlay`.
- **Confetti quantity/colors**: tweak the `totalPieces` and `colors` array in `populateConfetti`.
- **Soundtrack**: replace `OriginalSong.mp3` with your own audio clip (keep the same name or update `SOUNDTRACK_PATH` plus `manifest.json`).
- **Styling**: adjust fonts, gradients, and animation timing in `styles.css`.

## GitHub Pages demo

Need a shareable preview? Deploy the `demo/` directory to GitHub Pages (or any static host). It reuses the same assets to show the overlay, soundtrack, rotating copy, lyrics panel, confetti, and fireworks without installing the extension. Just open the page and hit **Trigger Celebration**.

## How it works

- `content.js` injects a `MutationObserver` that watches the page for the Accepted badge.  
- When the badge text becomes "Accepted", it creates a full-screen overlay with vibrant typography and a dismiss button.  
- A confetti container spawns 120 animated pieces that cascade across the screen for extra hype.  
- The overlay re-arms once the badge disappears, so every new Accepted result can be celebrated again.

## Verification checklist

- Load the unpacked extension.
- Submit or re-run any solution on LeetCode until you see the Accepted badge appear.
- Confirm the overlay fades in, animates confetti, and can be dismissed by clicking the button or the dimmed background.
# Or-s-LeetCode
