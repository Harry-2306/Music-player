# Vanilla JS Music Player Engine
> A lightweight, event-driven audio streaming player built with native JavaScript, HTML5 Audio components, and CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Language](https://img.shields.io/badge/Language-JavaScript%20ES6-yellow.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20%2F%20DOM-blue.svg)]()

This repository contains the core logical state engine for a browser-based custom media player. Moving away from heavy external frameworks, the app implements pure Vanilla JS to control the browser's audio interface lifecycle—handling real-time asynchronous data streams, cross-track indexing, continuous time-update loops, and dynamic UI progress synchronized with live audio components.

---

## Technical Architectures & Engineering Features

* **Bi-Directional State Routing:** Implements circular boundary constraints to route audio indices smoothly forward or backward over the array queue, catching edge limits to create a fluid, continuous loop.
* **Polled Autoplay Pipeline:** Leverages an asynchronous state observer pattern via interval clocks to continuously parse media completion, auto-clearing progress values and executing clean track transitions.
* **Math-Synced Time Progression:** Dynamically scales raw HTML5 Media properties to custom input seek controls via percentage math ratios, handling linear translations across current times and durations.
* **Multi-Action Interaction Layers:** Features discrete click vs. double-click event abstractions on media controllers, allowing users to selectively restart a current track or skip backward completely inside the index list.
* **Interactive Range Mapping:** Uses algorithmic mapping logic on UI elements to translate input values directly into standardized decimal arrays for native output volume control.

---

## Mechanics & State Flow

The tracking state engine continuously monitors event parameters to balance user interface values with backend browser tasks:
### Time & Progress Calculation
The seek bar synchronization computes percentage mapping values derived straight from operational asset parameters:

$$\text{ProgressBar Value} = \left(\frac{\text{Audio.currentTime}}{\text{Audio.duration}}\right) \times 100$$

---

## System Stack & Component Map

* **Core Interface Context:** Native HTML5 Audio DOM creation APIs.
* **Asynchronous Updates:** High-precision Javascript Event Loops (setInterval).
* **Input Interfaces:** Linear Range Sliders, DOM Interface Triggers (addEventListener).

---
