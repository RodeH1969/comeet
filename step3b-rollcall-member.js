// My Building Portal — Meeting Controller
// STEP 3B — One member at a time (loops once per committee member)
// Per spec: full name used for committee members (names-vs-titles rule).
// Four options: Present / Running late / Sent an apology / Not present.

(function () {
  function render(container, opts) {
    const members = MeetingState.state.committeeMembers;
    const index = opts.index || 0;
    const member = members[index];

    if (!member) {
      // Roll call finished — move to proxy declaration (3C)
      Router.goTo("step3c");
      return;
    }

    UI.topbar(container, "Step 3 of 9 — Roll Call", members.length, index + 1);
    const screen = UI.screen(container);

    UI.heading(screen, member.name);
    screen.appendChild(UI.el("p", "lead", member.role));

    UI.sayBox(screen, member.name + " — " + member.role + " — are you present?");

    UI.spacer(screen);

    const grid = UI.el("div", "rollcall-grid");
    screen.appendChild(grid);

    function choose(status) {
      MeetingState.state.rollCall[member.id] = status;
      if (status === "late") {
        MeetingState.state.lateArrivals[member.id] = { confirmedArrivedAt: null };
      }
      Router.goTo("step3b", { index: index + 1 });
    }

    UI.button(grid, "✓ Present", "gold", () => choose("present"));
    UI.button(grid, "⏱ Running late", "navy", () => choose("late"));
    UI.button(grid, "✉ Sent an apology", "navy", () => choose("apology"));
    UI.button(grid, "✗ Not present", "grey", () => choose("absent"));
  }

  Router.registerStep("step3b", render);
})();
