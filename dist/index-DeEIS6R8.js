import { jsx as r, Fragment as d, jsxs as p } from "react/jsx-runtime";
import { Box as B, Container as L, Stack as x, Typography as g, IconButton as S, Tabs as j, Tab as I } from "@mui/material";
import { I as N } from "./Image-mkNhOo5p.js";
import { useState as _, useEffect as y, Children as k } from "react";
import { useLocation as P, useParams as Y, useNavigate as E, generatePath as R } from "react-router";
import { ErrorOutline as A, InfoOutlined as V, CloseOutlined as q, ChevronLeft as z, ChevronRight as F } from "@mui/icons-material";
import { p as O, t as M, s as W, a as b } from "./palette-CYwuLBW7.js";
import { a as D } from "./auth-BXLedrZH.js";
import { L as T } from "./LinkButton-BeFBbR7x.js";
import { object as G, string as H } from "yup";
import { tryValidateSync as J } from "./utils/schema.es.js";
const m = ({ boxProps: s, ...t }) => /* @__PURE__ */ r(B, { ...s, children: /* @__PURE__ */ r(L, { ...t }) }), w = ({
  open: s = !0,
  error: t = !1,
  onClose: l,
  children: n,
  bgcolor: o = "secondary"
}) => {
  const [c, a] = _(s);
  if (y(() => {
    a(s);
  }, [s]), !c) return /* @__PURE__ */ r(d, {});
  const i = O[o].contrastText;
  return /* @__PURE__ */ r(
    m,
    {
      boxProps: {
        bgcolor: {
          secondary: "#ffd23b",
          tertiary: "#08bafc"
        }[o]
      },
      sx: { paddingY: "5px" },
      children: /* @__PURE__ */ p(x, { direction: "row", alignItems: "center", gap: 2, children: [
        t ? /* @__PURE__ */ r(A, { htmlColor: i }) : /* @__PURE__ */ r(V, { htmlColor: i }),
        /* @__PURE__ */ r(g, { variant: "body2", color: i, mb: 0, children: n }),
        /* @__PURE__ */ r(
          S,
          {
            style: { marginLeft: "auto" },
            onClick: () => {
              a(!1), l !== void 0 && l();
            },
            children: /* @__PURE__ */ r(q, { htmlColor: i })
          }
        )
      ] })
    }
  );
}, K = ({
  selectIsLoggedIn: s,
  children: t,
  session: l
}) => {
  const { state: n } = P();
  let { scroll: o, notifications: c } = n || {};
  return o = o || { x: 0, y: 0 }, c = c || [], y(() => {
    window.scroll(o.x, o.y);
  }, [o.x, o.y]), /* @__PURE__ */ r(d, { children: D(
    s,
    (a) => {
      if (typeof t == "function" && (t = t(a)), c.length) {
        const i = k.toArray(t);
        return c.forEach((f, u) => {
          i.splice(
            f.index ?? u,
            0,
            /* @__PURE__ */ r(w, { ...f.props })
          );
        }), i;
      }
      return t;
    },
    l
  ) });
}, Q = ({
  header: s,
  subheader: t,
  textAlign: l = "start",
  imageProps: n,
  button1Props: o,
  button2Props: c,
  bgcolor: a = "primary"
}) => {
  const i = O[a].contrastText;
  return /* @__PURE__ */ r(
    m,
    {
      boxProps: {
        bgcolor: {
          primary: b[500],
          secondary: W[500],
          tertiary: M[500]
        }[a]
      },
      sx: { paddingY: 0 },
      children: /* @__PURE__ */ p(
        x,
        {
          direction: "row",
          alignItems: "center",
          justifyContent: l,
          gap: 2,
          children: [
            /* @__PURE__ */ p(
              x,
              {
                py: {
                  xs: "80px",
                  md: n !== void 0 ? 0 : "100px"
                },
                textAlign: l,
                children: [
                  /* @__PURE__ */ r(
                    g,
                    {
                      variant: "h2",
                      color: i,
                      mb: t !== void 0 ? void 0 : 0,
                      children: s
                    }
                  ),
                  t !== void 0 && /* @__PURE__ */ r(
                    g,
                    {
                      color: i,
                      variant: "h4",
                      mb: o !== void 0 ? void 0 : 0,
                      children: t
                    }
                  ),
                  /* @__PURE__ */ p(x, { direction: "row", gap: 2, children: [
                    o !== void 0 && /* @__PURE__ */ r(T, { ...o }),
                    c !== void 0 && /* @__PURE__ */ r(T, { ...c })
                  ] })
                ]
              }
            ),
            n !== void 0 && /* @__PURE__ */ r(
              N,
              {
                ...n,
                display: { xs: "none", md: "block" },
                maxWidth: "320px",
                marginLeft: "auto"
              }
            )
          ]
        }
      )
    }
  );
}, U = ({ header: s, tabs: t, originalPath: l, value: n = 0 }) => {
  const o = Y(), c = E(), [a, i] = _(
    n < 0 ? 0 : n >= t.length ? t.length - 1 : n
  ), f = t.map((e) => e.label), u = t.map((e) => e.children), h = t.map((e) => e.path);
  return y(() => {
    i(n);
  }, [n]), y(() => {
    const e = J(
      o,
      G({
        tab: H().oneOf(h).required()
      })
    )?.tab;
    e !== void 0 && i(h.indexOf(e));
  }, [o, h]), /* @__PURE__ */ p(d, { children: [
    /* @__PURE__ */ r(
      m,
      {
        boxProps: { bgcolor: b[500] },
        sx: { paddingY: "100px" },
        className: "flex-center",
        children: /* @__PURE__ */ r(
          g,
          {
            textAlign: "center",
            variant: "h2",
            style: { color: "white" },
            mb: 0,
            children: s
          }
        )
      }
    ),
    /* @__PURE__ */ r(
      m,
      {
        boxProps: { bgcolor: b[300] },
        sx: { paddingY: "6px" },
        className: "flex-center",
        children: /* @__PURE__ */ r(
          j,
          {
            value: a,
            onChange: (e, v) => {
              c(
                R(l, {
                  tab: h[v]
                })
              );
            },
            ScrollButtonComponent: ({
              disabled: e,
              onClick: v,
              direction: C
            }) => /* @__PURE__ */ r(d, { children: e === !1 && /* @__PURE__ */ r(
              S,
              {
                onClick: v,
                style: {
                  padding: 0,
                  [C === "left" ? "marginRight" : "marginLeft"]: "15px",
                  color: "white"
                },
                children: C === "left" ? /* @__PURE__ */ r(d, { children: /* @__PURE__ */ r(z, {}) }) : /* @__PURE__ */ r(d, { children: /* @__PURE__ */ r(F, {}) })
              }
            ) }),
            children: f.map((e) => /* @__PURE__ */ r(I, { disableRipple: !0, label: e }, e))
          }
        )
      }
    ),
    u[a]
  ] });
}, cr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Banner: Q,
  Notification: w,
  Page: K,
  Section: m,
  TabBar: U
}, Symbol.toStringTag, { value: "Module" }));
export {
  Q as B,
  w as N,
  K as P,
  m as S,
  U as T,
  cr as i
};
//# sourceMappingURL=index-DeEIS6R8.js.map
