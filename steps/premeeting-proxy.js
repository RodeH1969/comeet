// My Building Portal — Meeting Controller
// PRE-MEETING — Proxy entry (Screen 3 of Pre-Meeting Intro Flow)
// Rebuilt to use shared MeetingState + UI helpers instead of standalone state.

(function () {
  let draft = { from: null, to: null };

  function listOptions(excludeId) {
    return MeetingState.state.committeeMembers.filter(m => m.id !== excludeId);
  }

  function renderAsk(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    UI.heading(screen, "Any written proxies before this meeting?");
    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Yes — enter a proxy", "gold", () => {
      draft = { from: null, to: null };
      Router.goTo("proxy-from");
    });
    UI.button(actions, "No proxies", "grey", () => Router.goTo("proxy-done"));
  }

  function renderFrom(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    UI.heading(screen, "Who is the proxy from?");
    const nextBtnHolder = { btn: null };
    UI.optionList(
      screen,
      MeetingState.state.committeeMembers,
      m => m.name + " — " + m.role,
      (m) => {
        draft.from = m;
        if (nextBtnHolder.btn) nextBtnHolder.btn.disabled = false;
      }
    );
    UI.spacer(screen);
    const actions = UI.actions(screen);
    nextBtnHolder.btn = UI.button(actions, "Continue", "gold", () => Router.goTo("proxy-to"), { disabled: true });
    UI.button(actions, "Back", "grey", () => Router.goTo("proxy-ask"));
  }

  function renderTo(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    UI.heading(screen, "Given to whom?");
    const nextBtnHolder = { btn: null };
    UI.optionList(
      screen,
      listOptions(draft.from ? draft.from.id : null),
      m => m.name + " — " + m.role,
      (m) => {
        draft.to = m;
        if (nextBtnHolder.btn) nextBtnHolder.btn.disabled = false;
      }
    );
    UI.spacer(screen);
    const actions = UI.actions(screen);
    nextBtnHolder.btn = UI.button(actions, "Continue", "gold", () => Router.goTo("proxy-flag-voting"), { disabled: true });
    UI.button(actions, "Back", "grey", () => Router.goTo("proxy-from"));
  }

  function renderFlagVoting(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    UI.flagBox(screen, "Proxies can only go to a voting committee member.");
    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Confirmed — proceed", "gold", () => Router.goTo("proxy-flag-cap"));
    UI.button(actions, "Back", "grey", () => Router.goTo("proxy-to"));
  }

  function renderFlagCap(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    UI.flagBox(screen, "Max 2 meetings per financial year. Expires at end of this meeting.");
    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Confirmed — proceed", "gold", () => {
      MeetingState.state.proxies.push({ from: draft.from, to: draft.to });
      Router.goTo("proxy-confirmed");
    });
    UI.button(actions, "Back", "grey", () => Router.goTo("proxy-flag-voting"));
  }

  function renderConfirmed(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    UI.heading(screen, "Recorded.");
    const last = MeetingState.state.proxies[MeetingState.state.proxies.length - 1];
    UI.confirmBanner(screen, last.from.name + " → " + last.to.name);
    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Add another proxy", "navy", () => {
      draft = { from: null, to: null };
      Router.goTo("proxy-from");
    });
    UI.button(actions, "Done", "gold", () => Router.goTo("proxy-done"));
  }

  function renderDone(container) {
    UI.topbar(container, "Pre-meeting setup", 1, 1);
    const screen = UI.screen(container);
    const proxies = MeetingState.state.proxies;
    UI.heading(
      screen,
      proxies.length === 0
        ? "No written proxies received."
        : (proxies.length === 1 ? "1 proxy recorded." : proxies.length + " proxies recorded.")
    );
    if (proxies.length > 0) {
      const list = UI.el("div", "row-list");
      proxies.forEach(p => {
        list.appendChild(UI.el("div", "row-item", p.from.name + " → " + p.to.name));
      });
      screen.appendChild(list);
    }
    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Continue → Next: Your 9 steps", "gold", () => {
      Router.goTo("step2"); // hands off into the live meeting flow
    });
  }

  Router.registerStep("proxy-ask", renderAsk);
  Router.registerStep("proxy-from", renderFrom);
  Router.registerStep("proxy-to", renderTo);
  Router.registerStep("proxy-flag-voting", renderFlagVoting);
  Router.registerStep("proxy-flag-cap", renderFlagCap);
  Router.registerStep("proxy-confirmed", renderConfirmed);
  Router.registerStep("proxy-done", renderDone);
})();
