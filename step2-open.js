// My Building Portal — Meeting Controller
// STEP 2 — Open the Meeting (1 screen)
// Per spec Section 6, Step 2: single say-box, live time auto-stamped.

(function () {
  function render(container) {
    UI.topbar(container, "Step 2 of 9", 1, 1);
    const screen = UI.screen(container);

    UI.heading(screen, "Open the meeting");

    const s = MeetingState.state;
    const liveTime = MeetingState.nowLiveTimeString();
    const sayText =
      "I declare this " + s.meetingType + " for " + s.buildingName +
      " CTS " + s.ctsNumber + " open. The time is now " +
      "<span class=\"live-time\">" + liveTime + "</span>.";

    UI.sayBox(screen, sayText);

    UI.spacer(screen);
    const actions = UI.actions(screen);
    UI.button(actions, "Said it — take the roll call → Next: Step 3 of 9", "gold", () => {
      MeetingState.state.meetingOpenedAt = MeetingState.nowISOString();
      Router.goTo("step3a");
    });
  }

  Router.registerStep("step2", render);
})();
