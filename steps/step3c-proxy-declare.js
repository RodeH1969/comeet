// My Building Portal — Meeting Controller
// STEP 3C — Declare proxies (simplified — proxies already collected pre-meeting)
// Per spec revision: proxies are no longer discovered live. This step is just
// the spoken declaration for the transcript, one say-box per proxy already
// entered during Pre-Meeting Intro Flow Screen 3.

(function () {
  function render(container, opts) {
    const proxies = MeetingState.state.proxies;
    const index = (opts && opts.index) || 0;

    UI.topbar(container, "Step 3 of 9 — Roll Call", Math.max(proxies.length, 1), index + 1);
    const screen = UI.screen(container);

    if (proxies.length === 0) {
      UI.heading(screen, "No proxies");
      UI.sayBox(screen, "No written proxies have been received for this meeting.");
      UI.spacer(screen);
      const actions = UI.actions(screen);
      UI.button(actions, "Said it — declare quorum → Next: Quorum", "gold", () => {
        Router.goTo("step3d");
      });
      return;
    }

    const proxy = proxies[index];
    if (!proxy) {
      // All proxies declared — move to quorum
      Router.goTo("step3d");
      return;
    }

    UI.heading(screen, "Proxy " + (index + 1) + " of " + proxies.length);
    UI.sayBox(
      screen,
      "I hold a written proxy from " + proxy.from.name +
      " in favour of " + proxy.to.name + ". This is noted for the record."
    );

    UI.spacer(screen);
    const actions = UI.actions(screen);
    const isLast = index + 1 >= proxies.length;
    UI.button(
      actions,
      isLast ? "Said it — declare quorum → Next: Quorum" : "Said it — next proxy",
      "gold",
      () => Router.goTo("step3c", { index: index + 1 })
    );
  }

  Router.registerStep("step3c", render);
})();
