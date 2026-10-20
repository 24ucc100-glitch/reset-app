# RESET — Mobile-First Distraction & Grounding App

> **“Stop the loop. Do one thing.”**
> *“When your mind keeps replaying a question, don't solve it right now. Interrupt it with a tiny action.”*

RESET is a calm, minimal, mobile-first web utility engineered to interrupt overthinking loops for 2–10 minutes and ground attention back into the physical world.

---

## 🧘 Core Psychological Philosophy

1. **Interrupt, don't solve**: Repetitive thoughts are rarely solved by further mental analysis. A micro-action breaks the neurological loop.
2. **Zero reassurance-seeking**: Does not reassure or argue with thoughts, avoiding compulsive mental checking cycles.
3. **Non-addictive by design**: No streaks, no levels, no daily reminders, no badges, and no infinite scrolling.
4. **Immediate return protocol**: Every reset finishes by asking: *“Do you want to return to what you were doing?”* with an encouraging prompt to put down the screen.
5. **Medical disclaimer**: RESET is a grounding and distraction tool, not a replacement for professional clinical care.

---

## ⚡ Features & Distraction Modules

### 1. Smart Reset Flow (`I'M OVERTHINKING →`)
- Immediately bypasses decision fatigue by launching a randomized micro-activity (Breathing, Reflex, Focus, or Thought Dump) with a single tap.

### 2. 🌬️ Breathing Reset (60 Seconds)
- Guided 4s inhale / 4s exhale pacing with a smooth expanding and contracting circle.
- Alternates between **Breathe in** and **Breathe out**.
- Start, Pause, Resume, and Restart controls.
- Increments `minutesRedirected` (+1) and `resetsToday` (+1).
- Concludes with: *“Done ✓ — You don't need to solve the thought right now.”*

### 3. ⚡ Reflex Game (Break the Loop)
- Reaction-time test designed to forcefully draw attention into the physical present.
- Instructions: *“Wait for GO. Tap as fast as you can.”*
- Random delay between 0.8s and 3.0s.
- Early tap detection: *“Too early 😄 Try again.”*
- 5 fast rounds with average reaction time calculation and personal best tracking.
- Concludes with: *“Nice. Your attention is back in the room.”*

### 4. ⏱️ 5-Minute Focus Redirect
- Four concrete, physical or mental redirect actions:
  - 🧹 **Clean one small area**: Desk, sink, or shelf clutter.
  - 🚶 **Walk for 5 minutes**: Feel footsteps and movement.
  - 💧 **Drink water + stretch**: Physical hydration and shoulder rolls.
  - 🧠 **Solve one easy problem**: Concrete micro-riddles / math to shift gears.
- 5:00 countdown timer with Pause, Resume, and Reset.
- Concludes with: *“5 minutes done. Check in with yourself.”*

### 5. 📝 Thought Dump (Park It Safely)
- Title: *“Park the thought.”*
- Instruction: *“Write the thought exactly as it is. Then ask: Can I act on this in the next 10 minutes?”*
- Placeholder: *“What keeps coming back to my mind?”*
- **Park it** button saves the thought safely to local browser storage.
- Grounding feedback: *“Parked. You don't have to solve it right now.”*
- Easily clear the thought anytime with **Clear thought**.

### 6. ⚙️ Preferences & Accessibility
- **Calm Dark / Soft Light mode**: defaults to deep calm navy (`#080b11`).
- **Reduce Motion toggle**: instant suppression of spring and scale animations.
- **Gentle Audio Synthesizer**: soothing tones created using the Web Audio API without downloading external audio files.
- **Wipe stats & clear thought**: full control over local data.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + TypeScript (strict typing with `verbatimModuleSyntax`).
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`.
- **Icons**: Lucide React.
- **Audio**: Custom zero-dependency Web Audio API synthesizer (`GentleAudio.ts`).
- **Storage**: LocalStorage with automatic daily rollover for `resetsToday`.
- **Viewport**: Mobile-first responsive layout with dynamic viewport units (`100dvh`), iOS/Android safe area support, and touch highlight prevention.
- **PWA Ready**: Manifest and standalone mobile display mode.

---

## 🚀 Running the App Locally

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm

### Installation & Development
```bash
# Navigate to the project directory
cd reset-app

# Install dependencies (if not already installed)
npm install

# Start the local development server
npm run dev

# Open your browser at http://localhost:5173
```

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```
