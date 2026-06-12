function u(i, n) {
  return Object.values(i).flatMap(
    (e) => n(e) ? [e] : typeof e == "object" && e !== null ? u(e, n) : []
  );
}
function p(i) {
  return u(
    i,
    (n) => typeof n == "number"
  );
}
function y(i) {
  return u(
    i,
    (n) => typeof n == "string"
  );
}
function j(i, n) {
  typeof n == "string" && (n = n.split("."));
  let e = i;
  for (let r = 0; r < n.length; r++)
    if (e = e[n[r]], r !== n.length - 1 && (typeof e != "object" || e === null))
      return;
  return e;
}
function b(i, n = ".") {
  function e(r, s) {
    return Object.fromEntries(
      Object.entries(r).map(([f, t]) => {
        const o = [...s, f];
        return typeof t == "object" && t !== null && (t = e(t, o)), [o.join(n), t];
      })
    );
  }
  return e(i, []);
}
function l(i, n = ".") {
  function e(r, s) {
    return Object.entries(r).map(([f, t]) => {
      const o = [...s, f], c = o.join(n);
      return typeof t == "object" && t !== null ? [c, ...e(t, o)] : [c];
    }).flat();
  }
  return e(i, []);
}
function g(i, n, e = ".") {
  function r(s, f) {
    return Object.fromEntries(
      Object.entries(s).map(([t, o]) => {
        const c = [...f, t];
        return typeof o == "object" && o !== null && !(o instanceof Date) && (o = r(o, c)), n.includes(c.join(e)) ? [] : [t, o];
      }).filter((t) => t.length)
    );
  }
  return n.length ? r(i, []) : i;
}
function h(i, n = ".") {
  function e(r, s) {
    return Array.isArray(r) ? Object.fromEntries(
      r.map((f) => [
        f,
        [...s, f].join(n)
      ])
    ) : Object.fromEntries(
      Object.entries(r).map(([f, t]) => {
        const o = [...s, f];
        return typeof t == "object" && t !== null ? t = e(t, o) : typeof t == "string" && (t = { [t]: [...o, t].join(n) }), [f, t];
      })
    );
  }
  return e(i, []);
}
function m(i) {
  const n = {};
  function e(r, s, f) {
    if (typeof s == "string")
      r[s] = f;
    else
      for (const [t, o] of Object.entries(s))
        t in r || (r[t] = {}), e(r[t], o, f);
  }
  for (const [r, s] of Object.entries(i)) {
    const f = Number(r), t = !isNaN(f) && r.trim() !== "" ? f : r;
    e(n, s, t);
  }
  return n;
}
export {
  m as createIdRegistry,
  h as createPathStrings,
  g as excludeKeyPaths,
  p as flattenNumberValues,
  y as flattenStringValues,
  l as getKeyPaths,
  j as getNestedProperty,
  b as withKeyPaths
};
//# sourceMappingURL=object.es.js.map
