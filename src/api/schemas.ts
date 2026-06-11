import * as yup from "yup"

import type {
  AdminSchoolTeacher,
  AdminSchoolTeacherUser,
  AuthFactor,
  Class,
  IndependentUser,
  NonAdminSchoolTeacher,
  NonAdminSchoolTeacherUser,
  NonSchoolTeacher,
  NonSchoolTeacherUser,
  OtpBypassToken,
  School,
  SchoolTeacher,
  SchoolTeacherUser,
  Student,
  StudentUser,
  Teacher,
  TeacherUser,
  User,
} from "./models"
import { COUNTRY_ISO_CODES, UK_COUNTIES } from "../utils/location"
import {
  lowercaseAsciiAlphanumericString,
  numericId,
  unicodeAlphanumericString,
  uppercaseAsciiAlphanumericString,
} from "../utils/schema"
import { type Schemas } from "../utils/api"

// NOTE: do not use .required() here.
const id = {
  user: numericId(),
  teacher: numericId(),
  student: numericId(),
  school: numericId(),
  klass: uppercaseAsciiAlphanumericString().length(5),
  authFactor: numericId(),
  otpBypassToken: numericId(),
}

// -----------------------------------------------------------------------------
// User Schemas
// -----------------------------------------------------------------------------

const _userTeacher: Omit<Schemas<Teacher>, "user"> = {
  id: id.teacher.required(),
  school: id.school,
  is_admin: yup.bool().required(),
}

const _userStudent: Omit<Schemas<Student>, "user"> = {
  id: id.student.required(),
  school: id.school.required(),
  klass: id.klass.required(),
  auto_gen_password: yup.string().required(),
}

export const user: Schemas<User> = {
  id: id.user.required(),
  requesting_to_join_class: id.klass,
  first_name: unicodeAlphanumericString({
    spaces: true,
    specialChars: "-'",
  })
    .required()
    .max(150),
  last_name: unicodeAlphanumericString({
    spaces: true,
    specialChars: "-'",
  }).max(150),
  last_login: yup.date(),
  email: yup.string().email(),
  password: yup.string().required(),
  is_staff: yup.bool().required(),
  is_active: yup.bool().required(),
  date_joined: yup.date().required(),
  teacher: yup.object(_userTeacher).optional(),
  student: yup.object(_userStudent).optional(),
}

export const teacherUser: Schemas<TeacherUser> = {
  ...user,
  password: user.password
    .min(10, "must be at least 10 characters long")
    .matches(/[A-Z]/, "must contain at least one uppercase letter")
    .matches(/[a-z]/, "must contain at least one lowercase letter")
    .matches(/[0-9]/, "must contain at least one digit")
    .matches(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "must contain at least one special character",
    ),
  email: user.email.required(),
  last_name: user.last_name.required(),
  teacher: user.teacher.required(),
  student: yup.string().oneOf([undefined]),
}

const _userSchoolTeacher: Omit<Schemas<SchoolTeacher>, "user"> = {
  ..._userTeacher,
  school: _userTeacher.school.required(),
}

export const schoolTeacherUser: Schemas<SchoolTeacherUser> = {
  ...teacherUser,
  teacher: yup.object(_userSchoolTeacher),
}

const _userAdminSchoolTeacher: Omit<Schemas<AdminSchoolTeacher>, "user"> = {
  ..._userSchoolTeacher,
  is_admin: _userSchoolTeacher.is_admin.isTrue(),
}

export const adminSchoolTeacherUser: Schemas<AdminSchoolTeacherUser> = {
  ...schoolTeacherUser,
  teacher: yup.object(_userAdminSchoolTeacher),
}

const _userNonAdminSchoolTeacher: Omit<
  Schemas<NonAdminSchoolTeacher>,
  "user"
> = {
  ..._userSchoolTeacher,
  is_admin: _userSchoolTeacher.is_admin.isFalse(),
}

export const nonAdminSchoolTeacherUser: Schemas<NonAdminSchoolTeacherUser> = {
  ...schoolTeacherUser,
  teacher: yup.object(_userNonAdminSchoolTeacher),
}

const _userNonSchoolTeacher: Omit<Schemas<NonSchoolTeacher>, "user"> = {
  ..._userTeacher,
  school: yup.string().oneOf([undefined]),
  is_admin: _userTeacher.is_admin.isFalse(),
}

export const nonSchoolTeacherUser: Schemas<NonSchoolTeacherUser> = {
  ...teacherUser,
  teacher: yup.object(_userNonSchoolTeacher),
}

export const studentUser: Schemas<StudentUser> = {
  ...user,
  password: user.password.min(6, "must be at least 6 characters long"),
  email: user.email.oneOf([undefined]),
  last_name: user.last_name.oneOf([undefined]),
  teacher: yup.string().oneOf([undefined]),
  student: user.student.required(),
}

export const indyUser: Schemas<IndependentUser> = {
  ...user,
  password: user.password
    .min(8, "must be at least 8 characters long")
    .matches(/[A-Z]/, "must contain at least one uppercase letter")
    .matches(/[a-z]/, "must contain at least one lowercase letter")
    .matches(/[0-9]/, "must contain at least one digit"),
  email: user.email.required(),
  last_name: user.last_name.required(),
  teacher: yup.string().oneOf([undefined]),
  student: yup.string().oneOf([undefined]),
}

// -----------------------------------------------------------------------------
// Teacher Schemas
// -----------------------------------------------------------------------------

export const teacher: Schemas<Teacher> = {
  ..._userTeacher,
  user: id.user.required(),
}

export const schoolTeacher: Schemas<SchoolTeacher> = {
  ..._userSchoolTeacher,
  user: id.user.required(),
}

export const adminSchoolTeacher: Schemas<AdminSchoolTeacher> = {
  ..._userAdminSchoolTeacher,
  user: id.user.required(),
}

export const nonAdminSchoolTeacher: Schemas<NonAdminSchoolTeacher> = {
  ..._userNonAdminSchoolTeacher,
  user: id.user.required(),
}

export const nonSchoolTeacher: Schemas<NonSchoolTeacher> = {
  ..._userNonSchoolTeacher,
  user: id.user.required(),
}

// -----------------------------------------------------------------------------
// Other Schemas
// -----------------------------------------------------------------------------

export const student: Schemas<Student> = {
  ..._userStudent,
  user: id.user.required(),
}

export const school: Schemas<School> = {
  id: id.school.required(),
  name: unicodeAlphanumericString({
    spaces: true,
    specialChars: "'.",
  })
    .required()
    .max(200),
  country: yup.string().oneOf(COUNTRY_ISO_CODES),
  uk_county: yup.string().oneOf(UK_COUNTIES),
}

export const klass: Schemas<Class> = {
  id: id.klass.required(),
  teacher: id.teacher.required(),
  school: id.school.required(),
  name: unicodeAlphanumericString({
    spaces: true,
    specialChars: "-_",
  })
    .required()
    .max(200),
  read_classmates_data: yup.bool().required(),
  receive_requests_until: yup.date(),
}

export const authFactor: Schemas<AuthFactor> = {
  id: id.authFactor.required(),
  user: id.user.required(),
  type: yup
    .string()
    .oneOf(["otp"] as const)
    .required(),
}

export const otpBypassToken: Schemas<OtpBypassToken> = {
  id: id.otpBypassToken.required(),
  user: id.user.required(),
  token: lowercaseAsciiAlphanumericString().required().length(8),
}
