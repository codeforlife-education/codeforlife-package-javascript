import * as e from "yup";
import { UK_COUNTIES as m, COUNTRY_ISO_CODES as p } from "./utils/location.es.js";
import { numericId as t, uppercaseAsciiAlphanumericString as _, unicodeAlphanumericString as i, lowercaseAsciiAlphanumericString as q } from "./utils/schema.es.js";
import "react/jsx-runtime";
import "@mui/material";
import "react";
import "@mui/icons-material";
const s = {
  user: t(),
  teacher: t(),
  student: t(),
  school: t(),
  klass: _().length(5),
  authFactor: t(),
  otpBypassToken: t()
}, a = {
  id: s.teacher.required(),
  school: s.school,
  is_admin: e.bool().required()
}, u = {
  id: s.student.required(),
  school: s.school.required(),
  klass: s.klass.required(),
  auto_gen_password: e.string().required()
}, r = {
  id: s.user.required(),
  requesting_to_join_class: s.klass,
  first_name: i({
    spaces: !0,
    specialChars: "-'"
  }).required().max(150),
  last_name: i({
    spaces: !0,
    specialChars: "-'"
  }).max(150),
  last_login: e.date(),
  email: e.string().email(),
  password: e.string().required(),
  is_staff: e.bool().required(),
  is_active: e.bool().required(),
  date_joined: e.date().required(),
  teacher: e.object(a).optional(),
  student: e.object(u).optional()
}, n = {
  ...r,
  password: r.password.min(10, "must be at least 10 characters long").matches(/[A-Z]/, "must contain at least one uppercase letter").matches(/[a-z]/, "must contain at least one lowercase letter").matches(/[0-9]/, "must contain at least one digit").matches(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    "must contain at least one special character"
  ),
  email: r.email.required(),
  last_name: r.last_name.required(),
  teacher: r.teacher.required(),
  student: e.string().oneOf([void 0])
}, o = {
  ...a,
  school: a.school.required()
}, c = {
  ...n,
  teacher: e.object(o)
}, d = {
  ...o,
  is_admin: o.is_admin.isTrue()
}, g = {
  ...c,
  teacher: e.object(d)
}, l = {
  ...o,
  is_admin: o.is_admin.isFalse()
}, T = {
  ...c,
  teacher: e.object(l)
}, h = {
  ...a,
  school: e.string().oneOf([void 0]),
  is_admin: a.is_admin.isFalse()
}, S = {
  ...n,
  teacher: e.object(h)
}, f = {
  ...r,
  password: r.password.min(6, "must be at least 6 characters long"),
  email: r.email.oneOf([void 0]),
  last_name: r.last_name.oneOf([void 0]),
  teacher: e.string().oneOf([void 0]),
  student: r.student.required()
}, b = {
  ...r,
  password: r.password.min(8, "must be at least 8 characters long").matches(/[A-Z]/, "must contain at least one uppercase letter").matches(/[a-z]/, "must contain at least one lowercase letter").matches(/[0-9]/, "must contain at least one digit"),
  email: r.email.required(),
  last_name: r.last_name.required(),
  teacher: e.string().oneOf([void 0]),
  student: e.string().oneOf([void 0])
}, O = {
  ...a,
  user: s.user.required()
}, k = {
  ...o,
  user: s.user.required()
}, w = {
  ...d,
  user: s.user.required()
}, A = {
  ...l,
  user: s.user.required()
}, j = {
  ...h,
  user: s.user.required()
}, v = {
  ...u,
  user: s.user.required()
}, y = {
  id: s.school.required(),
  name: i({
    spaces: !0,
    specialChars: "'."
  }).required().max(200),
  country: e.string().oneOf(p),
  uk_county: e.string().oneOf(m)
}, U = {
  id: s.klass.required(),
  teacher: s.teacher.required(),
  school: s.school.required(),
  name: i({
    spaces: !0,
    specialChars: "-_"
  }).required().max(200),
  read_classmates_data: e.bool().required(),
  receive_requests_until: e.date()
}, C = {
  id: s.authFactor.required(),
  user: s.user.required(),
  type: e.string().oneOf(["otp"]).required()
}, x = {
  id: s.otpBypassToken.required(),
  user: s.user.required(),
  token: q().required().length(8)
}, Z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  adminSchoolTeacher: w,
  adminSchoolTeacherUser: g,
  authFactor: C,
  indyUser: b,
  klass: U,
  nonAdminSchoolTeacher: A,
  nonAdminSchoolTeacherUser: T,
  nonSchoolTeacher: j,
  nonSchoolTeacherUser: S,
  otpBypassToken: x,
  school: y,
  schoolTeacher: k,
  schoolTeacherUser: c,
  student: v,
  studentUser: f,
  teacher: O,
  teacherUser: n,
  user: r
}, Symbol.toStringTag, { value: "Module" }));
export {
  Z as s,
  r as u
};
//# sourceMappingURL=schemas-XzwqFsHM.js.map
