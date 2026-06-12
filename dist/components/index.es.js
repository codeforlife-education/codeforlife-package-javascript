import { i as ut } from "../index-BE-uSkLK.js";
import { i as pt } from "../index-jajHW612.js";
import { L as dt, a as gt, b as ht, c as Lt, N as yt } from "../Navigate-CCGSrY0W.js";
import { L as vt } from "../LinkButton-Bx0ZVW3I.js";
import { i as kt } from "../index-IXGAdLKG.js";
import { jsx as a, jsxs as B } from "react/jsx-runtime";
import { Tooltip as w, IconButton as O, Button as z, useScrollTrigger as S, AppBar as E, Container as M, Toolbar as $, List as j, Grid as k, Link as U, Stack as D, TablePagination as N, Box as _ } from "@mui/material";
import b, { useEffect as C, cloneElement as A } from "react";
import { wrap as F } from "../utils/general.es.js";
import { ContentCopy as G, Download as V } from "@mui/icons-material";
import { C as Bt } from "../Countdown-7u1DzDR6.js";
import { I as Ct } from "../Image-mkNhOo5p.js";
import { h as Y } from "../api-vqkeMjJB.js";
import { S as wt } from "../api-vqkeMjJB.js";
import { u as H } from "../api-Cs4Y-WeI.js";
const Z = ({
  open: e = !1,
  onClick: o,
  ...t
}) => {
  const [r, i] = b.useState(e);
  return b.useEffect(() => {
    i(e);
  }, [e]), /* @__PURE__ */ a(
    w,
    {
      open: r,
      onMouseOver: () => {
        r || i(!0);
      },
      onMouseLeave: () => {
        i(!1);
      },
      onClick: F(
        {
          after: () => {
            i(!r);
          }
        },
        o
      ),
      ...t
    }
  );
}, I = ({
  content: e,
  children: o = /* @__PURE__ */ a(G, {}),
  ...t
}) => /* @__PURE__ */ a(
  O,
  {
    "data-testid": "copy-icon-button",
    onClick: () => {
      navigator.clipboard.writeText(e);
    },
    ...t,
    children: o
  }
), tt = ({
  children: e = "Download",
  endIcon: o = /* @__PURE__ */ a(V, {}),
  file: t,
  ...r
}) => {
  let i, s;
  if ("mimeType" in t) {
    const { text: c, mimeType: u, name: n, charset: m = "utf-8" } = t;
    let { extension: f } = t;
    f || (f = "." + { plain: "txt", csv: "csv" }[u]), s = {
      download: n + f,
      href: `data:text/${u};charset=${m},${encodeURIComponent(c)}`
    };
  } else
    i = URL.createObjectURL(t), s = { href: i };
  return C(() => () => {
    i && URL.revokeObjectURL(i);
  }, [i]), /* @__PURE__ */ a(z, { endIcon: o, ...r, ...s, children: e });
}, et = ({
  containerProps: e,
  toolbarProps: o,
  elevation: t = 4,
  children: r,
  ...i
}) => {
  const s = S({
    disableHysteresis: !0,
    threshold: 0
  });
  return A(
    /* @__PURE__ */ a(E, { elevation: t, ...i, children: /* @__PURE__ */ a(M, { ...e, children: /* @__PURE__ */ a($, { ...o, children: r }) }) }),
    {
      position: s ? "fixed" : "sticky"
    }
  );
}, ot = ({
  children: e,
  inputProps: o,
  ...t
}) => /* @__PURE__ */ B(z, { component: "label", ...t, children: [
  e,
  /* @__PURE__ */ a("input", { type: "file", hidden: !0, ...o })
] }), it = ({
  styleType: e,
  listProps: o = {},
  pl: t = 4,
  children: r
}) => {
  const { sx: i, ...s } = o, c = { display: "list-item" };
  return /* @__PURE__ */ a(
    j,
    {
      sx: {
        listStyleType: e,
        pl: t,
        ".MuiListItem-root": c,
        ".MuiListItemText-root": c,
        ...i
      },
      ...s,
      children: r
    }
  );
}, rt = ({
  rows: e,
  containerProps: o = {},
  globalItemProps: t
}) => {
  const r = Number(o.columns ?? 12), i = (u) => Math.floor(r / u), s = (u, n, m) => Math.floor(n / i(m)) * e.length + u, c = (u, n) => {
    const m = e[0].length % i(n);
    return m !== 0 && u === e[0].length - 1 ? (r - m * n) / 2 : 0;
  };
  return /* @__PURE__ */ a(k, { container: !0, ...o, children: e.map(
    (u, n) => u.map(({ element: m, itemProps: f = {} }, l) => /* @__PURE__ */ a(
      k,
      {
        order: {
          xs: s(n, l, t.size.xs),
          sm: s(n, l, t.size.sm),
          md: s(n, l, t.size.md),
          lg: s(n, l, t.size.lg),
          xl: s(n, l, t.size.xl)
        },
        offset: {
          xs: c(l, t.size.xs),
          sm: c(l, t.size.sm),
          md: c(l, t.size.md),
          lg: c(l, t.size.lg),
          xl: c(l, t.size.xl)
        },
        ...t,
        ...f,
        children: m
      },
      `${n}-${l}`
    ))
  ) });
}, nt = ({
  elementId: e,
  options: o,
  ...t
}) => /* @__PURE__ */ a(
  U,
  {
    ...t,
    onClick: () => {
      document.getElementById(e)?.scrollIntoView(o);
    }
  }
), st = ({
  children: e,
  useLazyListQuery: o,
  preferCacheValue: t,
  filters: r,
  page: i = 0,
  rowsPerPage: s = 50,
  rowsPerPageOptions: c = [50, 100, 150],
  stackProps: u,
  onRowsPerPageChange: n,
  onPageChange: m,
  ...f
}) => {
  const [l, y] = o(), [{ limit: d, page: x, offset: h }, v] = H({
    page: i,
    limit: s
  });
  C(
    () => {
      l({ limit: d, offset: h, ...r }, t);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      l,
      d,
      h,
      // eslint-disable-next-line react-hooks/exhaustive-deps,@typescript-eslint/no-unsafe-assignment
      ...Object.values(r || {}),
      t
    ]
  );
  const { count: T, max_limit: L } = y.data || {};
  return L && (c = c.filter(
    (p) => p <= L
  )), /* @__PURE__ */ B(D, { ...u, children: [
    Y(
      y,
      ({ data: p }) => e(p, {
        limit: d,
        page: x,
        offset: h,
        count: T,
        maxLimit: L
      })
    ),
    /* @__PURE__ */ a(
      N,
      {
        component: "div",
        count: T ?? 0,
        rowsPerPage: d,
        onRowsPerPageChange: (p) => {
          v({ limit: parseInt(p.target.value), page: 0 }), n && n(p);
        },
        page: x,
        onPageChange: (p, g) => {
          v(({ limit: R }) => ({ limit: R, page: g })), m && m(p, g);
        },
        rowsPerPageOptions: c.sort((p, g) => p - g),
        ...f
      }
    )
  ] });
}, at = ({
  src: e,
  style: o = {},
  ...t
}) => /* @__PURE__ */ a(
  _,
  {
    component: "iframe",
    width: "100%",
    src: e,
    title: "YouTube video player",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
    style: { border: "0px", aspectRatio: "16 / 9", ...o },
    ...t
  }
);
export {
  Z as ClickableTooltip,
  I as CopyIconButton,
  Bt as Countdown,
  tt as DownloadFileButton,
  et as ElevatedAppBar,
  Ct as Image,
  ot as InputFileButton,
  it as ItemizedList,
  dt as Link,
  vt as LinkButton,
  gt as LinkIconButton,
  ht as LinkListItem,
  Lt as LinkTab,
  yt as Navigate,
  rt as OrderedGrid,
  nt as ScrollIntoViewLink,
  wt as SyncError,
  st as TablePagination,
  at as YouTubeVideo,
  ut as forms,
  pt as pages,
  kt as tables
};
//# sourceMappingURL=index.es.js.map
