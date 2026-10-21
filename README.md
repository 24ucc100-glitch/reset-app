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
- Immediately bypasses decision fatigue by launching a randomized micro-activity (Breathing, Reflex, Focus, Thought Dump, Rapid Math, or Quick Sketch) with a single tap.

### 2. 🔢 Rapid Mental Math (Instant Emerging Problems)
- Generates clean arithmetic calculations (`+`, `-`, `×`).
- 4 instant tap choice buttons for rapid mobile responses.
- As soon as the user solves a problem, the next problem emerges immediately with zero lag to aggressively hijack working memory away from rumination.
- Tracks streak and celebratory focus reset after 10 problems.

### 3. 🎨 Quick Sketch Challenge (Timed Drawing with Palette)
- Displays recognizable reference prompts (Coffee Mug, Space Rocket, Leaf, Sailboat, Bicycle, Cat, Lightbulb, House).
- Timed countdown sprint (45 seconds) to spur focused physical drawing.
- Full touch-friendly HTML5 canvas with touch-action isolation (drawing without unwanted scrolling).
- 8-color palette (White, Sky Blue, Indigo, Emerald, Sun Yellow, Coral, Rose, Eraser) + 3 brush sizes (Fine, Medium, Bold).
- Undo, Clear, and Save/Download sketch actions.

### 4. ⚡ Energizing Motivational Quotes
- Mindset-sparking quote banner right on the home screen.
- Targeted quotes from Seneca, Dan Millman, Thich Nhat Hanh, and more to reframe overthinking and inspire immediate grounded action.
- "Spark another ⚡" one-tap rotation.

### 5. 🎶 Stop Overthinking Ambient Tunes
- 100% offline synthesized real-time soundscapes using the Web Audio API (0 KB audio downloads):
  - 🧘 **Zen Harmonics**: Warm meditative drone and pentatonic wind chime tones.
  - 🧠 **Alpha 10Hz**: Binaural acoustic beat tuned to 10Hz to guide the brain from anxious beta to calm alpha state.
  - 🌧️ **Gentle Rain**: Filtered natural pink noise rain simulation with acoustic drops.
  - 🌌 **Cosmic Pad**: Ethereal swelling pad with dynamic resonant filter sweeps.
- Includes volume slider, master play/pause, and header indicator.

### 6. 🌬️ Breathing Reset (60 Seconds)
- Guided 4s inhale / 4s exhale pacing with a smooth expanding and contracting circle.
- Alternates between **Breathe in** and **Breathe out**.
- Start, Pause, Resume, and Restart controls.
- Increments `minutesRedirected` (+1) and `resetsToday` (+1).
- Concludes with: *“Done ✓ — You don't need to solve the thought right now.”*

### 7. ⚡ Reflex Game (Break the Loop)
- Reaction-time test designed to forcefully draw attention into the physical present.
- Instructions: *“Wait for GO. Tap as fast as you can.”*
- Random delay between 0.8s and 3.0s.
- Early tap detection: *“Too early 😄 Try again.”*
- 5 fast rounds with average reaction time calculation and personal best tracking.
- Concludes with: *“Nice. Your attention is back in the room.”*

### 8. ⏱️ 5-Minute Focus Redirect
- Four concrete, physical or mental redirect actions:
  - 🧹 **Clean one small area**: Desk, sink, or shelf clutter.
  - 🚶 **Walk for 5 minutes**: Feel footsteps and movement.
  - 💧 **Drink water + stretch**: Physical hydration and shoulder rolls.
  - 🧠 **Solve one easy problem**: Concrete micro-riddles / math to shift gears.
- 5:00 countdown timer with Pause, Resume, and Reset.
- Concludes with: *“5 minutes done. Check in with yourself.”*

### 9. 📝 Thought Dump (Park It Safely)
- Title: *“Park the thought.”*
- Instruction: *“Write the thought exactly as it is. Then ask: Can I act on this in the next 10 minutes?”*
- Placeholder: *“What keeps coming back to my mind?”*
- **Park it** button saves the thought safely to local browser storage.
- Grounding feedback: *“Parked. You don't have to solve it right now.”*
- Easily clear the thought anytime with **Clear thought**.

### 10. ⚙️ Preferences & Accessibility
- **Calm Dark / Soft Light mode**: defaults to deep calm navy (`#080b11`).
- **Reduce Motion toggle**: instant suppression of spring and scale animations.
- **Gentle Audio Synthesizer**: soothing tones created using the Web Audio API without downloading external audio files.
- **Wipe stats & clear thought**: full control over local data.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 + TypeScript (strict typing with `verbatimModuleSyntax`).
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`.
- **Icons**: Lucide React.
- **Audio Engine**: Custom Web Audio API ambient soundscape and tone generator (`AmbientSynth.ts`, `GentleAudio.ts`).
- **Canvas Engine**: HTML5 touch-enabled 2D drawing canvas with stroke history (`QuickSketch.tsx`).
- **Storage**: LocalStorage with automatic daily rollover for `resetsToday`.
- **Deployment**: Live on Vercel with SPA routing rewrite configuration.

---

## 🚀 Running the App Locally

```bash
# Navigate to the project directory
cd reset-app

# Start the local development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```
