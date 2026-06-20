// My Building Portal — Meeting Controller
// Minimal step router. Each step module registers itself via
// Router.registerStep(key, renderFn) and the router shows one at a time
// inside #screen-container. This intentionally has no framework —
// it just swaps innerHTML for the active step.

window.Router = (function () {
  const steps = {};
  let currentKey = null;

  function registerStep(key, renderFn) {
    steps[key] = renderFn;
  }

  function goTo(key, opts) {
    if (!steps[key]) {
      console.error("Router: no step registered for key:", key);
      return;
    }
    currentKey = key;
    const container = document.getElementById("screen-container");
    container.innerHTML = "";
    steps[key](container, opts || {});
    window.scrollTo(0, 0);
  }

  function current() {
    return currentKey;
  }

  return { registerStep, goTo, current };
})();
