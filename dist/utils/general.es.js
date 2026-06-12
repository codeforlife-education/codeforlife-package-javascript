function c(e, t = "_blank") {
  window.open(e, t);
}
function f(e, t) {
  return (...o) => {
    e.before !== void 0 && e.before(...o);
    let n;
    return t !== void 0 && (n = t(...o)), e.after !== void 0 && e.after(...o), n;
  };
}
function a(e) {
  Object.entries(e).forEach(([t, o]) => {
    typeof o == "object" && a(o);
    const n = t.replace(
      /_+[a-z]/g,
      (r) => r[r.length - 1].toUpperCase()
    );
    delete e[t], e[n] = o;
  });
}
function i(e) {
  Object.entries(e).forEach(([t, o]) => {
    typeof o == "object" && i(o);
    const n = t.replace(
      /[A-Z]/g,
      (r) => `_${r.toLowerCase()}`
    );
    delete e[t], e[n] = o;
  });
}
const s = new Date(0, 0, 0);
function l(e, t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
  const o = window.crypto.getRandomValues(new Uint8Array(e));
  let n = "";
  for (let r = 0; r < e; r++)
    n += t.charAt(o[r] % t.length);
  return n;
}
export {
  s as MIN_DATE,
  i as camelCaseToSnakeCase,
  l as generateSecureRandomString,
  c as openInNewTab,
  a as snakeCaseToCamelCase,
  f as wrap
};
//# sourceMappingURL=general.es.js.map
