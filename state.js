// My Building Portal — Meeting Controller
// Shared meeting state. Every step module reads from and writes to this
// single object instead of managing its own isolated state. This is the
// vanilla-JS equivalent of a small store, kept deliberately simple.

window.MeetingState = (function () {

  // Committee members pre-loaded from portal (Newstead Central CTS 49744).
  // Voting committee members only. Non-committee operational staff
  // (Body Corporate Manager, Caretaker) are tracked separately and are
  // never offered as proxy-giver/receiver options or roll-call voters,
  // per the spec's names-vs-titles rule.
  const committeeMembers = [
    { id: "cohn",      name: "Stephen Cohn",       role: "Chairperson" },
    { id: "woodhouse", name: "Matthew Woodhouse",  role: "Secretary" },
    { id: "hall",      name: "Jason Hall",         role: "Treasurer" },
    { id: "nguyen",    name: "Elisa Nguyen",       role: "Committee Member" },
    { id: "forrai",    name: "David Forrai",       role: "Committee Member" },
    { id: "andison",   name: "Melissa Andison",    role: "Committee Member" },
    { id: "aggarwal",  name: "Nishtha Aggarwal",   role: "Committee Member" },
  ];

  // Non-voting, non-committee staff — referred to by title only, never by name.
  const nonVotingStaff = [
    { id: "bcm",      title: "Body Corporate Manager" },
    { id: "caretaker", title: "Caretaker" },
  ];

  const QUORUM_REQUIRED = 4; // 4 of 7 voting members, per spec Section 7

  const state = {
    meetingType: "Committee Meeting",
    buildingName: "Newstead Central",
    ctsNumber: "49744",
    committeeMembers,
    nonVotingStaff,
    quorumRequired: QUORUM_REQUIRED,

    chairName: "Stephen Cohn", // set by magic link flow in the full app

    // Step 1 — Recording
    recording: {
      method: null,       // "external" | "fallback"
      confirmedStart: false,
      confirmedStop: false,
    },

    // Step 2 — Open the Meeting
    meetingOpenedAt: null, // ISO timestamp

    // Pre-meeting proxies (collected before Step 1)
    // Each entry: { from: member, to: member }
    proxies: [],

    // Step 3 — Roll Call
    // rollCall[memberId] = "present" | "late" | "apology" | "absent"
    rollCall: {},
    lateArrivals: {}, // memberId -> { confirmedArrivedAt: ISOString | null }

    // Step 3D — Quorum
    quorumDeclaredAt: null,

    meetingClosedAt: null,
  };

  function getMemberById(id) {
    return committeeMembers.find(m => m.id === id) || null;
  }

  function presentCount() {
    const presentOrLate = Object.entries(state.rollCall)
      .filter(([id, status]) => status === "present").length;
    const arrivedLate = Object.values(state.lateArrivals)
      .filter(l => l.confirmedArrivedAt).length;
    const proxyCount = state.proxies.length;
    return presentOrLate + arrivedLate + proxyCount;
  }

  function quorumMet() {
    return presentCount() >= state.quorumRequired;
  }

  function nowLiveTimeString() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function nowISOString() {
    return new Date().toISOString();
  }

  return {
    state,
    getMemberById,
    presentCount,
    quorumMet,
    nowLiveTimeString,
    nowISOString,
  };
})();
