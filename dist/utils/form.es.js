import { ValidationError as m } from "yup";
import { e as h, g as j, a as d } from "../object-CcXAH2vY.js";
function b(t) {
  return typeof t == "object" && t !== null && "status" in t && t.status === 400 && "data" in t && typeof t.data == "object" && t.data !== null;
}
function g(t, a) {
  if (!b(t)) throw t;
  const i = Object.fromEntries(
    Object.entries(t.data).map(([n, e]) => (Array.isArray(e) && (e = e.join(". ")), [n, e]))
  );
  a(i);
}
function p(t, a, i) {
  const {
    include: n,
    onlyDirtyValues: e = !1,
    then: o,
    catch: s,
    finally: y
  } = i || {};
  let { exclude: f = [] } = i || {};
  return (r, l) => {
    let u = i && i.clean ? i.clean(r) : r;
    e && (f = [
      ...f,
      ...F(r, a).filter(
        (c) => !f.includes(c)
      )
    ]), n && (f = f.filter((c) => !n.includes(c))), f.length && (u = h(u, f)), t(u).unwrap().then((c) => {
      o && o(c, r, l);
    }).catch((c) => {
      s && s(c, r, l), g(c, l.setErrors);
    }).finally(() => {
      y && y(r, l);
    });
  };
}
function x(t, a) {
  return async (i) => {
    try {
      await t.validate(i, a);
    } catch (n) {
      if (n instanceof m)
        return n.errors.join(". ");
      throw n;
    }
  };
}
function E(t, a, i) {
  return i || (i = j(t)), Object.fromEntries(
    i.map((n) => [n, w(t, a, n)])
  );
}
function w(t, a, i) {
  const n = d(t, i), e = d(a, i);
  return n !== e;
}
function F(t, a, i) {
  return Object.entries(E(t, a, i)).filter(
    ([
      n,
      // eslint-disable-line @typescript-eslint/no-unused-vars
      e
    ]) => !e
  ).map(([n]) => n);
}
export {
  F as getCleanNames,
  E as getDirty,
  w as isDirty,
  b as isFormError,
  x as schemaToFieldValidator,
  g as setFormErrors,
  p as submitForm
};
//# sourceMappingURL=form.es.js.map
