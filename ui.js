// My Building Portal — Meeting Controller
// Shared UI helpers. Keeps every step's markup consistent with the
// design system in style.css without copy-pasting boilerplate.

window.UI = (function () {

  function el(tag, className, html) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function topbar(container, stepLabel, dotsTotal, dotsActive) {
    const bar = el("div", "topbar");
    const label = el("span", "step-label", stepLabel);
    const dots = el("div", "progress-dots");
    for (let i = 0; i < dotsTotal; i++) {
      dots.appendChild(el("div", "dot" + (i < dotsActive ? " active" : "")));
    }
    bar.appendChild(label);
    bar.appendChild(dots);
    container.appendChild(bar);
    return bar;
  }

  function screen(container) {
    const s = el("div", "screen visible");
    container.appendChild(s);
    return s;
  }

  function heading(parent, text) {
    parent.appendChild(el("h1", null, text));
  }

  function lead(parent, text) {
    parent.appendChild(el("p", "lead", text));
  }

  // sayBox: the mandatory "SAY THIS OUT LOUD" box per the spec's Sacrosanct Rule.
  function sayBox(parent, text) {
    const box = el("div", "say-box");
    box.appendChild(el("div", "say-label", "Say this out loud"));
    box.appendChild(el("div", "say-text", text));
    parent.appendChild(box);
    return box;
  }

  // flagBox: a reminder the app cannot verify — chair always makes the call.
  function flagBox(parent, text) {
    const box = el("div", "flag-box");
    box.appendChild(el("span", "flag-label", "Reminder"));
    box.appendChild(document.createTextNode(text));
    parent.appendChild(box);
    return box;
  }

  function spacer(parent) {
    parent.appendChild(el("div", "spacer"));
  }

  function actions(parent) {
    const a = el("div", "actions");
    parent.appendChild(a);
    return a;
  }

  function button(parent, label, variant, onClick, opts) {
    opts = opts || {};
    const b = el("button", "btn btn-" + variant, label);
    b.type = "button";
    if (opts.disabled) b.disabled = true;
    b.addEventListener("click", onClick);
    parent.appendChild(b);
    return b;
  }

  function confirmBanner(parent, title, subtitle) {
    const b = el("div", "confirm-banner");
    b.innerHTML = "<b>" + title + "</b>" + (subtitle || "");
    parent.appendChild(b);
    return b;
  }

  function optionList(parent, items, labelFn, onSelect) {
    const list = el("div", "option-list");
    let selectedBtn = null;
    items.forEach(item => {
      const btn = el("button", "option-btn", labelFn(item));
      btn.type = "button";
      btn.addEventListener("click", () => {
        if (selectedBtn) selectedBtn.classList.remove("selected");
        btn.classList.add("selected");
        selectedBtn = btn;
        onSelect(item, btn);
      });
      list.appendChild(btn);
    });
    parent.appendChild(list);
    return list;
  }

  return {
    el, topbar, screen, heading, lead, sayBox, flagBox,
    spacer, actions, button, confirmBanner, optionList,
  };
})();
