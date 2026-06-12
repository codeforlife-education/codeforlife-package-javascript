import { jsx as t, Fragment as m } from "react/jsx-runtime";
import { Link as s, IconButton as a, ListItem as c, Tab as p } from "@mui/material";
import { useEffect as L } from "react";
import { Link as o } from "react-router";
import "@mui/icons-material";
import "./palette-CYwuLBW7.js";
import { e as u } from "./auth-BXLedrZH.js";
const x = (n) => /* @__PURE__ */ t(s, { component: o, ...n }), B = (n) => /* @__PURE__ */ t(a, { ...n, component: o }), T = (n) => /* @__PURE__ */ t(c, { ...n, component: o }), $ = (n) => /* @__PURE__ */ t(p, { ...n, component: o }), j = ({
  delta: n,
  to: e,
  ...i
}) => {
  const r = u();
  return L(() => {
    typeof n == "number" ? r(n) : r(e, i);
  }, [r, n, e, i]), /* @__PURE__ */ t(m, {});
};
export {
  x as L,
  j as N,
  B as a,
  T as b,
  $ as c
};
//# sourceMappingURL=Navigate-DBH0qlzU.js.map
