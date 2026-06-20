// My Building Portal — Meeting Controller
// STEP 4 — Confirm Previous Minutes
// PLACEHOLDER STUB — not yet built. Wired here only so Step 3D has
// somewhere real to go to. Replace with the actual Step 4A/4B/4C build.

(function () {
  function render(container) {
    UI.topbar(container, "Step 4 of 9", 1, 1);
    const screen = UI.screen(container);
    UI.heading(screen, "Step 4 — Confirm previous minutes");
    UI.lead(screen, "Not yet built. This is a placeholder so the flow from Step 3 can be tested end to end.");
    UI.spacer(screen);
  }

  Router.registerStep("step4a", render);
})();
