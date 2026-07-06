import { fetchBaseQuery as u, createApi as d } from "@reduxjs/toolkit/query/react";
import "@reduxjs/toolkit";
import { b as l } from "../session-CJM1Czfv.js";
import { getCsrfCookie as s } from "../utils/auth.es.js";
import { i as y } from "../api-vqkeMjJB.js";
import { s as C } from "../schemas-XzwqFsHM.js";
import { u as w } from "../urls-DCXZ2b50.js";
const g = [
  // These are the tags for the common models used throughout our system.
  // https://github.com/codeforlife-education/codeforlife-package-python/tree/main/codeforlife/user/models
  // NOTE: Don't use the "Teacher" and "Student" tags. Use "User" instead.
  "User",
  "School",
  "Class",
  "AuthFactor"
];
function x({
  serviceApiUrl: c,
  logoutAction: p,
  tagTypes: f = []
}) {
  const i = u({
    baseUrl: `${c}/`,
    credentials: "include",
    prepareHeaders: (t, o) => {
      const { type: r, arg: e } = o, m = typeof e == "string" ? "GET" : e.method || "GET";
      if (r === "mutation" || !y(m)) {
        const a = s();
        a && t.set("x-csrftoken", a);
      }
      return t;
    }
  }), n = d({
    // https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#implementing-a-custom-basequery
    baseQuery: async (t, o, r) => {
      if (o.type === "mutation" && s() === void 0) {
        const { error: e } = await i(
          { url: "/csrf/cookie/", method: "GET" },
          o,
          {}
        );
        e !== void 0 && console.error(e), s();
      }
      return await i(t, o, r);
    },
    tagTypes: [...g, ...f],
    endpoints: () => ({})
  });
  return n.injectEndpoints({
    endpoints: (t) => ({
      logout: l(n, t, p)
    })
  });
}
export {
  x as createApi,
  C as schemas,
  g as tagTypes,
  w as urls
};
//# sourceMappingURL=index.es.js.map
