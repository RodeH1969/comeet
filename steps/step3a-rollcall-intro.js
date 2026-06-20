// My Building Portal — Meeting Controller
// STEP 3A — Introduce roll call (1 screen)

(function () {
  function render(container) {
    UI.topbar(container, "Step 3 of 9 — Roll Call", 5, 1);
    const screen = UI.screen(container);

    UI.heading(screen, "Roll call");
    UI.sayBox(screen, "I will now call the roll. Please confirm your name and role when called.");

    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Said it — call first member → Next: Roll call", "gold", () => {
      Router.goTo("step3b", { index: 0 });
    });
  }

  Router.registerStep("step3a", render);
})();
