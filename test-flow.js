// My Building Portal — Meeting Controller
// Regression test: walks the full flow built so far (pre-meeting proxy entry
// through Step 3D quorum) using jsdom, with no real browser required.
// Run with: node test-flow.js
//
// As more steps are built, extend this script rather than replacing it,
// so earlier steps stay covered.

const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

async function main() {
  const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
  const dom = new JSDOM(html, { url: "http://localhost/", runScripts: "dangerously" });
  const window = dom.window;

  // Inject scripts directly (deterministic — avoids relying on jsdom's
  // local-file <script src> loading, which is unreliable without a server).
  const files = [
    "state.js", "router.js", "ui.js",
    "steps/premeeting-proxy.js", "steps/step2-open.js",
    "steps/step3a-rollcall-intro.js", "steps/step3b-rollcall-member.js",
    "steps/step3c-proxy-declare.js", "steps/step3d-quorum.js",
    "steps/step4-placeholder.js",
  ];
  for (const f of files) {
    window.eval(fs.readFileSync(path.join(__dirname, f), "utf8"));
  }

  function clickContains(substr) {
    const buttons = Array.from(window.document.querySelectorAll("button"));
    const btn = buttons.find(b => b.textContent.includes(substr));
    if (!btn) {
      throw new Error(
        "Button containing \"" + substr + "\" not found. Available: " +
        buttons.map(b => "\"" + b.textContent.trim() + "\"").join(", ")
      );
    }
    if (btn.disabled) throw new Error("Button is disabled: " + substr);
    btn.click();
  }

  function h1Text() {
    const h = window.document.querySelector("h1");
    return h ? h.textContent.trim() : "(no h1 — flag-only screen)";
  }

  function log(stepName) {
    console.log("[" + stepName + "] " + h1Text());
  }

  let failures = 0;
  function check(label, cond) {
    if (!cond) {
      console.error("  FAIL:", label);
      failures++;
    } else {
      console.log("  pass:", label);
    }
  }

  window.Router.goTo("proxy-ask");
  log("boot");

  // Enter one proxy
  clickContains("Yes — enter a proxy");
  let opts = Array.from(window.document.querySelectorAll(".option-btn"));
  opts[0].click(); // Stephen Cohn as "from"
  clickContains("Continue");
  opts = Array.from(window.document.querySelectorAll(".option-btn"));
  opts[0].click(); // first eligible "to"
  clickContains("Continue");
  log("flag: voting member");
  clickContains("Confirmed — proceed");
  log("flag: 2-meeting cap");
  clickContains("Confirmed — proceed");
  log("proxy confirmed");

  check("1 proxy recorded", window.MeetingState.state.proxies.length === 1);

  clickContains("Done");
  clickContains("Continue");
  log("step2");
  check("step2 has a say-box", !!window.document.querySelector(".say-box"));

  clickContains("Said it — take the roll call");
  clickContains("Said it — call first member");

  const choices = ["✓ Present", "✓ Present", "✓ Present", "✓ Present",
                    "⏱ Running late", "✉ Sent an apology", "✗ Not present"];
  choices.forEach(c => clickContains(c));

  clickContains("Said it"); // step3c -> step3d (1 proxy declared)
  log("step3d quorum");

  const present = window.MeetingState.presentCount();
  check("presentCount is 5 (4 present + 1 proxy)", present === 5);
  check("quorum met", window.MeetingState.quorumMet() === true);
  check("quorum-met banner shown", !!window.document.querySelector(".quorum-met"));

  clickContains("Quorum declared");
  log("step4 placeholder reached");

  if (failures > 0) {
    console.error("\n" + failures + " CHECK(S) FAILED");
    process.exit(1);
  }
  console.log("\nALL CHECKS PASSED");
}

main().catch(err => {
  console.error("TEST FAILED:", err.message);
  process.exit(1);
});
