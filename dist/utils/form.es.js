import { ValidationError as m } from "yup";
import { excludeKeyPaths as h, getKeyPaths as j, getNestedProperty as s } from "./object.es.js";
function b(t) {
  return typeof t == "object" && t !== null && "status" in t && t.status === 400 && "data" in t && typeof t.data == "object" && t.data !== null;
}
function g(t, a) {
  if (!b(t)) throw t;
  const i = Object.fromEntries(
    Object.entries(t.data).map(([n, c]) => (Array.isArray(c) && (c = c.join(". ")), [n, c]))
  );
  a(i);
}
function p(t, a, i) {
  const {
    include: n,
    onlyDirtyValues: c = !1,
    then: o,
    catch: y,
    finally: d
  } = i || {};
  let { exclude: f = [] } = i || {};
  return (r, l) => {
    let u = i && i.clean ? i.clean(r) : r;
    c && (f = [
      ...f,
      ...F(r, a).filter(
        (e) => !f.includes(e)
      )
    ]), n && (f = f.filter((e) => !n.includes(e))), f.length && (u = h(u, f)), t(u).unwrap().then((e) => {
      o && o(e, r, l);
    }).catch((e) => {
      y && y(e, r, l), g(e, l.setErrors);
    }).finally(() => {
      d && d(r, l);
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
  const n = s(t, i), c = s(a, i);
  return n !== c;
}
function F(t, a, i) {
  return Object.entries(E(t, a, i)).filter(
    ([
      n,
      // eslint-disable-line @typescript-eslint/no-unused-vars
      c
    ]) => !c
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
