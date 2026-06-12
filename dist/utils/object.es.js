function p(o, n) {
  typeof n == "string" && (n = n.split("."));
  let e = o;
  for (let i = 0; i < n.length; i++)
    if (e = e[n[i]], i !== n.length - 1 && (typeof e != "object" || e === null))
      return;
  return e;
}
function h(o, n = ".") {
  function e(i, f) {
    return Object.fromEntries(
      Object.entries(i).map(([c, t]) => {
        const r = [...f, c];
        return typeof t == "object" && t !== null && (t = e(t, r)), [r.join(n), t];
      })
    );
  }
  return e(o, []);
}
function u(o, n = ".") {
  function e(i, f) {
    return Object.entries(i).map(([c, t]) => {
      const r = [...f, c], s = r.join(n);
      return typeof t == "object" && t !== null ? [s, ...e(t, r)] : [s];
    }).flat();
  }
  return e(o, []);
}
function j(o, n, e = ".") {
  function i(f, c) {
    return Object.fromEntries(
      Object.entries(f).map(([t, r]) => {
        const s = [...c, t];
        return typeof r == "object" && r !== null && !(r instanceof Date) && (r = i(r, s)), n.includes(s.join(e)) ? [] : [t, r];
      }).filter((t) => t.length)
    );
  }
  return n.length ? i(o, []) : o;
}
function y(o, n = ".") {
  function e(i, f) {
    return Object.fromEntries(
      Object.entries(i).map(([c, t]) => {
        const r = [...f, c];
        return typeof t == "object" && t !== null ? t = e(t, r) : t = `${r.join(n)}${n}${t}`, [c, t];
      })
    );
  }
  return e(o, []);
}
export {
  j as excludeKeyPaths,
  u as getKeyPaths,
  p as getNestedProperty,
  y as prefixValuesWithKeyPath,
  h as withKeyPaths
};
//# sourceMappingURL=object.es.js.map
