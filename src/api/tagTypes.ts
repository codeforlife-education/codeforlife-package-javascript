const tagTypes = [
  // These are the tags for the common models used throughout our system.
  // https://github.com/codeforlife-education/codeforlife-package-python/tree/main/codeforlife/user/models
  // NOTE: Don't use the "Teacher" and "Student" tags. Use "User" instead.
  "User",
  "School",
  "Class",
  "AuthFactor",
] as const

export default tagTypes
export type TagTypes = (typeof tagTypes)[number]
