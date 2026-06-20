// My Building Portal — Meeting Controller
// STEP 3D — Declare quorum
// Automatically counts present members + confirmed late arrivals + proxies
// against the required quorum, and shows the chair the right say-box.

(function () {
  function render(container) {
    UI.topbar(container, "Step 3 of 9 — Roll Call", 1, 1);
    const screen = UI.screen(container);

    const present = MeetingState.presentCount();
    const required = MeetingState.state.quorumRequired;
    const met = MeetingState.quorumMet();

    UI.heading(screen, "Quorum");

    const banner = UI.el("div", "quorum-banner " + (met ? "quorum-met" : "quorum-not-met"));
    banner.appendChild(UI.el("div", "quorum-count", present + " of " + required));
    banner.appendChild(UI.el("div", "quorum-sub", met ? "Quorum is met" : "Quorum is not met"));
    screen.appendChild(banner);

    if (met) {
      UI.sayBox(screen, "Quorum is present. I declare this meeting properly constituted and open for business.");
    } else {
      UI.sayBox(screen, "Quorum is not present. This meeting cannot proceed to formal business. I will now adjourn, or we may continue informally without the ability to pass resolutions.");
    }

    UI.spacer(screen);
    const actions = UI.actions(screen);

    if (met) {
      UI.button(actions, "Quorum declared — move to minutes → Next: Step 4 of 9", "gold", () => {
        MeetingState.state.quorumDeclaredAt = MeetingState.nowISOString();
        Router.goTo("step4a");
      });
    } else {
      UI.button(actions, "Said it — adjourn meeting", "navy", () => {
        alert("Adjournment flow not yet built.");
      });
      UI.button(actions, "Continue informally (no resolutions)", "grey", () => {
        alert("Informal-continuation flow not yet built.");
      });
    }
  }

  Router.registerStep("step3d", render);
})();
