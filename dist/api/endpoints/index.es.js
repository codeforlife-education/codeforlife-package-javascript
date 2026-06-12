import "@reduxjs/toolkit/query/react";
import { t, b as s } from "../../api-vqkeMjJB.js";
import { u as o } from "../../urls-DCXZ2b50.js";
import { a as q, b as y } from "../../session-CJM1Czfv.js";
const a = "AuthFactor";
function T(e) {
  return {
    listAuthFactors: e.query({
      query: (r) => ({
        url: s(o.authFactor.list, { search: r }),
        method: "GET"
      }),
      providesTags: t(a, { includeListTag: !0 })
    })
  };
}
const u = "Class";
function p(e) {
  return {
    retrieveClass: e.query({
      query: (r) => ({
        url: s(o.class.detail, { url: { id: r } }),
        method: "GET"
      }),
      providesTags: t(u)
    }),
    listClasses: e.query({
      query: (r) => ({
        url: s(o.class.list, { search: r }),
        method: "GET"
      }),
      providesTags: t(u, { includeListTag: !0 })
    })
  };
}
const l = "School";
function g(e) {
  return {
    retrieveSchool: e.query({
      query: (r) => ({
        url: s(o.school.detail, { url: { id: r } }),
        method: "GET"
      }),
      providesTags: t(l)
    })
  };
}
const i = "User";
function h(e) {
  return {
    retrieveUser: e.query({
      query: (r) => ({
        url: s(o.user.detail, { url: { id: r } }),
        method: "GET"
      }),
      providesTags: t(i)
    }),
    listUsers: e.query({
      query: (r) => ({
        url: s(o.user.list, { search: r }),
        method: "GET"
      }),
      providesTags: t(i, { includeListTag: !0 })
    })
  };
}
export {
  a as AUTH_FACTOR_TAG,
  u as CLASS_TAG,
  l as SCHOOL_TAG,
  i as USER_TAG,
  q as buildLoginEndpoint,
  y as buildLogoutEndpoint,
  T as getReadAuthFactorEndpoints,
  p as getReadClassEndpoints,
  g as getReadSchoolEndpoints,
  h as getReadUserEndpoints
};
//# sourceMappingURL=index.es.js.map
