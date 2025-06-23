## Karaoke Lyrics Player — Design & Development Documentation (R3F Edition)

### 1. Introduction

A next‑generation, web‑powered karaoke application: single‑page, React‑based, blending 2D/3D visuals via React Three Fiber (R3F). Users upload an audio track and timestamped lyrics file (.lrc), then enjoy a synchronized, visually immersive karaoke experience. The player features a dynamic R3F background (e.g., animated water or subtle particle effects), crisp typographic rendering, responsive editing, and modular theming.

### 2. Objectives & Goals

1. **Engaging Visuals**: Leverage WebGL via R3F to create a subtle animated backdrop (water ripples, bokeh particles, or gradient sky).
2. **Precise Sync**: Millisecond‑accurate lyric highlighting in time with audio playback.
3. **Editable & Extensible**: Users can swap themes, fonts, background scenes, and styling with minimal code changes.
4. **Modular Architecture**: Decoupled components for audio I/O, lyric parsing, UI controls, R3F canvas, and theming.
5. **Developer‑Friendly**: Packaged as an NPM module, with clear exports, TypeScript support, and example usage.

### 3. Design Principles

* **Separation of Concerns**: Presentation (R3F canvas, DOM overlay) separate from business logic (sync controller, parser).
* **Declarative Configuration**: Themes, typography settings, and R3F scene parameters defined via JSON or React props.
* **Performance First**: Optimize render loops with `useFrame`, minimal re‑rendering, sprite‑based particle systems.
* **Accessibility**: ARIA roles, keyboard nav for play/pause, high‑contrast text options.
* **Responsive & Mobile‑First**: Scalable UI that adapts from 320px to 4K displays.

### 4. Technical Stack

* **Framework**: React 18, Vite as build tool
* **3D**: React Three Fiber, @react-three/drei
* **Animation**: react-spring (for DOM + 3D animations), framer-motion-3d (optional)
* **Parsing**: Custom LRC parser in TypeScript
* **UI**: Tailwind CSS (utility‑first styling), Headless UI for controls
* **State Management**: React Context + hooks (no external state library)
* **Packaging**: Rollup to build library bundle (ESM + CJS)
* **Testing**: Jest for unit tests, Playwright for E2E
* **CI/CD**: GitHub Actions for build/test/publish

### 5. Architecture Overview

```
User Input (audio + .lrc)
        |
v  file loaders
        |
v  AudioContext + <audio>
        |
v  SyncService (timestamps)
        |
v  LyricsContext ──> LyricsOverlay Component
        |
v  ReactDOM Layer (DOM lyrics, controls)

React App Root
 ├─ R3F Canvas
 │    ├─ SceneManager
 │    │    ├─ Background (water, particles)
 │    │    └─ Lighting / Postprocessing
 │    └─ PerformanceMonitor
 ├─ ControlsPanel (upload, play/pause)
 └─ LyricsOverlay (DOM-synced lyrics)
```

### 6. Folder & Package Structure

```
/ (root)
├─ /src
│   ├─ App.tsx               # root React component
│   ├─ index.tsx             # ReactDOM.render + R3F <Canvas>
│   ├─ /components
│   │   ├─ ControlsPanel.tsx
│   │   ├─ LyricsOverlay.tsx
│   │   ├─ R3FScene.tsx      # encapsulates Drei + custom meshes
│   │   └─ AudioPlayer.tsx
│   ├─ /contexts
│   │   ├─ LyricsContext.tsx
│   │   └─ AudioContext.tsx
│   ├─ /hooks
│   │   ├─ useLRCParser.ts
│   │   └─ useSync.ts
│   ├─ /themes
│   │   ├─ defaultTheme.ts
│   │   └─ darkTheme.ts
│   ├─ /types
│   │   └─ index.d.ts
│   └─ /utils
│       └─ parseLRC.ts
├─ /public
│   └─ assets (fonts, textures)
├─ package.json
├─ tailwind.config.js
├─ tsconfig.json
├─ vite.config.ts
├─ rollup.config.js
└─ README.md
```

### 7. Component Breakdown

| Component         | Responsibilities                                              | Key Props/Context              |
| ----------------- | ------------------------------------------------------------- | ------------------------------ |
| **App**           | Bootstraps Contexts, Canvas, global styles                    | —                              |
| **ControlsPanel** | File inputs, playback controls, theme selector                | onAudioLoad, onLyricsLoad      |
| **AudioPlayer**   | Wraps `<audio>`, exposes `currentTime`, `play()`, `pause()`   | ref to audio element           |
| **LyricsOverlay** | Renders `<div>`s for each line, highlights active line        | lyrics\[], activeIndex         |
| **R3FScene**      | Sets up `<Canvas>`, adds `Sky`, `Water`/`Particles`, postFX   | theme settings (colors, speed) |
| **SyncService**   | Hook (`useSync`) that listens to audio time and updates index | audioRef, lyrics\[]            |
| **useLRCParser**  | Hook that parses raw LRC text into sorted timestamp array     | rawText                        |

### 8. R3F Integration

```tsx
// R3FScene.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Water } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export function R3FScene({ theme }) {
  const waterRef = useRef<THREE.Mesh>(null!);
  // Animate water normals
  useFrame(({ clock }) => {
    if (waterRef.current) {
      waterRef.current.material.normalMapOffset = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <Water
        ref={waterRef}
        args={[new THREE.PlaneGeometry(100, 100)]}
        waterNormals={new THREE.TextureLoader().load(theme.waterNormal)}
        sunDirection={new THREE.Vector3(1, 1, 1)}
        distortionScale={2.5}
      />
      {/* Optional particle or gradient shader mesh here */}
    </Canvas>
  );
}
```

### 9. Theme Configuration

```ts
// defaultTheme.ts
export const defaultTheme = {
  bgGradient: ['#1e3c72', '#2a5298'],
  textColor: '#ffffff',
  font: 'Inter, sans-serif',
  waterNormal: '/assets/waternormals.jpg',
};
```

### 10. Package.json (Example)

```json
{
  "name": "karaoke-r3f-player",
  "version": "1.0.0",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "vite",
    "build": "rollup -c",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "prepare": "npm run build"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@react-three/fiber": "^10.0.0",
    "@react-three/drei": "^9.0.0",
    "react-spring": "^9.4.0",
    "tailwindcss": "^3.0.0"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### 11. Build & Deployment

1. **Local Dev**: `npm run dev` → localhost:3000 with HMR for React + R3F.
2. **Production Build**: `npm run build` → outputs `/dist` for publishing to NPM or static host.
3. **Publish**: ensure semantic versioning, `npm publish` → GitHub Pages or Netlify for demo.

### Getting Started

1. Install dependencies with `npm install`.
2. Start the dev server using `npm run dev` and open `http://localhost:3000`.
3. Run unit tests via `npm test`.
4. Create a library build using `npm run build`.

### 12. Implementation Roadmap

1. Scaffold with Vite + React + R3F template.
2. Build LRC parser and sync hook, unit tests.
3. Create LyricsOverlay + ControlsPanel.
4. Integrate R3FScene with basic gradient shader or Water from Drei.
5. Wire parser → sync → overlay highlighting.
6. Add theming, Tailwind config, dark/light toggles.
7. Write examples and Storybook stories.
8. Add tests (Jest, Playwright), CI pipeline.
9. Publish package, document in README.

### 13. Future Enhancements

* **Karaoke Scoring**: Microphone input analysis for pitch matching.
* **Advanced 3D Effects**: Particle lyrics that fly out of the water.
* **Mobile App**: Wrap in Capacitor/Electron for native distribution.
* **Lottie Integration**: Export AE lyric visuals as Lottie layers within R3F.

---

*Document generated for full-stack implementation of a karaoke player leveraging React Three Fiber and modern web technologies.*
