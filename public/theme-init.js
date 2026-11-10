// Applies the saved theme before first paint (no inline script needed). Keep in sync with hooks/use-theme.ts.
try {
  var t = localStorage.getItem("daam-theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch {}
