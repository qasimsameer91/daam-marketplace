// Inlined by the locale layout before first paint. Keep in sync with hooks/use-theme.ts.
try {
  var t = localStorage.getItem("daam-theme");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch {}
