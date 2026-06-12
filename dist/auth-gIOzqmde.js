import { jsx as E, Fragment as V } from "react/jsx-runtime";
import * as L from "yup";
import { object as j } from "yup";
import { useEffect as d, useState as J, useCallback as $ } from "react";
import { useNavigate as F, useLocation as T, useSearchParams as w, useParams as z, createSearchParams as B } from "react-router";
import { useSelector as G } from "react-redux";
import "@reduxjs/toolkit/query/react";
import "@reduxjs/toolkit";
import { makeOAuth2StorageKey as K, generateOAuth2CodeChallenge as H } from "./utils/auth.es.js";
import "@mui/material";
import { generateSecureRandomString as Q } from "./utils/general.es.js";
import "@mui/icons-material";
import "./schemas-XzwqFsHM.js";
import "./urls-DCXZ2b50.js";
import { tryValidateSync as R } from "./utils/schema.es.js";
import "./palette-CYwuLBW7.js";
import W from "./utils/cookies.es.js";
import { getSessionMetadataCookieName as X } from "./utils/settings.es.js";
function _() {
  const e = F(), o = q();
  return (a, t = void 0) => {
    if (typeof a == "number") e(a);
    else {
      const { next: r = !0, ...n } = t || {};
      e(
        r && "next" in o ? o.next : a,
        n
      );
    }
  };
}
function k() {
  return T();
}
function q(e, o) {
  const a = Object.fromEntries(w()[0].entries());
  return e ? R(a, j(e), o) : a;
}
function Y(e, o) {
  const a = z();
  return e ? R(a, j(e), o) : a;
}
function ve({
  shape: e,
  children: o,
  onValidationError: a,
  onValidationSuccess: t = () => {
  },
  validateOptions: r
}) {
  const n = Y(e, r), c = _();
  return d(
    () => {
      n ? t(n) : a(c);
    },
    []
    // eslint-disable-line react-hooks/exhaustive-deps
  ), n ? o(n) : /* @__PURE__ */ E(V, {});
}
function S(e) {
  return G(e) ? JSON.parse(W.get(X())) : void 0;
}
S.predefine = (e) => () => S(e);
function ye(e, o, a = {}) {
  const { userType: t, next: r = !0 } = a, { pathname: n } = k(), c = _(), u = S(e), i = t && (!u || u.user_type !== t);
  return d(() => {
    i && c({
      pathname: "/login" + {
        teacher: "/teacher",
        student: "/student",
        indy: "/independent"
      }[t],
      search: r ? B({ next: n }).toString() : void 0
    });
  }, [c, i, t, r, n]), i ? /* @__PURE__ */ E(V, {}) : typeof o == "function" ? o(u) : o;
}
function Z(e, o = 32, a = "state") {
  const t = K(e, a), r = sessionStorage.getItem(t), [n, c] = J();
  d(() => {
    let i;
    r && r.length === o ? i = r : (i = Q(o), sessionStorage.setItem(t, i)), c(i);
  }, [t, r, o]);
  const u = $(() => {
    sessionStorage.removeItem(t), c(void 0);
  }, [t]);
  return [n, u];
}
function D(e, o = 128, a = "codeChallenge") {
  const t = K(e, a), r = sessionStorage.getItem(t), [n, c] = J();
  d(() => {
    let i;
    if (r) {
      const s = JSON.parse(r);
      typeof s == "object" && s && "verifier" in s && typeof s.verifier == "string" && s.verifier.length === o && "challenge" in s && typeof s.challenge == "string" && "method" in s && s.method === "S256" && (i = {
        verifier: s.verifier,
        challenge: s.challenge,
        method: s.method
      });
    }
    i ? c(i) : H(o).then((s) => {
      sessionStorage.setItem(
        t,
        JSON.stringify(s)
      ), c(s);
    }).catch((s) => {
      s && console.error(s);
    });
  }, [t, r, o]);
  const u = $(() => {
    sessionStorage.removeItem(t), c(void 0);
  }, [t]);
  return [n, u];
}
function U({
  provider: e,
  authUri: o,
  clientId: a,
  redirectUri: t,
  scope: r,
  responseType: n = "code",
  accessType: c = "offline",
  prompt: u,
  useSessionMetadata: i,
  useLoginMutation: s,
  onCreateSession: C,
  onRetrieveSession: P
}) {
  const [g, A] = Z(e), [
    {
      verifier: h,
      challenge: x,
      method: I
    } = {},
    O
  ] = D(e), [
    M,
    {
      originalArgs: m = {},
      isLoading: N,
      isError: b
    }
  ] = s(), v = i(), p = _(), f = q({ code: L.string(), state: L.string() }) || {}, l = k().state || {};
  if (d(() => {
    f.code && f.state && p(".", {
      // Removes the URL containing the search params from the history stack.
      replace: !0,
      // Ensure we don't break the auth flow by navigating to another page.
      next: !1,
      // Store the search params in the page's state instead.
      state: { code: f.code, state: f.state }
    });
  }, [f.code, f.state, p]), d(() => {
    v ? P(v) : (
      // If the state and code verifier have been generated...
      g && h && // ...and the page's state contains a code...
      l.code && // ...and the page's state contains the stored state...
      l.state === g && // ...and the login endpoint was not called with the current values or has
      // not returned an error...
      (m.code !== l.code || m.code_verifier !== h || m.redirect_uri !== t || !b) && // ...and the login endpoint is not currently being called...
      !N && M({
        code: l.code,
        code_verifier: h,
        redirect_uri: t
      }).unwrap().then(C).catch(() => {
        p(".", {
          replace: !0,
          state: {
            notifications: [
              {
                props: {
                  error: !0,
                  children: "Failed to login. Please try again."
                }
              }
            ]
          }
        });
      }).finally(() => {
        A(), O();
      })
    );
  }, [
    p,
    t,
    // State
    g,
    l.state,
    A,
    // Code
    h,
    l.code,
    O,
    // Login
    M,
    N,
    b,
    m.code,
    m.code_verifier,
    m.redirect_uri,
    // Session
    v,
    C,
    P
  ]), g && x && I) {
    const y = {
      client_id: a,
      redirect_uri: t,
      scope: r,
      response_type: n,
      access_type: c,
      state: g,
      code_challenge: x,
      code_challenge_method: I
    };
    return u && (y.prompt = u), [
      o + "?" + new URLSearchParams(y).toString(),
      y
    ];
  }
  return [];
}
const _e = (e) => U(
  // @ts-expect-error value is assignable
  "useSessionMetadata" in e ? e : { ...e, useSessionMetadata: S }
);
export {
  ye as a,
  Z as b,
  D as c,
  _e as d,
  _ as e,
  k as f,
  q as g,
  Y as h,
  ve as i,
  S as u
};
//# sourceMappingURL=auth-gIOzqmde.js.map
