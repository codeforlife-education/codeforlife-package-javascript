function u(s, t) {
  typeof t == "string" && (t = t.split("."));
  let e = s;
  for (let n = 0; n < t.length; n++)
    if (e = e[t[n]], n !== t.length - 1 && (typeof e != "object" || e === null))
      return;
  return e;
}
function l(s, t = ".") {
  function e(n, f) {
    return Object.entries(n).map(([o, i]) => {
      const r = [...f, o], c = r.join(t);
      return typeof i == "object" && i !== null ? [c, ...e(i, r)] : [c];
    }).flat();
  }
  return e(s, []);
}
function p(s, t, e = ".") {
  function n(f, o) {
    return Object.fromEntries(
      Object.entries(f).map(([i, r]) => {
        const c = [...o, i];
        return typeof r == "object" && r !== null && !(r instanceof Date) && (r = n(r, c)), t.includes(c.join(e)) ? [] : [i, r];
      }).filter((i) => i.length)
    );
  }
  return t.length ? n(s, []) : s;
}
export {
  u as a,
  p as e,
  l as g
};
//# sourceMappingURL=object-CcXAH2vY.js.map
