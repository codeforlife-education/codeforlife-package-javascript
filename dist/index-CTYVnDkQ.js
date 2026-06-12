import { jsx as o, Fragment as j, jsxs as k } from "react/jsx-runtime";
import { CircularProgress as H, Button as $, Autocomplete as K, TextField as N, FormControl as G, FormControlLabel as W, Checkbox as J, FormHelperText as M, InputAdornment as w, IconButton as Q } from "@mui/material";
import { useState as E, useEffect as B, forwardRef as X, Children as Z, useRef as ee } from "react";
import { S as te } from "./api-r7TLkejc.js";
import { u as re } from "./api-Cs4Y-WeI.js";
import { Field as T, Formik as oe, Form as ne } from "formik";
import { string as I, number as ie, bool as se, date as le, array as ae } from "yup";
import { schemaToFieldValidator as V, submitForm as ce } from "./utils/form.es.js";
import { a as y, g as ue } from "./object-CcXAH2vY.js";
import { d as de } from "./dayjs.min-Bgcc5o9W.js";
import { LocalizationProvider as he, DatePicker as pe } from "@mui/x-date-pickers";
import { AdapterDayjs as fe } from "@mui/x-date-pickers/AdapterDayjs";
import { EmailOutlined as me, PersonOutlined as ge, Visibility as be, VisibilityOff as ye } from "@mui/icons-material";
import "@reduxjs/toolkit/query/react";
import "@reduxjs/toolkit";
import "./utils/cookies.es.js";
import { C as Fe, a as Ce, u as Pe, U as Oe } from "./schemas-BEK79Cdh.js";
import "./urls-CQ1fgrB1.js";
const xe = ({
  useLazyListQuery: t,
  filterOptions: e,
  getOptionLabel: n,
  getOptionKey: r = (l) => l.id,
  searchKey: i,
  ...s
}) => {
  const [l, d] = E(""), [a, { isLoading: u, isError: c }] = t(), [{ limit: m, offset: p }, f] = re(), [{ options: C, hasMore: g }, _] = E({ options: {}, hasMore: !0 });
  B(
    () => {
      const F = { limit: m, offset: p, ...e };
      l && (F[i] = l), a(F, !0).unwrap().then(({ data: O, offset: S, limit: x, count: v }) => {
        _(({ options: D }) => {
          const R = { ...D };
          return O.forEach((U) => {
            R[r(U)] = U;
          }), { options: R, hasMore: S + x < v };
        });
      }).catch((O) => {
        O && console.error(O);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      a,
      m,
      p,
      i,
      l,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...Object.values(e || {})
    ]
  );
  let h = Object.keys(C);
  if (!h.length) return /* @__PURE__ */ o(j, {});
  typeof r(Object.values(C)[0]) == "number" && (h = h.map(Number));
  function b() {
    f(({ page: F, limit: O }) => ({ page: F + 1, limit: O }));
  }
  return /* @__PURE__ */ o(
    L,
    {
      options: h,
      getOptionLabel: (F) => n(C[F]),
      onInputChange: (F, O, S) => {
        d(S === "input" ? O : "");
      },
      ListboxComponent: X(({ children: F, ...O }, S) => {
        const x = Z.toArray(F);
        return u ? x.push(/* @__PURE__ */ o(H, {}, "is-loading")) : (c && x.push(/* @__PURE__ */ o(te, {}, "is-error")), g && x.push(
          /* @__PURE__ */ o($, { onClick: b, children: "Load more" }, "load-more")
        )), /* @__PURE__ */ o(
          "ul",
          {
            ...O,
            ref: S,
            onScroll: (v) => {
              !u && v.currentTarget.clientHeight + v.currentTarget.scrollTop >= v.currentTarget.scrollHeight && b();
            },
            children: x
          }
        );
      }),
      ...s
    }
  );
}, L = ({
  textFieldProps: t,
  options: e,
  validateOptions: n,
  ...r
}) => {
  const { id: i, name: s, required: l, ...d } = t, a = s.split("."), u = "not a valid option";
  let c = typeof e[0] == "string" ? I().oneOf(e, u) : ie().oneOf(e, u);
  l && (c = c.required());
  const m = {
    name: s,
    type: typeof e[0] == "string" ? "text" : "number",
    validate: V(c, n)
  };
  return /* @__PURE__ */ o(T, { ...m, children: ({ form: p, meta: f }) => {
    const C = y(
      p.values,
      a
    ), g = y(p.touched, a), _ = y(p.errors, a);
    return /* @__PURE__ */ o(
      K,
      {
        options: e,
        defaultValue: f.initialValue === "" ? void 0 : f.initialValue,
        renderInput: ({
          id: h,
          // eslint-disable-line @typescript-eslint/no-unused-vars
          ...b
        }) => /* @__PURE__ */ o(
          N,
          {
            id: i ?? s,
            name: s,
            required: l,
            type: "text",
            value: C,
            error: g && !!_,
            helperText: g && _,
            ...d,
            ...b
          }
        ),
        onChange: (h, b) => {
          p.setFieldValue(s, b ?? void 0, !0);
        },
        onBlur: p.handleBlur,
        ...r
      }
    );
  } });
}, Te = ({
  id: t,
  name: e,
  formControlLabelProps: n,
  required: r = !1,
  errorMessage: i = "this is a required field",
  validateOptions: s,
  ...l
}) => {
  const d = e.split(".");
  let a = se();
  r && (a = a.oneOf([!0], i));
  const u = {
    name: e,
    type: "checkbox",
    validate: V(a, s)
  };
  return /* @__PURE__ */ o(T, { ...u, children: ({ form: c, meta: m }) => {
    const p = y(c.touched, d), f = y(c.errors, d), C = y(
      c.values,
      d
    ), g = p && !!f;
    return /* @__PURE__ */ k(G, { error: g, required: r, children: [
      /* @__PURE__ */ o(
        W,
        {
          control: /* @__PURE__ */ o(
            J,
            {
              defaultChecked: m.initialValue,
              id: t ?? e,
              name: e,
              value: C,
              onChange: c.handleChange,
              onBlur: c.handleBlur,
              ...l
            }
          ),
          ...n
        }
      ),
      g && /* @__PURE__ */ o(M, { children: f })
    ] });
  } });
}, _e = ({
  textFieldProps: t,
  ...e
}) => {
  const {
    name: n = "country",
    label: r = "Country",
    placeholder: i = "Select your country",
    ...s
  } = t || {};
  return /* @__PURE__ */ o(
    L,
    {
      options: Ce,
      getOptionLabel: (l) => Fe[l],
      textFieldProps: { name: n, label: r, placeholder: i, ...s },
      ...e
    }
  );
}, Se = ({
  name: t,
  required: e,
  minDate: n,
  maxDate: r,
  validateOptions: i,
  ...s
}) => {
  const l = t.split(".");
  function d(c) {
    return c.locale("en-gb").format("L");
  }
  let a = le();
  e && (a = a.required()), n && (a = a.min(
    n,
    `this field must be after or equal to ${d(n)}`
  )), r && (a = a.max(
    r,
    `this field must be before or equal to ${d(r)}`
  ));
  const u = {
    name: t,
    type: "date",
    validate: V(a, i)
  };
  return /* @__PURE__ */ o(T, { ...u, children: ({ form: c }) => {
    const m = y(c.errors, l), p = y(c.touched, l);
    let f = y(
      c.values,
      l
    );
    f = f ? de(f) : null;
    function C(g) {
      c.setFieldValue(
        t,
        g && g.isValid() ? g.format("YYYY-MM-DD") : null,
        !0
      );
    }
    return /* @__PURE__ */ o(
      he,
      {
        dateAdapter: fe,
        adapterLocale: "en-gb",
        children: /* @__PURE__ */ o(
          pe,
          {
            name: t,
            value: f,
            minDate: n,
            maxDate: r,
            onChange: C,
            slotProps: {
              textField: {
                id: t,
                // @ts-expect-error value is compatible
                onChange: (g) => {
                  C(g);
                },
                onBlur: c.handleBlur,
                required: e,
                error: p && !!m,
                helperText: p && m
              }
            },
            ...s
          }
        )
      }
    );
  } });
}, A = ({
  id: t,
  name: e,
  schema: n,
  type: r = "text",
  required: i = !1,
  dirty: s = !1,
  unique: l = !1,
  uniqueCaseInsensitive: d = !1,
  split: a,
  validateOptions: u,
  ...c
}) => {
  const [m, p] = E(""), f = e.split(".");
  function C() {
    let h = n;
    if (h = i ? h.required() : h.optional(), s && !a && (h = h.notOneOf(
      [m],
      "cannot be initial value"
    )), !a) return h;
    let b = ae().of(h);
    return b = i ? b.required().min(1) : b.optional(), (l || d) && (b = b.test({
      message: "cannot have duplicates",
      test: (P) => Array.isArray(P) && P.length >= 2 && P.every((F) => typeof F == "string") ? new Set(
        d ? P.map((F) => F.toLowerCase()) : P
      ).size === P.length : !0
    })), s && (b = b.notOneOf(
      [m],
      "cannot be initial value"
    )), b;
  }
  const g = {
    name: e,
    type: r,
    validate: V(C(), u)
  };
  return /* @__PURE__ */ o(T, { ...g, children: ({ form: h }) => {
    const b = y(
      h.initialValues,
      f
    ), P = y(
      h.values,
      f
    ), F = y(h.errors, f), O = y(h.touched, f);
    return B(() => {
      p(b);
    }, [b]), B(() => {
      h.setFieldValue(
        e,
        a && typeof P == "string" ? P.split(a) : P,
        !0
      );
    }, [P]), /* @__PURE__ */ o(
      N,
      {
        id: t ?? e,
        name: e,
        type: r,
        required: i,
        value: P,
        onChange: h.handleChange,
        onBlur: h.handleBlur,
        error: O && !!F,
        helperText: O && F,
        ...c
      }
    );
  } });
}, ve = ({
  name: t = "email",
  label: e = "Email address",
  placeholder: n = "Enter your email address",
  InputProps: r = {},
  ...i
}) => /* @__PURE__ */ o(
  A,
  {
    type: "email",
    schema: I().email(),
    name: t,
    label: e,
    placeholder: n,
    InputProps: {
      endAdornment: /* @__PURE__ */ o(w, { position: "end", children: /* @__PURE__ */ o(me, {}) }),
      ...r
    },
    ...i
  }
), Ee = ({
  name: t = "first_name",
  label: e = "First name",
  placeholder: n = "Enter your first name",
  InputProps: r = {},
  ...i
}) => /* @__PURE__ */ o(
  A,
  {
    schema: Pe.first_name,
    name: t,
    label: e,
    placeholder: n,
    InputProps: {
      endAdornment: /* @__PURE__ */ o(w, { position: "end", children: /* @__PURE__ */ o(ge, {}) }),
      ...r
    },
    ...i
  }
), q = {
  behavior: "smooth",
  block: "start"
}, Be = ({
  scrollIntoViewOptions: t = q,
  ...e
}) => {
  const n = ee(null);
  return B(() => {
    n.current && n.current.scrollIntoView(t);
  }, [t]), /* @__PURE__ */ o(M, { ref: n, error: !0, ...e });
}, Y = ({
  children: t,
  scrollIntoViewOptions: e = q,
  nonFieldErrorsProps: n,
  fieldRefs: r = [],
  ...i
}) => /* @__PURE__ */ o(oe, { ...i, children: (s) => {
  const l = !!Object.keys(s.errors).length, d = l && typeof s.errors.__all__ == "string";
  if (l && !d && s.isSubmitting && r.length) {
    const a = ue(s.errors), u = r.find(({ name: c }) => a.includes(c))?.inputRef.current;
    u && u.scrollIntoView(e);
  }
  return /* @__PURE__ */ k(j, { children: [
    d && /* @__PURE__ */ o(Be, { ...n, children: s.errors.__all__ }),
    /* @__PURE__ */ o(ne, { children: typeof t == "function" ? t(s) : t })
  ] });
} }), Ie = ({
  useMutation: t,
  submitOptions: e,
  ...n
}) => {
  const [r] = t();
  return /* @__PURE__ */ o(
    Y,
    {
      ...n,
      onSubmit: ce(
        r,
        n.initialValues,
        e
      )
    }
  );
}, Ve = (t) => "onSubmit" in t ? /* @__PURE__ */ o(Y, { ...t }) : Ie(t), Ae = ({
  name: t = "otp",
  label: e = "OTP",
  placeholder: n = "Enter your OTP",
  ...r
}) => /* @__PURE__ */ o(
  A,
  {
    name: t,
    label: e,
    schema: I().matches(/^[0-9]{6}$/, "Must be exactly 6 digits."),
    placeholder: n,
    required: !0,
    ...r
  }
), Le = ({
  id: t,
  repeatName: e,
  setValue: n,
  fieldProps: r,
  name: i,
  label: s,
  placeholder: l,
  type: d,
  ...a
}) => {
  const { form: u } = r, c = i.split("."), m = y(u.values, c), p = e.split("."), f = y(
    u.values,
    p
  ), C = y(
    u.touched,
    p
  ), g = y(u.errors, p);
  return B(() => {
    n(m);
  }, [n, m]), /* @__PURE__ */ o(
    N,
    {
      required: !0,
      type: d,
      label: s ?? `Repeat ${i.replace("_", " ")}`,
      placeholder: l ?? `Enter your ${i.replace("_", " ")} again`,
      id: t ?? e,
      name: e,
      value: f,
      onChange: u.handleChange,
      onBlur: u.handleBlur,
      error: C && !!g,
      helperText: C && g,
      ...a
    }
  );
}, z = ({
  name: t,
  type: e = "text",
  validateOptions: n,
  ...r
}) => {
  const [i, s] = E(""), l = `${t}_repeat`, d = {
    name: l,
    type: e,
    validate: V(
      I().required().equals([i], "does not match"),
      n
    )
  };
  return /* @__PURE__ */ o(T, { ...d, children: (a) => /* @__PURE__ */ o(
    Le,
    {
      name: t,
      type: e,
      repeatName: l,
      setValue: s,
      fieldProps: a,
      ...r
    }
  ) });
}, je = ({
  name: t = "password",
  label: e = "Password",
  placeholder: n = "Enter your password",
  schema: r = I(),
  InputProps: i = {},
  withRepeatField: s = !1,
  repeatFieldProps: l = {},
  ...d
}) => {
  const [a, u] = E(!1), c = a ? "text" : "password", m = /* @__PURE__ */ o(w, { position: "end", children: /* @__PURE__ */ o(
    Q,
    {
      onClick: () => {
        u((p) => !p);
      },
      edge: "end",
      children: a ? /* @__PURE__ */ o(be, {}) : /* @__PURE__ */ o(ye, {})
    }
  ) });
  return /* @__PURE__ */ k(j, { children: [
    /* @__PURE__ */ o(
      A,
      {
        autoComplete: "off",
        type: c,
        name: t,
        label: e,
        schema: r,
        placeholder: n,
        InputProps: { endAdornment: m, ...i },
        ...d
      }
    ),
    s && /* @__PURE__ */ o(
      z,
      {
        name: t,
        type: c,
        ...l,
        InputProps: { endAdornment: m, ...l.InputProps }
      }
    )
  ] });
}, ke = ({
  children: t = "Submit",
  ...e
}) => {
  function n(r, i) {
    i = i || {};
    for (const s in r) {
      const l = r[s];
      i[s] = l instanceof Object && l.constructor === Object ? n(l, i) : !0;
    }
    return i;
  }
  return /* @__PURE__ */ o(T, { name: "submit", type: "submit", children: ({ form: r }) => /* @__PURE__ */ o(
    $,
    {
      type: "button",
      onClick: () => {
        r.setTouched(n(r.values), !0).then((i) => {
          const s = !!(i && Object.keys(i).length);
          r.setSubmitting(s), s || r.submitForm();
        });
      },
      ...e,
      children: t
    }
  ) });
}, Ne = ({
  textFieldProps: t,
  ...e
}) => {
  const {
    name: n = "uk_county",
    label: r = "UK county",
    placeholder: i = "Select your UK county",
    ...s
  } = t || {};
  return /* @__PURE__ */ o(
    L,
    {
      options: Oe,
      textFieldProps: { name: n, label: r, placeholder: i, ...s },
      ...e
    }
  );
}, tt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ApiAutocompleteField: xe,
  AutocompleteField: L,
  CheckboxField: Te,
  CountryField: _e,
  DatePickerField: Se,
  EmailField: ve,
  FirstNameField: Ee,
  Form: Ve,
  OtpField: Ae,
  PasswordField: je,
  RepeatField: z,
  SubmitButton: ke,
  TextField: A,
  UkCountyField: Ne
}, Symbol.toStringTag, { value: "Module" }));
export {
  xe as A,
  Te as C,
  Se as D,
  ve as E,
  Ee as F,
  Ae as O,
  je as P,
  z as R,
  ke as S,
  A as T,
  Ne as U,
  L as a,
  _e as b,
  Ve as c,
  tt as i
};
//# sourceMappingURL=index-CTYVnDkQ.js.map
