import { jsx as u, Fragment as a, jsxs as f } from "react/jsx-runtime";
import { useState as s } from "react";
import { Typography as h } from "@mui/material";
import "./auth-gIOzqmde.js";
import { u as l } from "./general-D7Hqi3gj.js";
import "react-router";
import "yup";
import "@mui/icons-material";
import "./palette-CYwuLBW7.js";
const d = ({
  seconds: t,
  start: m = !0,
  onEnd: i,
  ...n
}) => {
  t = Math.floor(t);
  const r = l(t)[0], [p, e] = s(!m);
  r === 0 && !p && (e(!0), i()), t = Math.floor(r % 60);
  const o = Math.floor(r / 60);
  return /* @__PURE__ */ u(a, { children: r > 0 && /* @__PURE__ */ f(h, { ...n, children: [
    o > 0 && `${o} ${o > 1 ? "mins" : "min"} `,
    t > 0 && `${t} ${t > 1 ? "secs" : "sec"}`
  ] }) });
};
export {
  d as C
};
//# sourceMappingURL=Countdown-7u1DzDR6.js.map
