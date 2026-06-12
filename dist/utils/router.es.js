import { generatePath as p } from "react-router";
import "react/jsx-runtime";
import "react";
import "@mui/icons-material";
import "@mui/material";
import "../palette-CYwuLBW7.js";
import "../auth-BXLedrZH.js";
function x(t, n = {}) {
  function c(i, l, e) {
    typeof i.__ == "object" && (e = e ? { ...e, ...i.__ } : i.__);
    const g = typeof t == "string" && e ? p(t, e) : t;
    Object.entries(i).forEach(([_, o]) => {
      if (_ !== "__")
        if (o = o, typeof o == "string") {
          if (typeof g == "string" && (!l || _ !== "_")) {
            let f = g + o;
            f.endsWith("/") && (f = f.slice(0, -1)), i[_] = f;
          }
        } else
          c(o, !1, e);
    });
  }
  const r = { ...n, _: typeof t == "string" ? t : "", __: t };
  return t === "" ? r._ = "/" : c(r, !0), r;
}
function E(t, n) {
  return t.__[n];
}
export {
  E as getParam,
  x as path
};
//# sourceMappingURL=router.es.js.map
